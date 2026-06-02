import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { PluggableList } from "unified";

const markdownSanitizeSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary"],
    attributes: {
        ...defaultSchema.attributes,
        details: [...(defaultSchema.attributes?.details ?? []), "open"],
        summary: defaultSchema.attributes?.summary ?? [],
    },
};

export const markdownRemarkPlugins: PluggableList = [remarkGfm, remarkMath];

export const markdownRehypePlugins: PluggableList = [
    rehypeRaw,
    [rehypeSanitize, markdownSanitizeSchema],
    rehypeKatex,
];

type MarkdownTextSegment = {
    type: "text";
    content: string;
};

type MarkdownDetailsSegment = {
    type: "details";
    body: string;
    open: boolean;
    summary: string;
};

export type MarkdownSegment = MarkdownTextSegment | MarkdownDetailsSegment;

export function parseDetailsBlocks(content: string): MarkdownSegment[] {
    const segments: MarkdownSegment[] = [];
    let cursor = 0;

    while (cursor < content.length) {
        const start = findNextDetailsStart(content, cursor);

        if (!start) {
            pushTextSegment(segments, content.slice(cursor));
            break;
        }

        pushTextSegment(segments, content.slice(cursor, start.index));

        const close = findMatchingDetailsClose(content, start.end);

        if (!close) {
            pushTextSegment(segments, content.slice(start.index));
            break;
        }

        const inner = content.slice(start.end, close.index);
        const summary = extractSummary(inner);

        if (!summary) {
            pushTextSegment(segments, content.slice(start.index, close.end));
        } else {
            segments.push({
                type: "details",
                body: summary.body,
                open: /\sopen(?:\s|=|>|\/)/i.test(start.tag),
                summary: summary.content,
            });
        }

        cursor = close.end;
    }

    return segments;
}

export function normalizeDisplayMathBlocks(content: string) {
    content = normalizeBlockquoteHtml(content);

    let result = '';
    let index = 0;
    let inDisplayMath = false;

    while (index < content.length) {
        if (content.slice(index, index + 2) === '$$') {
            const quotePrefix = getActiveBlockquotePrefix(result);
            const previousChar = getPreviousContentChar(result, quotePrefix);
            const nextChar = content[index + 2];

            if (previousChar && previousChar !== '\n') {
                result += `\n${quotePrefix}`;
            }

            result += '$$';
            inDisplayMath = !inDisplayMath;

            if (!inDisplayMath) {
                if (nextChar && nextChar !== '\n') {
                    result += `\n${quotePrefix}`;
                }
            } else if (nextChar && nextChar !== '\n') {
                result += `\n${quotePrefix}`;
            }

            index += 2;
            continue;
        }

        result += content[index];
        index += 1;
    }

    return normalizeLatexDelimiters(result);
}

function normalizeBlockquoteHtml(content: string) {
    let result = '';
    let cursor = 0;

    while (cursor < content.length) {
        const start = findNextTagStart(content, cursor, 'blockquote');

        if (!start) {
            result += content.slice(cursor);
            break;
        }

        result += content.slice(cursor, start.index);

        const close = findMatchingTagClose(content, start.end, 'blockquote');

        if (!close) {
            result += content.slice(start.index);
            break;
        }

        const inner = normalizeBlockquoteHtml(content.slice(start.end, close.index)).trim();
        const quoted = toMarkdownBlockquote(inner);

        if (result.length > 0 && !result.endsWith('\n')) {
            result += '\n';
        }

        result += quoted;

        if (close.end < content.length && content[close.end] !== '\n') {
            result += '\n';
        }

        cursor = close.end;
    }

    return result;
}

function toMarkdownBlockquote(content: string) {
    const normalized = content.replace(/\r\n?/g, '\n');
    const lines = normalized.length > 0 ? normalized.split('\n') : [''];

    return lines.map((line) => (line.length > 0 ? `> ${line}` : '>')).join('\n');
}

function getActiveBlockquotePrefix(content: string) {
    const lineStart = content.lastIndexOf('\n') + 1;
    const line = content.slice(lineStart);
    const match = /^(>\s*)+/.exec(line);

    return match?.[0] ?? '';
}

