const JST_OFFSET = '+09:00';
const JST_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

function pad2(value: number): string {
    return String(value).padStart(2, '0');
}

export function jstInputToIsoUtc(input: string): string | null {
    const normalized = input.trim();
    if (!JST_INPUT_PATTERN.test(normalized)) return null;

    const date = new Date(`${normalized}:00${JST_OFFSET}`);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
}

export function isoUtcToJstInput(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';

    const jstMs = date.getTime() + (9 * 60 * 60 * 1000);
    const jst = new Date(jstMs);
    return `${jst.getUTCFullYear()}-${pad2(jst.getUTCMonth() + 1)}-${pad2(jst.getUTCDate())}T${pad2(jst.getUTCHours())}:${pad2(jst.getUTCMinutes())}`;
}

