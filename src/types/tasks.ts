export type Priority = "low" | "medium" | "high";

export type TaskStatus = "active" | "paused" | "done";

export type DashboardTask = {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    dueAt: string;
    points: number;
    evidenceSubmittedToday: boolean;
    tags: string[];
};

export type TaskListTask = {
    taskId: string;
    userId: string;
    title: string;
    status: TaskStatus;
    dueAt: string;
    doneCondition: string;
    description?: string;
    tags: string[];
    weight?: number;
    isDone: boolean;
    createdAt: string;
    updatedAt: string;
    subtaskIds?: string[];
};