function getPreviousContentChar(content: string, quotePrefix: string) {
    if (!quotePrefix) {
        return content.at(-1);
    }

    const lineStart = content.lastIndexOf('\n') + 1;
    const line = content.slice(lineStart);

    if (line === quotePrefix) {
        return '\n';
    }

    return content.at(-1);
}

function normalizeLatexDelimiters(content: string) {
    let result = '';
    let index = 0;

    while (index < content.length) {
        if (content.slice(index, index + 2) === '$$') {
            const end = content.indexOf('$$', index + 2);

            if (end === -1) {
                result += content.slice(index);
                break;
            }

            result += `$$${normalizeLatexDelimiterCommands(content.slice(index + 2, end))}$$`;
            index = end + 2;
            continue;
        }

        if (content[index] === '$') {
            const end = findInlineMathEnd(content, index + 1);

            if (end === -1) {
                result += content[index];
                index += 1;
                continue;
            }

            result += `$${normalizeLatexDelimiterCommands(content.slice(index + 1, end))}$`;
            index = end + 1;
            continue;
        }

        result += content[index];
        index += 1;
    }

    return result;
}

function normalizeLatexDelimiterCommands(math: string) {
    math = normalizeLatexMultilineSumLimits(math);

    let result = '';
    let index = 0;
    let openDelimiterCount = 0;

    while (index < math.length) {
        if (math[index] === '\\') {
            const command = readLatexCommand(math, index);

            if (command?.name === 'right') {
                const delimiter = readLatexDelimiter(math, command.end);

                if (delimiter && openDelimiterCount === 0 && isOpeningDelimiter(delimiter.value)) {
                    result += `\\left${math.slice(command.end, delimiter.end)}`;
                    openDelimiterCount += 1;
                    index = delimiter.end;
                    continue;
                }
            }

            if (command?.name === 'left') {
                const delimiter = readLatexDelimiter(math, command.end);

                if (delimiter && openDelimiterCount > 0 && isClosingDelimiter(delimiter.value)) {
                    result += `\\right${math.slice(command.end, delimiter.end)}`;
                    openDelimiterCount -= 1;
                    index = delimiter.end;
                    continue;
                }

                if (delimiter) {
                    openDelimiterCount += 1;
                }
            }

            if (command?.name === 'right' && openDelimiterCount > 0) {
                openDelimiterCount -= 1;
            }
        }

        result += math[index];
        index += 1;
    }

    return result;
}

function normalizeLatexMultilineSumLimits(math: string) {
    let result = '';
    let index = 0;

    while (index < math.length) {
        if (math[index] !== '\\') {
            result += math[index];
            index += 1;
            continue;
        }

        const command = readLatexCommand(math, index);

        if (command?.name !== 'sum') {
            result += math[index];
            index += 1;
            continue;
        }

        result += math.slice(index, command.end);
        index = command.end;

        while (/\s/.test(math[index] ?? '')) {
            result += math[index];
            index += 1;
        }

        if (math[index] !== '_') {
            continue;
        }

        const group = readLatexBraceGroup(math, index + 1);

        if (!group) {
            result += math[index];
            index += 1;
            continue;
        }

        result += `_{${normalizeLatexMultilineLimitGroup(group.content)}}`;
        index = group.end;
    }

    return result;
}

function normalizeLatexMultilineLimitGroup(content: string) {
    const normalized = content.replace(/\r\n?/g, '\n');

    if (!normalized.includes('\n') || /\\(?:substack|begin\s*\{(?:array|subarray|aligned|gathered|matrix|cases)\})/.test(normalized)) {
        return content;
    }

    const lines = normalized
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length <= 1) {
        return content;
    }

    return `\\substack{${lines.join('\\\\')}}`;
}

function readLatexBraceGroup(content: string, from: number) {
    if (content[from] !== '{') {
        return null;
    }

    let depth = 0;

    for (let index = from; index < content.length; index += 1) {
        const char = content[index];

        if (char === '\\') {
            index += 1;
            continue;
        }

        if (char === '{') {
            depth += 1;
            continue;
        }

        if (char === '}') {
            depth -= 1;

            if (depth === 0) {
                return {
                    content: content.slice(from + 1, index),
                    end: index + 1,
                };
            }
        }
    }

    return null;
}

