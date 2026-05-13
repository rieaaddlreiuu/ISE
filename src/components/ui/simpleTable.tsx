import type { ReactNode } from 'react';

import { cx } from '@/utils/cx';

type SimpleTableProperties = {
    headers: ReactNode[];
    rows: ReactNode[][];
    className?: string;
};

export function SimpleTable({ headers, rows, className }: SimpleTableProperties) {
    return (
        <div className={cx('overflow-x-auto p-4', className)}>
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                        {headers.map((header, index) => (
                            <th key={index} className="px-3 py-2 font-medium">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-slate-100 last:border-b-0">
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={cx(
                                        'px-3 py-2 text-slate-700',
                                        cellIndex === 0 && 'text-slate-900',
                                    )}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
