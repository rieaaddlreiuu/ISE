import { NextRequest, NextResponse } from 'next/server';

function timingSafeStringEqual(a: string, b: string) {
    const encoder = new TextEncoder();
    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    if (aBytes.length !== bBytes.length) return false;

    let mismatch = 0;
    for (const [index] of aBytes.entries()) {
        mismatch |= aBytes[index] ^ bBytes[index];
    }

    return mismatch === 0;
}

export function requireApiTokenAuthorization(request: NextRequest): NextResponse | null {
    const token = process.env.API_TOKEN?.trim();

    if (!token) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json(
                { message: 'Server misconfigured: API_TOKEN is required in production' },
                { status: 503 },
            );
        }
        return null;
    }

    const bearerPrefix = 'Bearer ';
    const authorization = request.headers.get('authorization') ?? '';
    const bearerToken = authorization.startsWith(bearerPrefix)
        ? authorization.slice(bearerPrefix.length).trim()
        : '';
    const headerToken = request.headers.get('x-api-token')?.trim() ?? '';

    if (
        (bearerToken && timingSafeStringEqual(bearerToken, token)) ||
        (headerToken && timingSafeStringEqual(headerToken, token))
    ) {
        return null;
    }

    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
