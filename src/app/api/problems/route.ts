import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ProblemListQueryError, listProblems } from '@/lib/backend/problems';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    try {
        const payload = await listProblems({
            q: searchParams.get('q') ?? undefined,
            status: searchParams.get('status') ?? undefined,
            subject: searchParams.get('subject') ?? undefined,
            tag: searchParams.get('tag') ?? undefined,
            page: searchParams.get('page') ?? undefined,
            pageSize: searchParams.get('pageSize') ?? undefined,
            sort: searchParams.get('sort') ?? undefined,
            order: searchParams.get('order') ?? undefined,
        });

        return NextResponse.json(payload);
    } catch (error) {
        if (error instanceof ProblemListQueryError) {
            return NextResponse.json(
                {
                    error: {
                        code: 'INVALID_QUERY',
                        message: error.message,
                    },
                },
                { status: 400 },
            );
        }

        console.error('Failed to fetch problems', error);

        return NextResponse.json(
            {
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch problems',
                },
            },
            { status: 500 },
        );
    }
}
