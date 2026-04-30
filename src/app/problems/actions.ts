'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { difficultyNumberFromPreset } from '@/lib/backend/problemViews';

function readRequiredString(formData: FormData, key: string) {
    const value = formData.get(key);

    if (typeof value !== 'string') {
        throw new Error(`${key} is required`);
    }

    const trimmed = value.trim();
    if (!trimmed) {
        throw new Error(`${key} is required`);
    }

    return trimmed;
}

function readOptionalString(formData: FormData, key: string) {
    const value = formData.get(key);
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

function createSerialCode(subject: string) {
    const prefix = subject.slice(0, 3).toUpperCase();
    const stamp = Date.now().toString().slice(-6);
    return `${prefix}-${stamp}`;
}

export async function createProblemAction(formData: FormData) {
    const title = readRequiredString(formData, 'title');
    const subject = readRequiredString(formData, 'subject');
    const status = readRequiredString(formData, 'stage');
    const statementMd = readRequiredString(formData, 'statement');

    const problem = await prisma.problem.create({
        data: {
            serialCode: createSerialCode(subject),
            title,
            subject,
            status,
            statementMd,
            tagsText: readOptionalString(formData, 'tags'),
            answerMd: readOptionalString(formData, 'answer'),
            explanationMd: readOptionalString(formData, 'answerPolicy'),
            authorMemoMd: readOptionalString(formData, 'gradingMemo'),
            sourceDetail: readOptionalString(formData, 'source'),
            difficultySelf: difficultyNumberFromPreset(readRequiredString(formData, 'difficulty')),
            targetLevel: readOptionalString(formData, 'format'),
        },
        select: {
            id: true,
        },
    });

    revalidatePath('/problems');
    redirect(`/problems/${problem.id}/edit/metadata`);
}

export async function saveProblemMetadataAction(problemId: string, formData: FormData) {
    await prisma.problem.update({
        where: { id: problemId },
        data: {
            serialCode: readRequiredString(formData, 'id'),
            title: readRequiredString(formData, 'title'),
            subject: readRequiredString(formData, 'subject'),
            status: readRequiredString(formData, 'status'),
            tagsText: readOptionalString(formData, 'tags'),
            difficultySelf: difficultyNumberFromPreset(readRequiredString(formData, 'difficulty')),
            targetLevel: readOptionalString(formData, 'format'),
        },
    });

    revalidatePath('/problems');
    revalidatePath(`/problems/${problemId}`);
    redirect(`/problems/${problemId}/edit/metadata`);
}

export async function saveProblemTextAction(problemId: string, formData: FormData) {
    await prisma.problem.update({
        where: { id: problemId },
        data: {
            statementMd: readRequiredString(formData, 'statement'),
            answerMd: readOptionalString(formData, 'answer'),
            explanationMd: readOptionalString(formData, 'commentary'),
            authorMemoMd: readOptionalString(formData, 'gradingMemo'),
        },
    });

    revalidatePath(`/problems/${problemId}`);
    redirect(`/problems/${problemId}/edit/text`);
}

export async function saveProblemPublishAction(problemId: string, formData: FormData) {
    const destinations = formData
        .getAll('destinations')
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);

    await prisma.problem.update({
        where: { id: problemId },
        data: {
            sourceDetail: readOptionalString(formData, 'source'),
            sourceType: destinations.length > 0 ? destinations.join(',') : null,
        },
    });

    revalidatePath(`/problems/${problemId}`);
    redirect(`/problems/${problemId}/edit/publish`);
}

export async function deleteProblemAction(formData: FormData) {
    const problemId = readRequiredString(formData, 'problemId');

    await prisma.problem.update({
        where: { id: problemId },
        data: {
            archivedAt: new Date(),
        },
    });

    revalidatePath('/problems');
    redirect('/problems');
}
