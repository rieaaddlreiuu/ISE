const DAY_MS = 1000 * 60 * 60 * 24;

function pad2(n: number) {
    return String(n).padStart(2, '0');
}

export function toDateOrNull(iso?: string): Date | null {
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
}

export function toTimestampOrInfinity(iso?: string) {
    const d = toDateOrNull(iso);
    return d ? d.getTime() : Number.POSITIVE_INFINITY;
}

export function formatDateJP(iso?: string) {
    const d = toDateOrNull(iso);
    if (!d) return '?';
    return `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())} ${pad2(
        d.getHours(),
    )}:${pad2(d.getMinutes())}`;
}

export function daysDiffFromNow(iso?: string) {
    const d = toDateOrNull(iso);
    if (!d) return null;
    return Math.ceil((d.getTime() - Date.now()) / DAY_MS);
}
