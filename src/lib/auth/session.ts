const DEFAULT_SESSION_SECRET = 'do-death-dev-session-secret';

export const authSessionCookieName = 'dd_session';
const sessionTtlSeconds = 60 * 60 * 24 * 30;

export type AuthSession = {
    userId: string;
    iat: number;
    exp: number;
};

function getSessionSecret() {
    const configured = process.env.AUTH_SESSION_SECRET?.trim();
    if (configured) return configured;

    if (process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SESSION_SECRET is not configured');
    }

    return DEFAULT_SESSION_SECRET;
}

function toBase64Url(bytes: Uint8Array) {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(bytes).toString('base64url');
    }

    let binary = '';
    for (const byte of bytes) {
        binary += String.fromCodePoint(byte);
    }

    let encoded = btoa(binary).replaceAll('+', '-').replaceAll('/', '_');
    while (encoded.endsWith('=')) {
        encoded = encoded.slice(0, -1);
    }
    return encoded;
}

function fromBase64Url(value: string) {
    if (typeof Buffer !== 'undefined') {
        return new Uint8Array(Buffer.from(value, 'base64url'));
    }

    const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
    const padded =
        normalized + (normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4)));
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (const [index, char] of [...binary].entries()) {
        bytes[index] = char.codePointAt(0) ?? 0;
    }
    return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
    if (a.length !== b.length) return false;

    let mismatch = 0;
    for (const [index] of a.entries()) {
        mismatch |= a[index] ^ b[index];
    }

    return mismatch === 0;
}

async function hmacSha256(message: string, secret: string) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return new Uint8Array(signature);
}

function normalizeSessionPayload(payload: unknown): AuthSession | null {
    if (!payload || typeof payload !== 'object') return null;

    const maybe = payload as Partial<AuthSession>;
    if (typeof maybe.userId !== 'string' || maybe.userId.length === 0) return null;
    if (typeof maybe.iat !== 'number' || !Number.isFinite(maybe.iat)) return null;
    if (typeof maybe.exp !== 'number' || !Number.isFinite(maybe.exp)) return null;

    return {
        userId: maybe.userId,
        iat: maybe.iat,
        exp: maybe.exp,
    };
}

export function sessionCookieMaxAge() {
    return sessionTtlSeconds;
}

export async function createSessionToken(userId: string) {
    const now = Math.floor(Date.now() / 1000);
    const payload: AuthSession = {
        userId,
        iat: now,
        exp: now + sessionTtlSeconds,
    };

    const payloadJson = JSON.stringify(payload);
    const payloadBase64 = toBase64Url(new TextEncoder().encode(payloadJson));
    const signature = await hmacSha256(payloadBase64, getSessionSecret());
    const signatureBase64 = toBase64Url(signature);
    return `${payloadBase64}.${signatureBase64}`;
}

export async function parseSessionToken(raw: string | undefined) {
    if (!raw) return null;

    const [payloadBase64, signatureBase64] = raw.split('.');
    if (!payloadBase64 || !signatureBase64) return null;

    try {
        const expectedSignature = await hmacSha256(payloadBase64, getSessionSecret());
        const providedSignature = fromBase64Url(signatureBase64);
        if (!timingSafeEqual(expectedSignature, providedSignature)) return null;

        const payloadBytes = fromBase64Url(payloadBase64);
        const payloadText = new TextDecoder().decode(payloadBytes);
        const parsed = normalizeSessionPayload(JSON.parse(payloadText));
        if (!parsed) return null;

        const now = Math.floor(Date.now() / 1000);
        if (parsed.exp <= now) return null;
        return parsed;
    } catch {
        return null;
    }
}
