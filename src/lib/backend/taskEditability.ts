type Editability = {
    editableWithoutApproval: boolean;
    requiresApproval: boolean;
    cutoffAt: Date;
    reason: 'before_cutoff' | 'after_cutoff';
};

function startOfUtcDay(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function evaluateTaskEditability(dueAt: Date, now = new Date()): Editability {
    // "締め切り前日まで" => 期限日の 00:00 UTC より前は直接編集可
    const cutoffAt = startOfUtcDay(dueAt);
    const editableWithoutApproval = now.getTime() < cutoffAt.getTime();

    return {
        editableWithoutApproval,
        requiresApproval: !editableWithoutApproval,
        cutoffAt,
        reason: editableWithoutApproval ? 'before_cutoff' : 'after_cutoff',
    };
}
