import type { Priority, TaskStatus as DatabaseTaskStatus } from '@prisma/client';
import type { DashboardTask, TaskListTask, TaskStatus } from '@/types/tasks';

type DatabaseTask = {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    doneCondition: string;
    status: DatabaseTaskStatus;
    priority: Priority;
    dueAt: Date;
    points: number;
    weight: number | null;
    tags: string;
    evidenceSubmittedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    subtasks?: { subTaskId: string }[];
};

function parseTags(raw: string): string[] {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
    } catch {
        return [];
    }
}

export function toUiStatus(status: DatabaseTaskStatus): TaskStatus {
    if (status === 'done') return 'done';
    if (status === 'missed') return 'paused';
    return 'active';
}

export function toDashboardTask(task: DatabaseTask): DashboardTask {
    return {
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        status: toUiStatus(task.status),
        priority: task.priority,
        dueAt: task.dueAt.toISOString(),
        points: task.points,
        evidenceSubmittedToday: !!task.evidenceSubmittedAt,
        tags: parseTags(task.tags),
    };
}

export function toTaskListTask(task: DatabaseTask): TaskListTask {
    return {
        taskId: task.id,
        userId: task.userId,
        title: task.title,
        status: toUiStatus(task.status),
        dueAt: task.dueAt.toISOString().slice(0, 10),
        doneCondition: task.doneCondition,
        description: task.description ?? undefined,
        tags: parseTags(task.tags),
        weight: task.weight ?? undefined,
        isDone: task.status === 'done',
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        subtaskIds: task.subtasks?.map((s) => s.subTaskId),
    };
}
