import { cache } from 'react';
import type { ProblemAsset } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { listProblems, type ProblemListQuery } from '@/lib/backend/problems';
import type { ProblemEditScreenData } from '@/mocks/problemEdit';
import type { ProblemDetail } from '@/mocks/problemDetails';

const subjectLabels: Record<string, string> = {
    math: '数学',
    physics: '物理',
    chemistry: '化学',
    japanese: '国語',
    english: '英語',
    other: 'その他',
};

const statusLabels: Record<string, string> = {
    draft: '下書き',
    review: 'レビュー中',
    ready: '公開準備完了',
    published: '公開中',
};

const destinationLabels: Record<string, string> = {
    booklet: '冊子',
    web: 'Web',
    print: '印刷',
    teacher: '教員向け',
};

function splitTags(tagsText: string | null) {
    if (!tagsText) {
        return [];
    }

    return tagsText
        .split(/[\n,、]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
}

function formatDate(value: Date) {
    return value.toISOString().slice(0, 16).replace('T', ' ');
}

function formatSubject(subject: string) {
    return subjectLabels[subject] ?? subject;
}

function formatStatus(status: string) {
    return statusLabels[status] ?? status;
}

function difficultyFormValueFromNumber(value: number | null) {
    return value === null ? '' : String(value);
}

function tagsFromProblem(problem: { tagsText: string | null; problemTags?: Array<{ tag: { name: string } }> }) {
    const relationTags = problem.problemTags?.map((problemTag) => problemTag.tag.name) ?? [];
    return relationTags.length > 0 ? relationTags : splitTags(problem.tagsText);
}

function tagIdsFromProblem(problem: { problemTags?: Array<{ tagId: string }> }) {
    return problem.problemTags?.map((problemTag) => problemTag.tagId) ?? [];
}

export function difficultyNumberFromFormValue(value: string) {
    const parsed = Number(value.trim());

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 11) {
        throw new Error('difficulty must be an integer from 1 to 11');
    }

    return parsed;
}

function formatDifficulty(value: number | null) {
    return value === null ? '未設定' : `難易度 ${value}`;
}

function formatBytes(value: number | null) {
    if (value === null) {
        return 'サイズ不明';
    }

    if (value < 1024) {
        return `${value} B`;
    }

    if (value < 1024 * 1024) {
        return `${Math.round(value / 102.4) / 10} KB`;
    }

    return `${Math.round(value / 104857.6) / 10} MB`;
}

