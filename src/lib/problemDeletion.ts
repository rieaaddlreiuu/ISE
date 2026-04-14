import "server-only";

import { cookies } from "next/headers";

const DELETED_PROBLEMS_COOKIE = "ise-deleted-problem-ids";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function parseDeletedProblemIds(value: string | undefined) {
    if (!value) {
        return new Set<string>();
    }

    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            return new Set<string>();
        }

        return new Set(parsed.filter((item): item is string => typeof item === "string" && item.length > 0));
    } catch {
        return new Set<string>();
    }
}

export async function getDeletedProblemIds() {
    const cookieStore = await cookies();
    return parseDeletedProblemIds(cookieStore.get(DELETED_PROBLEMS_COOKIE)?.value);
}

export async function isProblemDeleted(problemId: string) {
    const deletedProblemIds = await getDeletedProblemIds();
    return deletedProblemIds.has(problemId);
}

export async function filterDeletedProblems<T extends { id: string }>(items: T[]) {
    const deletedProblemIds = await getDeletedProblemIds();
    return items.filter((item) => !deletedProblemIds.has(item.id));
}

export async function deleteProblemById(problemId: string) {
    const cookieStore = await cookies();
    const deletedProblemIds = parseDeletedProblemIds(cookieStore.get(DELETED_PROBLEMS_COOKIE)?.value);
    deletedProblemIds.add(problemId);

    cookieStore.set(DELETED_PROBLEMS_COOKIE, JSON.stringify([...deletedProblemIds]), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE_SECONDS,
    });
}
