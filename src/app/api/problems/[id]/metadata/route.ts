import { Prisma } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { authSessionCookieName, parseSessionToken } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

const allowedStatuses = new Set(['draft', 'review', 'ready', 'published']);
const allowedSubjects = new Set(['math', 'physics', 'chemistry', 'japanese', 'english', 'other']);

type MetadataPatchBody = {
    serialCode?: unknown;
    title?: unknown;
    subject?: unknown;
    domain?: unknown;
    tagsText?: unknown;
    status?: unknown;
    difficultySelf?: unknown;
    targetLevel?: unknown;
    estimatedSolveTime?: unknown;
};

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

type ParsedMetadataPatch = {
    serialCode?: string;
    title?: string;
    subject?: string;
    domain?: string | null;
    tagsText?: string | null;
    status?: string;
    difficultySelf?: number | null;
    targetLevel?: string | null;
    estimatedSolveTime?: number | null;
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

function conflictError(message: string, field?: string) {
    return NextResponse.json(
        {
            message: 'Conflict',
            field,
            detail: message,
        },
        { status: 409 },
    );
}

function normalizeRequiredString(value: string, field: string) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        return {
            ok: false as const,
            response: validationError(`${field} cannot be empty`, field),
        };
    }

    return {
        ok: true as const,
        value: trimmed,
    };
}

function normalizeOptionalString(value: string) {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
}

function normalizeOptionalInteger(value: unknown, field: string) {
    if (value === null) {
        return {
            ok: true as const,
            value: null,
        };
    }

    if (typeof value === 'number') {
        if (!Number.isInteger(value) || value < 0) {
            return {
                ok: false as const,
                response: validationError(`${field} must be a non-negative integer or null`, field),
            };
        }

        return {
            ok: true as const,
            value,
        };
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            return {
                ok: true as const,
                value: null,
            };
        }

        const parsed = Number(trimmed);
        if (!Number.isInteger(parsed) || parsed < 0) {
            return {
                ok: false as const,
                response: validationError(`${field} must be a non-negative integer or null`, field),
            };
        }

        return {
            ok: true as const,
            value: parsed,
        };
    }

    return {
        ok: false as const,
        response: validationError(`${field} must be a non-negative integer or null`, field),
    };
}

function normalizeOptionalDifficulty(value: unknown) {
    const normalized = normalizeOptionalInteger(value, 'difficultySelf');

    if (!normalized.ok) {
        return normalized;
    }

    if (normalized.value !== null && (normalized.value < 1 || normalized.value > 10)) {
        return {
            ok: false as const,
            response: validationError('difficultySelf must be an integer from 1 to 10 or null', 'difficultySelf'),
        };
    }

    return normalized;
}

