'use client';

import { useDeferredValue, useState } from 'react';
import { MarkdownTexContent } from '@/components/ui/markdownTex';

type MarkdownTexTextareaProps = {
    name: string;
    label: string;
    defaultValue?: string;
    rows?: number;
    helperText?: string;
    className?: string;
    textareaClassName: string;
    previewMinHeightClassName?: string;
};

export function MarkdownTexTextarea({
    name,
    label,
    defaultValue = '',
    rows = 6,
    helperText,
    className,
    textareaClassName,
    previewMinHeightClassName = 'min-h-[132px]',
}: MarkdownTexTextareaProps) {
    const [value, setValue] = useState(defaultValue);
    const deferredValue = useDeferredValue(value);

    return (
        <label className={className ?? 'block'}>
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <textarea
                name={name}
                rows={rows}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className={textareaClassName}
            />
            <p className="mt-2 text-xs leading-5 text-slate-500">
                Markdown と TeX に対応しています。インライン数式は <code>$...$</code>、別行数式は{' '}
                <code>$$...$$</code> を使えます。
            </p>
            {helperText ? <p className="mt-1 text-xs leading-5 text-slate-500">{helperText}</p> : null}
            <div className="mt-4 border border-slate-200 bg-slate-50">
                <div className="border-b border-slate-200 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                    Preview
                </div>
                <div className={`markdown-preview px-4 py-4 text-sm text-slate-800 ${previewMinHeightClassName}`}>
                    {deferredValue.trim().length > 0 ? (
                        <MarkdownTexContent content={deferredValue} />
                    ) : (
                        <p className="text-slate-400">入力内容のプレビューがここに表示されます。</p>
                    )}
                </div>
            </div>
        </label>
    );
}
