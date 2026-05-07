'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { startTransition } from 'react';

const sortOptions = [
    { value: 'updatedAt', label: '更新日時' },
    { value: 'createdAt', label: '作成日時' },
    { value: 'serialCode', label: '管理番号' },
    { value: 'title', label: 'タイトル' },
    { value: 'difficultySelf', label: '難易度' },
] as const;

const orderOptions = [
    { value: 'desc', label: '降順' },
    { value: 'asc', label: '昇順' },
] as const;

type ProblemSortControlsProps = {
    sort?: string;
    order?: string;
};

export function ProblemSortControls({ sort, order }: ProblemSortControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedSort = sort ?? 'updatedAt';
    const selectedOrder = order ?? 'desc';

    function updateSortParam(name: 'sort' | 'order', value: string) {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);
        params.delete('page');

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block min-w-36">
                <span className="text-xs font-medium text-slate-600">並び替え</span>
                <select
                    value={selectedSort}
                    onChange={(event) => updateSortParam('sort', event.target.value)}
                    className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
            <label className="block min-w-28">
                <span className="text-xs font-medium text-slate-600">順序</span>
                <select
                    value={selectedOrder}
                    onChange={(event) => updateSortParam('order', event.target.value)}
                    className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900"
                >
                    {orderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
