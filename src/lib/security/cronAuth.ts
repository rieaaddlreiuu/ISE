import { NextRequest, NextResponse } from 'next/server';

export function requireCronAuthorization(request: NextRequest): NextResponse | null {
    const secret = process.env.CRON_SECRET?.trim();
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json(
                { message: 'Server misconfigured: CRON_SECRET is required in production' },
                { status: 503 },
            );
        }
        return null;
    }

    const bearer = request.headers.get('authorization');
    const xCronSecret = request.headers.get('x-cron-secret');
    if (bearer === `Bearer ${secret}` || xCronSecret === secret) {
        return null;
    }

    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
