import type { Priority, TaskStatus } from "@/types/tasks";

const BADGE_BASE_CLASS =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset";

export function priorityBadge(priority: Priority) {
    if (priority === "high") {
        return (
            <span
                className={`${BADGE_BASE_CLASS} bg-red-50 text-red-700 ring-red-200`}
            >
                高
            </span>
        );
    }
    if (priority === "medium") {
        return (
            <span
                className={`${BADGE_BASE_CLASS} bg-amber-50 text-amber-700 ring-amber-200`}
            >
                中
            </span>
        );
    }
    return (
        <span
            className={`${BADGE_BASE_CLASS} bg-slate-50 text-slate-700 ring-slate-200`}
        >
            低
        </span>
    );
}

export function statusBadge(status: TaskStatus) {
    if (status === "done") {
        return (
            <span
                className={`${BADGE_BASE_CLASS} bg-emerald-50 text-emerald-700 ring-emerald-200`}
            >
                完了
            </span>
        );
    }
    return (
        <span
            className={`${BADGE_BASE_CLASS} bg-red-50 text-red-700 ring-red-200`}
        >
            未完了
        </span>
    );
}
