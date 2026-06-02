import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiTokenAuthorization } from '@/lib/security/apiTokenAuth';

type TextPatchBody = {
    statementMd?: unknown;
    answerMd?: unknown;
    explanationMd?: unknown;
    authorMemoMd?: unknown;
};

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function validationError(message: string, field?: string) {
    return NextResponse.json(
        {
            message: 'Validation error',
            field,
            detail: message,
        },
        { status: 422 },
    );
}

function normalizeOptionalMarkdown(value: string) {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : value;
}

function parseTextPatchBody(body: TextPatchBody) {
    const fields = ['statementMd', 'answerMd', 'explanationMd', 'authorMemoMd'] as const;

    for (const field of fields) {
        if (!(field in body)) {
            return {
                ok: false as const,
                response: validationError(`${field} is required`, field),
            };
        }
    }

    if (typeof body.statementMd !== 'string') {
        return {
            ok: false as const,
            response: validationError('statementMd must be a string', 'statementMd'),
        };
    }

    if (typeof body.answerMd !== 'string') {
        return {
            ok: false as const,
            response: validationError('answerMd must be a string', 'answerMd'),
        };
    }

    if (typeof body.explanationMd !== 'string') {
        return {
            ok: false as const,
            response: validationError('explanationMd must be a string', 'explanationMd'),
        };
    }

    if (typeof body.authorMemoMd !== 'string') {
        return {
            ok: false as const,
            response: validationError('authorMemoMd must be a string', 'authorMemoMd'),
        };
    }

    if (body.statementMd.trim().length === 0) {
        return {
            ok: false as const,
            response: validationError('statementMd cannot be empty', 'statementMd'),
        };
    }

    return {
        ok: true as const,
        data: {
            statementMd: body.statementMd,
            answerMd: normalizeOptionalMarkdown(body.answerMd),
            explanationMd: normalizeOptionalMarkdown(body.explanationMd),
            authorMemoMd: normalizeOptionalMarkdown(body.authorMemoMd),
        },
    };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const unauthorized = requireApiTokenAuthorization(request);
    if (unauthorized) return unauthorized;

    const { id } = await context.params;

    if (!id || id.trim().length === 0) {
        return NextResponse.json({ message: 'Problem id is required' }, { status: 400 });
    }

    let body: TextPatchBody;

    try {
        body = (await request.json()) as TextPatchBody;
    } catch {
        return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = parseTextPatchBody(body);
    if (!parsed.ok) {
        return parsed.response;
    }

    try {
        const existingProblem = await prisma.problem.findFirst({
            where: {
                id,
                archivedAt: null,
            },
            select: {
                id: true,
            },
        });

        if (!existingProblem) {
            return NextResponse.json({ message: 'Problem not found' }, { status: 404 });
        }

        const updatedProblem = await prisma.problem.update({
            where: { id },
            data: parsed.data,
            select: {
                id: true,
                statementMd: true,
                answerMd: true,
                explanationMd: true,
                authorMemoMd: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({ problem: updatedProblem });
    } catch (error) {
        console.error('Failed to update problem text', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