function parseDestinations(value: string | null) {
    if (!value) {
        return [];
    }

    return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

function formatDestinations(value: string | null) {
    return parseDestinations(value).map((item) => destinationLabels[item] ?? item);
}

function toAssetView(asset: ProblemAsset) {
    const alt = asset.altText?.trim() || asset.fileName;

    return {
        id: asset.id,
        name: asset.fileName,
        kind: asset.mimeType,
        dimensions:
            asset.width && asset.height
                ? `${asset.width} x ${asset.height}`
                : 'サイズ不明',
        sizeLabel: formatBytes(asset.sizeBytes),
        updatedAt: formatDate(asset.updatedAt),
        usageHint: alt,
        markdownSnippet: `![${alt}](${asset.storageKey})`,
    };
}

const getProblemRecordCached = cache(async (problemId: string) => {
    return prisma.problem.findFirst({
        where: {
            id: problemId,
            archivedAt: null,
        },
        include: {
            assets: {
                orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            },
            problemTags: {
                include: {
                    tag: true,
                },
                orderBy: {
                    tag: {
                        name: 'asc',
                    },
                },
            },
        },
    });
});

export async function getProblemRecord(problemId: string) {
    return getProblemRecordCached(problemId);
}

export async function getProblemDetailView(problemId: string): Promise<ProblemDetail | null> {
    const problem = await getProblemRecord(problemId);
    if (!problem) {
        return null;
    }

    const tags = tagsFromProblem(problem);
    const destinations = formatDestinations(problem.sourceType);

    return {
        id: problem.serialCode,
        title: problem.title,
        subject: formatSubject(problem.subject),
        level: formatDifficulty(problem.difficultySelf),
        difficultySelf: problem.difficultySelf,
        format: problem.targetLevel ?? 'Descriptive',
        status: problem.status,
        source: problem.sourceDetail ?? 'Not set',
        updatedAt: formatDate(problem.updatedAt),
        createdBy: 'Database',
        destinations,
        tags,
        statement: problem.statementMd,
        answer: problem.answerMd ?? '解答はまだ登録されていません。',
        commentary: problem.explanationMd ?? '解説はまだ登録されていません。',
        reviewMemo: problem.authorMemoMd ?? 'メモはまだ登録されていません。',
        checklist: [
            problem.statementMd.trim().length > 0 ? '問題文あり' : '問題文未登録',
            problem.answerMd ? '解答あり' : '解答未登録',
            problem.explanationMd ? '解説あり' : '解説未登録',
        ],
        assets: problem.assets.map(toAssetView),
        ai: {
            difficulty: {
                current: formatDifficulty(problem.difficultySelf),
                suggested: formatDifficulty(problem.difficultySelf),
                confidence: '-',
                rationale: 'AI レビューはまだ DB 連携していません。',
                lastRunAt: '未実行',
            },
            commentaryDraft: {
                statusLabel: '未利用',
                summary: 'AI 解説下書きはまだ DB 連携していません。',
                preview: problem.explanationMd ?? '解説下書きはまだありません。',
                saveHint: '解説の変更は本文編集画面から保存してください。',
                lastRunAt: '未実行',
            },
        },
        timeline: [
            { label: '作成日時', value: formatDate(problem.createdAt) },
            { label: '更新日時', value: formatDate(problem.updatedAt) },
            { label: 'ステータス', value: formatStatus(problem.status) },
        ],
    };
}

export async function getProblemEditScreenData(problemId: string): Promise<ProblemEditScreenData | null> {
    const problem = await getProblemRecord(problemId);
    if (!problem) {
        return null;
    }

    const tags = tagsFromProblem(problem).join(', ');
    const destinations = parseDestinations(problem.sourceType);

    return {
        form: {
            id: problem.serialCode,
            title: problem.title,
            status: problem.status,
            subject: problem.subject,
            difficulty: difficultyFormValueFromNumber(problem.difficultySelf),
            format: problem.targetLevel ?? 'descriptive',
            tags,
            tagIds: tagIdsFromProblem(problem),
            statement: problem.statementMd,
            answerPolicy: problem.explanationMd ?? '',
            gradingMemo: problem.authorMemoMd ?? '',
            source: problem.sourceDetail ?? '',
            notes: '',
            destinations,
            updatedAt: formatDate(problem.updatedAt),
            editor: 'Database',
        },
        progress: [
            {
                label: 'メタ情報',
                value: problem.title.trim().length > 0 ? '入力済み' : '未入力',
                note: `${formatSubject(problem.subject)} / ${formatStatus(problem.status)}`,
            },
            {
                label: '本文',
                value: problem.statementMd.trim().length > 0 ? '入力済み' : '未入力',
                note: problem.answerMd ? '解答あり' : '解答なし',
            },
            {
                label: '画像',
                value: `${problem.assets.length}件`,
                note: problem.assets.length > 0 ? '登録あり' : '登録なし',
            },
        ],
        checklist: [
            problem.statementMd.trim().length > 0 ? '問題文は入力済みです' : '問題文を入力してください',
            problem.answerMd ? '解答は入力済みです' : '解答を入力してください',
            problem.sourceDetail ? '出典は入力済みです' : '出典を入力してください',
        ],
        activities: [
            {
                label: '作成',
                detail: `${problem.serialCode} として登録済み`,
                timestamp: formatDate(problem.createdAt),
            },
            {
                label: '更新',
                detail: `現在のステータス: ${formatStatus(problem.status)}`,
                timestamp: formatDate(problem.updatedAt),
            },
        ],
    };
}

export async function getProblemListView(query: ProblemListQuery) {
    const [response, totalCount, draftCount, publishedCount] = await Promise.all([
        listProblems(query),
        prisma.problem.count({
            where: {
                archivedAt: null,
            },
        }),
        prisma.problem.count({
            where: {
                archivedAt: null,
                status: 'draft',
            },
        }),
        prisma.problem.count({
            where: {
                archivedAt: null,
                status: 'published',
            },
        }),
    ]);

    return {
        ...response,
        summary: {
            total: totalCount,
            draft: draftCount,
            published: publishedCount,
        },
    };
}
