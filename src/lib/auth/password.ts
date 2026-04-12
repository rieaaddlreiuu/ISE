import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const scryptN = 16_384;
const scryptR = 8;
const scryptP = 1;
const keyLength = 64;
const minPasswordLength = 8;
const maxPasswordLength = 128;

function toBase64(value: Buffer) {
    return value.toString('base64');
}

function fromBase64(value: string) {
    return Buffer.from(value, 'base64');
}

function deriveScryptKey(password: string, salt: Buffer) {
    return scryptSync(password, salt, keyLength, { N: scryptN, r: scryptR, p: scryptP });
}

export function validatePassword(password: string) {
    return password.length >= minPasswordLength && password.length <= maxPasswordLength;
}

export function passwordPolicyMessage() {
    return `password must be ${minPasswordLength}-${maxPasswordLength} characters`;
}

export function createPasswordHash(password: string) {
    const salt = randomBytes(16);
    const key = deriveScryptKey(password, salt);
    return `scrypt$${scryptN}$${scryptR}$${scryptP}$${toBase64(salt)}$${toBase64(key)}`;
}

export function verifyPassword(password: string, storedHash: string) {
    const [algorithm, nRaw, rRaw, pRaw, saltRaw, expectedRaw] = storedHash.split('$');
    if (algorithm !== 'scrypt') return false;
    if (!nRaw || !rRaw || !pRaw || !saltRaw || !expectedRaw) return false;

    const n = Number(nRaw);
    const r = Number(rRaw);
    const p = Number(pRaw);
    if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

    try {
        const salt = fromBase64(saltRaw);
        const expected = fromBase64(expectedRaw);
        const actual = scryptSync(password, salt, expected.length, { N: n, r, p });
        if (actual.length !== expected.length) return false;
        return timingSafeEqual(actual, expected);
    } catch {
        return false;
    }
}
