import { prisma } from "@/lib/prisma";

export type TagOption = {
    id: string;
    name: string;
    slug: string;
    problemCount: number;
};

export function normalizeTagName(value: string) {
    return value.trim().replace(/\s+/g, " ");
}

export function slugFromTagName(value: string) {
    return normalizeTagName(value).toLocaleLowerCase("ja-JP");
}

export async function listTagOptions(): Promise<TagOption[]> {
    const tags = await prisma.tag.findMany({
        orderBy: [{ name: "asc" }, { id: "asc" }],
        select: {
            id: true,
            name: true,
            slug: true,
            _count: {
                select: {
                    problemTags: true,
                },
            },
        },
    });

    return tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        problemCount: tag._count.problemTags,
    }));
}

export function readTagIdsFromFormData(formData: FormData) {
    return Array.from(
        new Set(
            formData
                .getAll("tagIds")
                .filter((value): value is string => typeof value === "string")
                .map((value) => value.trim())
                .filter((value) => value.length > 0),
        ),
    );
}

export function readNewTagNamesFromFormData(formData: FormData) {
    const namesBySlug = new Map<string, string>();

    for (const value of formData.getAll("newTagNames")) {
        if (typeof value !== "string") {
            continue;
        }

        const name = normalizeTagName(value);
        if (!name) {
            continue;
        }

        if (name.length > 80) {
            throw new Error("tag names must be 80 characters or fewer");
        }

        namesBySlug.set(slugFromTagName(name), name);
    }

    return Array.from(namesBySlug.values());
}

export async function assertExistingTagIds(tagIds: string[]) {
    if (tagIds.length === 0) {
        return;
    }

    const count = await prisma.tag.count({
        where: {
            id: {
                in: tagIds,
            },
        },
    });

    if (count !== tagIds.length) {
        throw new Error("selected tags include an unknown tag");
    }
}

export async function resolveTagIdsFromFormData(formData: FormData) {
    const existingTagIds = readTagIdsFromFormData(formData);
    await assertExistingTagIds(existingTagIds);

    const newTagIds = [];
    for (const name of readNewTagNamesFromFormData(formData)) {
        const slug = slugFromTagName(name);
        const tag = await prisma.tag.upsert({
            where: { slug },
            update: {},
            create: {
                name,
                slug,
            },
            select: {
                id: true,
            },
        });

        newTagIds.push(tag.id);
    }

    return Array.from(new Set([...existingTagIds, ...newTagIds]));
}
