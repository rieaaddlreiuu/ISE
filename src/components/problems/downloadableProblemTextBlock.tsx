'use client';

import { useRef, useState, type ReactNode } from 'react';

type ActionState = 'idle' | 'working' | 'done' | 'failed';

type DownloadableProblemTextBlockProps = {
    text: string;
    label: string;
    filename: string;
    children: ReactNode;
};

export function DownloadableProblemTextBlock({ text, label, filename, children }: DownloadableProblemTextBlockProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [copyState, setCopyState] = useState<ActionState>('idle');
    const [downloadState, setDownloadState] = useState<ActionState>('idle');

    async function handleCopy() {
        try {
            await copyToClipboard(text);
            setCopyState('done');
        } catch {
            setCopyState('failed');
        }

        window.setTimeout(() => setCopyState('idle'), 1600);
    }

    async function handleDownload() {
        if (!contentRef.current) {
            return;
        }

        try {
            setDownloadState('working');
            await downloadElementAsPng(contentRef.current, filename);
            setDownloadState('done');
        } catch {
            setDownloadState('failed');
        }

        window.setTimeout(() => setDownloadState('idle'), 1800);
    }

    const copyTitle = copyState === 'done' ? 'コピー済み' : copyState === 'failed' ? 'コピー失敗' : 'コピー';
    const downloadTitle =
        downloadState === 'working'
            ? '画像を作成中'
            : downloadState === 'done'
              ? '画像を保存しました'
              : downloadState === 'failed'
                ? '画像保存に失敗'
                : 'PNG画像としてDL';

    return (
        <div className="relative pb-7">
            <div ref={contentRef} className="problem-statement-export bg-white p-5">
                {children}
            </div>
            <div className="absolute bottom-0 right-0 flex items-center gap-1">
                <IconButton
                    label={`${label}を画像としてDL`}
                    title={downloadTitle}
                    onClick={handleDownload}
                    tone={downloadState === 'failed' ? 'danger' : downloadState === 'done' ? 'success' : 'default'}
                    disabled={downloadState === 'working'}
                >
                    {downloadState === 'working' ? <LoadingIcon /> : downloadState === 'done' ? <CheckIcon /> : <DownloadIcon />}
                </IconButton>
                <IconButton
                    label={`${label}をコピー`}
                    title={copyTitle}
                    onClick={handleCopy}
                    tone={copyState === 'failed' ? 'danger' : copyState === 'done' ? 'success' : 'default'}
                >
                    {copyState === 'done' ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
            </div>
        </div>
    );
}

type IconButtonProps = {
    label: string;
    title: string;
    onClick: () => void;
    tone: 'default' | 'success' | 'danger';
    children: ReactNode;
    disabled?: boolean;
};

function IconButton({ label, title, onClick, tone, children, disabled = false }: IconButtonProps) {
    const colorClassName =
        tone === 'success' ? 'text-emerald-600' : tone === 'danger' ? 'text-rose-600' : 'text-slate-600';

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex size-8 items-center justify-center bg-transparent transition focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-wait disabled:opacity-70"
            aria-label={label}
            title={title}
        >
            <span className={`size-4 transition-colors ${colorClassName}`}>{children}</span>
        </button>
    );
}

function LoadingIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 animate-spin">
            <path
                d="M10 3.25A6.75 6.75 0 1 1 3.25 10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DownloadIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path
                d="M10 3.5V12M6.75 8.75L10 12L13.25 8.75M4 14.5V16.5H16V14.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path
                d="M4.5 10.5L8.25 14.25L15.5 6.75"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CopyIcon() {
    return (
        <span aria-hidden="true" className="relative block size-4">
            <span className="absolute left-0.5 top-0.5 block h-3 w-2.5 border border-current bg-white" />
            <span className="absolute bottom-0 right-0 block h-3 w-2.5 border border-current bg-white" />
        </span>
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

async function downloadElementAsPng(element: HTMLElement, filename: string) {
    await document.fonts?.ready;

    const { toBlob } = await import('html-to-image');
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const backgroundColor = isDarkTheme() ? '#101722' : '#ffffff';
    element.classList.add('problem-statement-capturing');

    let blob: Blob | null = null;
    try {
        await waitForPaint();
        blob = await toBlob(element, {
            backgroundColor,
            pixelRatio,
            cacheBust: true,
            style: {
                backgroundColor,
            },
        });
    } finally {
        element.classList.remove('problem-statement-capturing');
    }

    if (!blob) {
        throw new Error('PNG encoding failed');
    }

    const pngUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = pngUrl;
    anchor.download = ensurePngFilename(filename);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
}

function waitForPaint() {
    return new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
        });
    });
}

function isDarkTheme() {
    return document.documentElement.dataset.theme === 'dark';
}

function ensurePngFilename(filename: string) {
    const sanitized = filename
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '-')
        .replace(/\s+/g, '_')
        .slice(0, 120);

    const baseName = sanitized.length > 0 ? sanitized : 'problem-statement';
    return baseName.toLowerCase().endsWith('.png') ? baseName : `${baseName}.png`;
}