function findInlineMathEnd(content: string, from: number) {
    for (let index = from; index < content.length; index += 1) {
        if (content[index] === '$' && content[index - 1] !== '\\') {
            return index;
        }
    }

    return -1;
}

function readLatexCommand(content: string, from: number) {
    const match = /^\\([A-Za-z]+)/.exec(content.slice(from));

    if (!match) {
        return null;
    }

    return {
        end: from + match[0].length,
        name: match[1],
    };
}

function readLatexDelimiter(content: string, from: number) {
    let index = from;

    while (/\s/.test(content[index] ?? '')) {
        index += 1;
    }

    if (content[index] === '\\') {
        const command = readLatexCommand(content, index);

        if (command) {
            return {
                end: command.end,
                value: content.slice(index, command.end),
            };
        }
    }

    if (content[index]) {
        return {
            end: index + 1,
            value: content[index],
        };
    }

    return null;
}

function isOpeningDelimiter(delimiter: string) {
    return delimiter === '(' || delimiter === '[' || delimiter === '\\{';
}

function isClosingDelimiter(delimiter: string) {
    return delimiter === ')' || delimiter === ']' || delimiter === '\\}';
}

function pushTextSegment(segments: MarkdownSegment[], content: string) {
    if (content.length === 0) {
        return;
    }

    const previous = segments.at(-1);

    if (previous?.type === "text") {
        previous.content += content;
        return;
    }

    segments.push({ type: "text", content });
}

function findNextDetailsStart(content: string, from: number) {
    return findNextTagStart(content, from, 'details');
}

function findMatchingDetailsClose(content: string, from: number) {
    return findMatchingTagClose(content, from, 'details');
}

function extractSummary(content: string) {
    const startMatch = /<summary\b/i.exec(content);

    if (!startMatch) {
        return null;
    }

    const startIndex = startMatch.index;
    const startEnd = findTagEnd(content, startIndex);

    if (startEnd === -1) {
        return null;
    }

    const closePattern = /<\/summary\s*>/i;
    const closeMatch = closePattern.exec(content.slice(startEnd + 1));

    if (!closeMatch) {
        return null;
    }

    const closeIndex = startEnd + 1 + closeMatch.index;
    const closeEnd = closeIndex + closeMatch[0].length;

    return {
        body: `${content.slice(0, startIndex)}${content.slice(closeEnd)}`,
        content: content.slice(startEnd + 1, closeIndex),
    };
}

function findTagEnd(content: string, from: number) {
    let quote: '"' | "'" | null = null;

    for (let index = from; index < content.length; index += 1) {
        const char = content[index];

        if ((char === '"' || char === "'") && quote === null) {
            quote = char;
            continue;
        }

        if (char === quote) {
            quote = null;
            continue;
        }

        if (char === ">" && quote === null) {
            return index;
        }
    }

    return -1;
}

function findNextTagStart(content: string, from: number, tagName: string) {
    const match = new RegExp(`<${tagName}\\b`, 'i').exec(content.slice(from));

    if (!match) {
        return null;
    }

    const index = from + match.index;
    const end = findTagEnd(content, index);

    if (end === -1) {
        return null;
    }

    return {
        end: end + 1,
        index,
        tag: content.slice(index, end + 1),
    };
}

function findMatchingTagClose(content: string, from: number, tagName: string) {
    const tagPattern = new RegExp(`</?${tagName}\\b`, 'gi');
    tagPattern.lastIndex = from;
    let depth = 1;

    while (true) {
        const match = tagPattern.exec(content);

        if (!match) {
            return null;
        }

        const tagEnd = findTagEnd(content, match.index);

        if (tagEnd === -1) {
            return null;
        }

        const tag = content.slice(match.index, tagEnd + 1);

        if (tag.startsWith("</")) {
            depth -= 1;

            if (depth === 0) {
                return {
                    end: tagEnd + 1,
                    index: match.index,
                };
            }
        } else if (!tag.endsWith("/>")) {
            depth += 1;
        }

        tagPattern.lastIndex = tagEnd + 1;
    }
}