function parseMetadataPatchBody(body: MetadataPatchBody) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return {
            ok: false as const,
            response: validationError('Request body must be a JSON object'),
        };
    }

    const entries = Object.entries(body).filter(([, value]) => value !== undefined);
    if (entries.length === 0) {
        return {
            ok: false as const,
            response: validationError('At least one metadata field is required'),
        };
    }

    const parsed: ParsedMetadataPatch = {};

    if ('serialCode' in body) {
        if (typeof body.serialCode !== 'string') {
            return {
                ok: false as const,
                response: validationError('serialCode must be a string', 'serialCode'),
            };
        }

        const normalized = normalizeRequiredString(body.serialCode, 'serialCode');
        if (!normalized.ok) {
            return {
                ok: false as const,
                response: normalized.response,
            };
        }

        parsed.serialCode = normalized.value;
    }

    if ('title' in body) {
        if (typeof body.title !== 'string') {
            return {
                ok: false as const,
                response: validationError('title must be a string', 'title'),
            };
        }

        const normalized = normalizeRequiredString(body.title, 'title');
        if (!normalized.ok) {
            return {
                ok: false as const,
                response: normalized.response,
            };
        }

        parsed.title = normalized.value;
    }

    if ('subject' in body) {
        if (typeof body.subject !== 'string') {
            return {
                ok: false as const,
                response: validationError('subject must be a string', 'subject'),
            };
        }

        const normalized = normalizeRequiredString(body.subject, 'subject');
        if (!normalized.ok) {
            return {
                ok: false as const,
                response: normalized.response,
            };
        }

        if (!allowedSubjects.has(normalized.value)) {
            return {
                ok: false as const,
                response: validationError(
                    'subject must be one of math, physics, chemistry, japanese, english, other',
                    'subject',
                ),
            };
        }

        parsed.subject = normalized.value;
    }

    if ('domain' in body) {
        if (typeof body.domain !== 'string' && body.domain !== null) {
            return {
                ok: false as const,
                response: validationError('domain must be a string or null', 'domain'),
            };
        }

        parsed.domain = body.domain === null ? null : normalizeOptionalString(body.domain);
    }

    if ('tagsText' in body) {
        if (typeof body.tagsText !== 'string' && body.tagsText !== null) {
            return {
                ok: false as const,
                response: validationError('tagsText must be a string or null', 'tagsText'),
            };
        }

        parsed.tagsText = body.tagsText === null ? null : normalizeOptionalString(body.tagsText);
    }

    if ('status' in body) {
        if (typeof body.status !== 'string') {
            return {
                ok: false as const,
                response: validationError('status must be a string', 'status'),
            };
        }

        const normalized = normalizeRequiredString(body.status, 'status');
        if (!normalized.ok) {
            return {
                ok: false as const,
                response: normalized.response,
            };
        }

        if (!allowedStatuses.has(normalized.value)) {
            return {
                ok: false as const,
                response: validationError('status must be one of draft, review, ready, published', 'status'),
            };
        }

        parsed.status = normalized.value;
    }

    if ('difficultySelf' in body) {
        const normalized = normalizeOptionalDifficulty(body.difficultySelf);
        if (!normalized.ok) {
            return {
                ok: false as const,
                response: normalized.response,
            };
        }

        parsed.difficultySelf = normalized.value;
    }

    if ('targetLevel' in body) {
        if (typeof body.targetLevel !== 'string' && body.targetLevel !== null) {
            return {
                ok: false as const,
                response: validationError('targetLevel must be a string or null', 'targetLevel'),
            };
        }

        parsed.targetLevel = body.targetLevel === null ? null : normalizeOptionalString(body.targetLevel);
    }

    if ('estimatedSolveTime' in body) {
        const normalized = normalizeOptionalInteger(body.estimatedSolveTime, 'estimatedSolveTime');
        if (!normalized.ok) {
            return {
                ok: false as const,
                response: normalized.response,
            };
        }

        parsed.estimatedSolveTime = normalized.value;
    }

    return {
        ok: true as const,
        data: parsed,
    };
}

async function requireAuthenticatedSession() {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(authSessionCookieName)?.value;
    return parseSessionToken(rawToken);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const session = await requireAuthenticatedSession();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id || id.trim().length === 0) {
        return NextResponse.json({ message: 'Problem id is required' }, { status: 400 });
    }
    const problemId = id.trim();

    let body: MetadataPatchBody;

    try {
        body = (await request.json()) as MetadataPatchBody;
    } catch {
        return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = parseMetadataPatchBody(body);
    if (!parsed.ok) {
        return parsed.response;
    }

    try {
        const existingProblem = await prisma.problem.findFirst({
            where: {
                id: problemId,
                archivedAt: null,
            },
            select: {
                id: true,
            },
        });

        if (!existingProblem) {
            return NextResponse.json({ message: 'Problem not found' }, { status: 404 });
        }

        if (parsed.data.serialCode) {
            const duplicate = await prisma.problem.findFirst({
                where: {
                    serialCode: parsed.data.serialCode,
                    NOT: {
                        id: problemId,
                    },
                },
                select: {
                    id: true,
                },
            });

            if (duplicate) {
                return conflictError('serialCode already exists', 'serialCode');
            }
        }

        const updatedProblem = await prisma.problem.update({
            where: { id: problemId },
            data: parsed.data,
            select: {
                id: true,
                serialCode: true,
                title: true,
                subject: true,
                domain: true,
                tagsText: true,
                status: true,
                difficultySelf: true,
                targetLevel: true,
                estimatedSolveTime: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({ problem: updatedProblem });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return conflictError('serialCode already exists', 'serialCode');
        }

        console.error('Failed to update problem metadata', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
