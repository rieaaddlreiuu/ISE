import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const docsDirectory = path.join(process.cwd(), 'docs');
const markdownExtension = '.md';

export type DocItem = {
    slug: string;
    fileName: string;
    title: string;
    updatedAt: Date;
};

function titleFromMarkdown(content: string, fallback: string) {
    const heading = content
        .split('\n')
        .map((line) => line.trim())
        .find((line) => line.startsWith('# '));

    return heading ? heading.slice(2).trim() : fallback;
}

function stripLeadingTitleHeading(content: string) {
    return content.replace(/^\uFEFF?(?:[ \t]*\r?\n)*# [^\n]+(?:\r?\n)+(?:[ \t]*\r?\n)*/, '');
}

function normalizeToPosixPath(inputPath: string) {
    return inputPath.replaceAll('\\', '/');
}

function encodeDocSlug(relativePathWithoutExtension: string) {
    return normalizeToPosixPath(relativePathWithoutExtension)
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');
}

function decodeDocSlug(slug: string) {
    return normalizeToPosixPath(slug)
        .split('/')
        .map((segment) => {
            try {
                return decodeURIComponent(segment);
            } catch {
                return segment;
            }
        })
        .join('/');
}

function isSafeRelativeDocPath(relativePath: string) {
    const normalized = normalizeToPosixPath(relativePath);
    if (normalized.length === 0) return false;
    if (normalized.startsWith('/')) return false;
    if (normalized.includes('\0')) return false;
    if (!normalized.endsWith(markdownExtension)) return false;

    const segments = normalized.split('/');
    if (segments.some((segment) => segment.length === 0 || segment === '.' || segment === '..')) {
        return false;
    }

    return true;
}

async function collectMarkdownRelativePaths(directoryPath: string, prefix = ''): Promise<string[]> {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const nested = await Promise.all(
        entries.map(async (entry) => {
            if (entry.name.startsWith('.')) return [] as string[];

            const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
            const absolutePath = path.join(directoryPath, entry.name);

            if (entry.isDirectory()) {
                return collectMarkdownRelativePaths(absolutePath, nextPrefix);
            }

            if (entry.isFile() && entry.name.endsWith(markdownExtension)) {
                return [nextPrefix];
            }

            return [] as string[];
        }),
    );

    return nested.flat();
}

export async function listDocs(): Promise<DocItem[]> {
    const relativePaths = await collectMarkdownRelativePaths(docsDirectory);
    const docs = await Promise.all(
        relativePaths.map(async (relativePath) => {
            const normalizedRelativePath = normalizeToPosixPath(relativePath);
            const filePath = path.join(docsDirectory, ...normalizedRelativePath.split('/'));
            const [content, fileStat] = await Promise.all([readFile(filePath, 'utf8'), stat(filePath)]);
            const relativePathWithoutExtension = normalizedRelativePath.slice(0, -markdownExtension.length);
            const slug = encodeDocSlug(relativePathWithoutExtension);

            return {
                slug,
                fileName: normalizedRelativePath,
                title: titleFromMarkdown(content, relativePathWithoutExtension),
                updatedAt: fileStat.mtime,
            };
        }),
    );

    return docs.toSorted((a, b) => a.fileName.localeCompare(b.fileName));
}

export async function getDoc(slug: string) {
    const normalizedSlug = normalizeToPosixPath(slug).trim();
    const decodedSlug = decodeDocSlug(normalizedSlug);
    const relativePath = `${decodedSlug}${markdownExtension}`;
    if (!isSafeRelativeDocPath(relativePath)) {
        return null;
    }

    const fileName = relativePath;
    const filePath = path.join(docsDirectory, ...fileName.split('/'));

    try {
        const [content, fileStat] = await Promise.all([
            readFile(filePath, 'utf8'),
            stat(filePath),
        ]);

        return {
            slug: normalizedSlug,
            fileName,
            title: titleFromMarkdown(content, decodedSlug),
            content: stripLeadingTitleHeading(content),
            updatedAt: fileStat.mtime,
        };
    } catch {
        return null;
    }
}
