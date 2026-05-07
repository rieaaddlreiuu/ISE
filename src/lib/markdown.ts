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
    let result = '';
    let index = 0;
    let inDisplayMath = false;

    while (index < content.length) {
        if (content.slice(index, index + 2) === '$$') {
            const previousChar = result.at(-1);
            const nextChar = content[index + 2];

            if (previousChar && previousChar !== '\n') {
                result += '\n';
            }

            result += '$$';
            inDisplayMath = !inDisplayMath;

            if (!inDisplayMath) {
                if (nextChar && nextChar !== '\n') {
                    result += '\n';
                }
            } else if (nextChar && nextChar !== '\n') {
                result += '\n';
            }

            index += 2;
            continue;
        }

        result += content[index];
        index += 1;
    }

    return result;
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
    const match = /<details\b/i.exec(content.slice(from));

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

function findMatchingDetailsClose(content: string, from: number) {
    const tagPattern = /<\/?details\b/gi;
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
