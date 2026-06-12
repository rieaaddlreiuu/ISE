"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizeTagName, slugFromTagName } from "@/lib/backend/tags";
import { prisma } from "@/lib/prisma";

function readTagName(formData: FormData) {
    const value = formData.get("name");
    if (typeof value !== "string") {
        throw new Error("tag name is required");
    }

    const name = normalizeTagName(value);
    if (!name) {
        throw new Error("tag name is required");
    }

    if (name.length > 80) {
        throw new Error("tag names must be 80 characters or fewer");
    }

    return name;
}

function parseCsvRows(text: string) {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];
        const nextChar = text[index + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                field += '"';
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === "," && !inQuotes) {
            row.push(field);
            field = "";
            continue;
        }

        if ((char === "\n" || char === "\r") && !inQuotes) {
            if (char === "\r" && nextChar === "\n") {
                index += 1;
            }

            row.push(field);
            rows.push(row);
            row = [];
            field = "";
            continue;
        }

        field += char;
    }

    row.push(field);
    rows.push(row);

    return rows;
}

function isHeaderName(value: string) {
    return ["name", "tag", "タグ", "タグ名"].includes(value.trim().toLocaleLowerCase("ja-JP"));
}

function normalizeImportedTagNames(rows: string[][]) {
    const namesBySlug = new Map<string, string>();

    rows.forEach((row, index) => {
        const rawName = row[0] ?? "";
        if (index === 0 && isHeaderName(rawName)) {
            return;
        }

        const name = normalizeTagName(rawName.replace(/^\uFEFF/, ""));
        if (!name) {
            return;
        }

        if (name.length > 80) {
            throw new Error("tag names must be 80 characters or fewer");
        }

        namesBySlug.set(slugFromTagName(name), name);
    });

    return Array.from(namesBySlug.values());
}

async function upsertTagByName(name: string) {
    const slug = slugFromTagName(name);

    await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: {
            name,
            slug,
        },
    });
}

export async function createTagAction(formData: FormData) {
    await upsertTagByName(readTagName(formData));

    revalidatePath("/tags/new");
    revalidatePath("/problems/new");
    redirect("/tags/new");
}

export async function importTagsCsvAction(formData: FormData) {
    const file = formData.get("csv");
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("csv file is required");
    }

    if (file.size > 1024 * 1024) {
        throw new Error("csv file must be 1 MB or smaller");
    }

    const names = normalizeImportedTagNames(parseCsvRows(await file.text()));
    if (names.length === 0) {
        throw new Error("csv file has no tag names");
    }

    for (const name of names) {
        await upsertTagByName(name);
    }

    revalidatePath("/tags/new");
    revalidatePath("/problems/new");
    redirect("/tags/new");
}
