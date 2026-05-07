'use client';

import { useState, type ReactNode } from 'react';

type CopyState = 'idle' | 'copied' | 'failed';

type CopyableTextBlockProps = {
    text: string;
    label: string;
    children: ReactNode;
};

export function CopyableTextBlock({ text, label, children }: CopyableTextBlockProps) {
    const [copyState, setCopyState] = useState<CopyState>('idle');

    async function handleCopy() {
        try {
            await copyToClipboard(text);
            setCopyState('copied');
        } catch {
            setCopyState('failed');
        }

        window.setTimeout(() => setCopyState('idle'), 1600);
    }

    const statusLabel = copyState === 'copied' ? 'コピー済み' : copyState === 'failed' ? 'コピー失敗' : 'コピー';
    const iconClassName =
        copyState === 'copied' ? 'text-emerald-600' : copyState === 'failed' ? 'text-rose-600' : 'text-slate-600';

    return (
        <div className="relative pb-11">
            {children}
            <button
                type="button"
                onClick={handleCopy}
                className="absolute bottom-0 right-0 inline-flex size-8 items-center justify-center bg-transparent transition focus:outline-none focus:ring-2 focus:ring-slate-300"
                aria-label={`${label}をコピー`}
                title={statusLabel}
            >
                {copyState === 'copied' ? (
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`size-4 transition-colors ${iconClassName}`}
                    >
                        <path
                            d="M4.5 10.5L8.25 14.25L15.5 6.75"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <span aria-hidden="true" className={`relative block size-4 transition-colors ${iconClassName}`}>
                        <span className="absolute left-0.5 top-0.5 block h-3 w-2.5 border border-current bg-white" />
                        <span className="absolute bottom-0 right-0 block h-3 w-2.5 border border-current bg-white" />
                    </span>
                )}
            </button>
        </div>
    );
}

async function copyToClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!copied) {
        throw new Error('Copy command failed');
    }
}
