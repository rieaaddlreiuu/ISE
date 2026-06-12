"use client";

import { useMemo, useState } from "react";
import type { TagOption } from "@/lib/backend/tags";

type ProblemTagChipSelectorProps = {
    options: TagOption[];
    initialSelectedTagIds?: string[];
    inputName?: string;
};

function normalizeTagName(value: string) {
    return value.trim().replace(/\s+/g, " ");
}

function slugFromTagName(value: string) {
    return normalizeTagName(value).toLocaleLowerCase("ja-JP");
}

export function ProblemTagChipSelector({
    options,
    initialSelectedTagIds = [],
    inputName = "tagIds",
}: ProblemTagChipSelectorProps) {
    const optionIds = useMemo(
        () => new Set(options.map((option) => option.id)),
        [options],
    );
    const [selectedTagIds, setSelectedTagIds] = useState(() =>
        initialSelectedTagIds.filter((tagId) => optionIds.has(tagId)),
    );
    const [newTagNames, setNewTagNames] = useState<string[]>([]);
    const [query, setQuery] = useState("");

    const selectedSet = useMemo(
        () => new Set(selectedTagIds),
        [selectedTagIds],
    );
    const newTagSlugSet = useMemo(
        () => new Set(newTagNames.map((name) => slugFromTagName(name))),
        [newTagNames],
    );
    const optionSlugSet = useMemo(
        () => new Set(options.map((option) => option.slug)),
        [options],
    );
    const selectedOptions = selectedTagIds
        .map((tagId) => options.find((option) => option.id === tagId))
        .filter((option): option is TagOption => Boolean(option));

    const normalizedQuery = slugFromTagName(query);
    const newTagName = normalizeTagName(query);
    const canAddNewTag =
        newTagName.length > 0 &&
        newTagName.length <= 80 &&
        !optionSlugSet.has(normalizedQuery) &&
        !newTagSlugSet.has(normalizedQuery);
    const candidateOptions = options
        .filter((option) => !selectedSet.has(option.id))
        .filter((option) => {
            if (!normalizedQuery) {
                return true;
            }

            return option.name
                .toLocaleLowerCase("ja-JP")
                .includes(normalizedQuery);
        })
        .slice(0, normalizedQuery ? 40 : 24);

    function selectTag(tagId: string) {
        setSelectedTagIds((current) =>
            current.includes(tagId) ? current : [...current, tagId],
        );
        setQuery("");
    }

    function removeTag(tagId: string) {
        setSelectedTagIds((current) =>
            current.filter((selectedTagId) => selectedTagId !== tagId),
        );
    }

    function addNewTag() {
        if (!canAddNewTag) {
            return;
        }

        setNewTagNames((current) => [...current, newTagName]);
        setQuery("");
    }

    function removeNewTag(name: string) {
        const slug = slugFromTagName(name);
        setNewTagNames((current) =>
            current.filter(
                (currentName) => slugFromTagName(currentName) !== slug,
            ),
        );
    }

    return (
        <div className="space-y-4">
            {selectedTagIds.map((tagId) => (
                <input
                    key={tagId}
                    type="hidden"
                    name={inputName}
                    value={tagId}
                />
            ))}
            {newTagNames.map((name) => (
                <input
                    key={slugFromTagName(name)}
                    type="hidden"
                    name="newTagNames"
                    value={name}
                />
            ))}

            <label className="block">
                <span className="text-sm font-medium text-slate-700">
                    タグを検索・追加
                </span>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key !== "Enter") {
                                return;
                            }

                            if (canAddNewTag) {
                                event.preventDefault();
                                addNewTag();
                            }
                        }}
                        className="w-full border-0 border-b border-slate-300 px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-0"
                        placeholder="既存タグを検索、または新しいタグ名を入力"
                    />
                    <button
                        type="button"
                        onClick={addNewTag}
                        disabled={!canAddNewTag}
                        className="inline-flex min-h-9 shrink-0 items-center justify-center border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                    >
                        追加
                    </button>
                </div>
            </label>

            <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    Selected
                </div>
                {selectedOptions.length > 0 || newTagNames.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selectedOptions.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => removeTag(tag.id)}
                                className="inline-flex min-h-9 items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
                                aria-label={`Remove ${tag.name}`}
                            >
                                <span>{tag.name}</span>
                                <span
                                    aria-hidden="true"
                                    className="text-slate-300"
                                >
                                    x
                                </span>
                            </button>
                        ))}
                        {newTagNames.map((name) => (
                            <button
                                key={slugFromTagName(name)}
                                type="button"
                                onClick={() => removeNewTag(name)}
                                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:border-emerald-300"
                                aria-label={`Remove ${name}`}
                            >
                                <span>{name}</span>
                                <span
                                    aria-hidden="true"
                                    className="text-emerald-600"
                                >
                                    x
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">No tags selected.</p>
                )}
            </div>

            <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    Candidates
                </div>
                {candidateOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {candidateOptions.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => selectTag(tag.id)}
                                className="inline-flex min-h-9 items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">
                        No matching existing tags.
                    </p>
                )}
            </div>
        </div>
    );
}
