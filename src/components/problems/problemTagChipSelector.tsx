'use client';

import { useMemo, useState } from 'react';
import type { TagOption } from '@/lib/backend/tags';

type ProblemTagChipSelectorProps = {
    options: TagOption[];
    initialSelectedTagIds?: string[];
    inputName?: string;
};

export function ProblemTagChipSelector({
    options,
    initialSelectedTagIds = [],
    inputName = 'tagIds',
}: ProblemTagChipSelectorProps) {
    const optionIds = useMemo(() => new Set(options.map((option) => option.id)), [options]);
    const [selectedTagIds, setSelectedTagIds] = useState(() =>
        initialSelectedTagIds.filter((tagId) => optionIds.has(tagId)),
    );
    const [query, setQuery] = useState('');

    const selectedSet = useMemo(() => new Set(selectedTagIds), [selectedTagIds]);
    const selectedOptions = selectedTagIds
        .map((tagId) => options.find((option) => option.id === tagId))
        .filter((option): option is TagOption => Boolean(option));

    const normalizedQuery = query.trim().toLocaleLowerCase('ja-JP');
    const candidateOptions = options
        .filter((option) => !selectedSet.has(option.id))
        .filter((option) => {
            if (!normalizedQuery) {
                return true;
            }

            return option.name.toLocaleLowerCase('ja-JP').includes(normalizedQuery);
        })
        .slice(0, normalizedQuery ? 40 : 24);

    function selectTag(tagId: string) {
        setSelectedTagIds((current) => (current.includes(tagId) ? current : [...current, tagId]));
    }

    function removeTag(tagId: string) {
        setSelectedTagIds((current) => current.filter((selectedTagId) => selectedTagId !== tagId));
    }

    return (
        <div className="space-y-4">
            {selectedTagIds.map((tagId) => (
                <input key={tagId} type="hidden" name={inputName} value={tagId} />
            ))}

            <label className="block">
                <span className="text-sm font-medium text-slate-700">Search tags</span>
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="mt-3 w-full border-0 border-b border-slate-300 bg-transparent px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-0"
                    placeholder="Type to filter existing tags"
                />
            </label>

            <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Selected</div>
                {selectedOptions.length > 0 ? (
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
                                <span aria-hidden="true" className="text-slate-300">
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
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Candidates</div>
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
                    <p className="text-sm text-slate-500">No matching existing tags.</p>
                )}
            </div>
        </div>
    );
}
