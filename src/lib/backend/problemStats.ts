import { prisma } from '@/lib/prisma';

const difficultyValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

const statusOrder = ['draft', 'review', 'ready', 'published'] as const;

const subjectOrder = ['math', 'physics', 'chemistry', 'japanese', 'english', 'other'] as const;

export type ProblemStats = Awaited<ReturnType<typeof getProblemStats>>;

function percentage(count: number, total: number) {
    return total === 0 ? 0 : Math.round((count / total) * 1000) / 10;
}

export async function getProblemStats() {
    const where = { archivedAt: null };

    const [
        total,
        difficultyGroups,
        statusGroups,
        subjectGroups,
        targetLevelGroups,
        unsetDifficulty,
        unsetTargetLevel,
        unsetSolveTime,
    ] = await Promise.all([
        prisma.problem.count({ where }),
        prisma.problem.groupBy({
            by: ['difficultySelf'],
            where,
            _count: { _all: true },
            orderBy: { difficultySelf: 'asc' },
        }),
        prisma.problem.groupBy({
            by: ['status'],
            where,
            _count: { _all: true },
        }),
        prisma.problem.groupBy({
            by: ['subject'],
            where,
            _count: { _all: true },
        }),
        prisma.problem.groupBy({
            by: ['targetLevel'],
            where,
            _count: { _all: true },
            orderBy: { targetLevel: 'asc' },
        }),
        prisma.problem.count({ where: { ...where, difficultySelf: null } }),
        prisma.problem.count({ where: { ...where, targetLevel: null } }),
        prisma.problem.count({ where: { ...where, estimatedSolveTime: null } }),
    ]);

    const difficultyCounts = new Map(
        difficultyGroups
            .filter((group) => group.difficultySelf !== null)
            .map((group) => [group.difficultySelf as number, group._count._all]),
    );
    const statusCounts = new Map(statusGroups.map((group) => [group.status, group._count._all]));
    const subjectCounts = new Map(subjectGroups.map((group) => [group.subject, group._count._all]));
    const targetLevelCounts = targetLevelGroups
        .filter((group) => group.targetLevel !== null && group.targetLevel.trim().length > 0)
        .map((group) => ({
            label: group.targetLevel as string,
            count: group._count._all,
            percentage: percentage(group._count._all, total),
        }))
        .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));

    const difficultyDistribution = difficultyValues.map((difficulty) => {
        const count = difficultyCounts.get(difficulty) ?? 0;
        return {
            difficulty,
            count,
            percentage: percentage(count, total),
        };
    });

    const configuredDifficultyTotal = difficultyDistribution.reduce((sum, item) => sum + item.count, 0);
    const weightedDifficultyTotal = difficultyDistribution.reduce(
        (sum, item) => sum + item.difficulty * item.count,
        0,
    );

    return {
        total,
        difficultyDistribution,
        averageDifficulty:
            configuredDifficultyTotal === 0
                ? null
                : Math.round((weightedDifficultyTotal / configuredDifficultyTotal) * 10) / 10,
        unsetDifficulty,
        unsetTargetLevel,
        unsetSolveTime,
        statusDistribution: statusOrder.map((status) => {
            const count = statusCounts.get(status) ?? 0;
            return {
                status,
                count,
                percentage: percentage(count, total),
            };
        }),
        subjectDistribution: subjectOrder.map((subject) => {
            const count = subjectCounts.get(subject) ?? 0;
            return {
                subject,
                count,
                percentage: percentage(count, total),
            };
        }),
        targetLevelDistribution: targetLevelCounts,
    };
}
