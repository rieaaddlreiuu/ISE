import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const allowedStatuses = new Set(['draft', 'review', 'ready', 'published']);
const allowedSortFields = new Set(['updatedAt', 'createdAt', 'title', 'serialCode']);
const allowedOrders = new Set(['asc', 'desc']);

export type ProblemListQuery = {
    q?: string;
    status?: string;
    subject?: string;
    tag?: string;
    page?: string;
    pageSize?: string;
    sort?: string;
    order?: string;
};

export type ProblemListItem = {
    id: string;
    serialCode: string;
    title: string;
    statement: string;
    subject: string;
    domain: string | null;
    tagsText: string | null;
    tags: string[];
    status: string;
    sourceType: string | null;
    sourceDetail: string | null;
    difficultySelf: number | null;
    targetLevel: string | null;
    estimatedSolveTime: number | null;
    createdAt: string;
    updatedAt: string;
};

export type ProblemListResponse = {
    items: ProblemListItem[];
    total: number;
    page: number;
    pageSize: number;
};

type ParsedProblemListQuery = {
    q?: string;
    status?: string;
    subject?: string;
    tag?: string;
    page: number;
    pageSize: number;
    sort: Prisma.ProblemOrderByWithRelationInput;
};

export class ProblemListQueryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProblemListQueryError';
    }
}

function parseOptionalTrimmed(value: string | undefined) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}

function parsePositiveInt(value: string | undefined, fallback: number, label: string) {
    const trimmed = parseOptionalTrimmed(value);
    if (!trimmed) {
        return fallback;
    }

    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed < 1) {
        throw new ProblemListQueryError(`${label} must be a positive integer`);
    }

    return parsed;
}

export function parseProblemListQuery(query: ProblemListQuery): ParsedProblemListQuery {
    const q = parseOptionalTrimmed(query.q);
    const status = parseOptionalTrimmed(query.status);
    const subject = parseOptionalTrimmed(query.subject);
    const tag = parseOptionalTrimmed(query.tag);
    const page = parsePositiveInt(query.page, DEFAULT_PAGE, 'page');
    const pageSize = parsePositiveInt(query.pageSize, DEFAULT_PAGE_SIZE, 'pageSize');
    const sortField = parseOptionalTrimmed(query.sort) ?? 'updatedAt';
    const order = parseOptionalTrimmed(query.order) ?? 'desc';

    if (status && !allowedStatuses.has(status)) {
        throw new ProblemListQueryError('status must be one of draft, review, ready, published');
    }

    if (!allowedSortFields.has(sortField)) {
        throw new ProblemListQueryError('sort must be one of updatedAt, createdAt, title, serialCode');
    }

    if (!allowedOrders.has(order)) {
        throw new ProblemListQueryError('order must be asc or desc');
    }

    return {
        q,
        status,
        subject,
        tag,
        page,
        pageSize: Math.min(pageSize, MAX_PAGE_SIZE),
        sort: { [sortField]: order as Prisma.SortOrder },
    };
}

function splitTags(tagsText: string | null) {
    if (!tagsText) {
        return [];
    }

    return tagsText
        .split(/[\n,、，]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
}

function buildWhereClause(query: ParsedProblemListQuery): Prisma.ProblemWhereInput {
    const and: Prisma.ProblemWhereInput[] = [{ archivedAt: null }];

    if (query.status) {
        and.push({ status: query.status });
    }

    if (query.subject) {
        and.push({ subject: query.subject });
    }

    if (query.tag) {
        and.push({ tagsText: { contains: query.tag } });
    }

    if (query.q) {
        and.push({
            OR: [
                { serialCode: { contains: query.q } },
                { title: { contains: query.q } },
                { statementMd: { contains: query.q } },
                { tagsText: { contains: query.q } },
                { domain: { contains: query.q } },
            ],
        });
    }

    return { AND: and };
}

export async function listProblems(rawQuery: ProblemListQuery): Promise<ProblemListResponse> {
    const query = parseProblemListQuery(rawQuery);
    const where = buildWhereClause(query);
    const skip = (query.page - 1) * query.pageSize;

    const [total, problems] = await prisma.$transaction([
        prisma.problem.count({ where }),
        prisma.problem.findMany({
            where,
            orderBy: query.sort,
            skip,
            take: query.pageSize,
        }),
    ]);

    return {
        items: problems.map((problem) => ({
            id: problem.id,
            serialCode: problem.serialCode,
            title: problem.title,
            statement: problem.statementMd,
            subject: problem.subject,
            domain: problem.domain,
            tagsText: problem.tagsText,
            tags: splitTags(problem.tagsText),
            status: problem.status,
            sourceType: problem.sourceType,
            sourceDetail: problem.sourceDetail,
            difficultySelf: problem.difficultySelf,
            targetLevel: problem.targetLevel,
            estimatedSolveTime: problem.estimatedSolveTime,
            createdAt: problem.createdAt.toISOString(),
            updatedAt: problem.updatedAt.toISOString(),
        })),
        total,
        page: query.page,
        pageSize: query.pageSize,
    };
}
