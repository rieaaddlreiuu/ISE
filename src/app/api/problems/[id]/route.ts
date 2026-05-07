import { prisma } from '@/lib/prisma';

function notFoundResponse() {
    return Response.json({ message: 'Problem not found' }, { status: 404 });
}

function parseTags(tagsText: string | null) {
    if (!tagsText) {
        return [];
    }

    return tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
}

function tagsFromProblem(problem: { tagsText: string | null; problemTags?: Array<{ tag: { name: string } }> }) {
    const relationTags = problem.problemTags?.map((problemTag) => problemTag.tag.name) ?? [];
    return relationTags.length > 0 ? relationTags : parseTags(problem.tagsText);
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    if (!id) {
        return notFoundResponse();
    }

    const problem = await prisma.problem.findUnique({
        where: { id },
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

    if (!problem || problem.archivedAt) {
        return notFoundResponse();
    }

    return Response.json({
        ...problem,
        tags: tagsFromProblem(problem),
    });
}
