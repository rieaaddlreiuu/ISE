"use client";

import { useState, type ReactNode } from "react";
import { MarkdownTex } from "@/components/ui/markdownTex";
import {
    applyNotationTransform,
    notationTransformOptions,
    type NotationTransformMode,
} from "@/utils/notationTransform";

type CopyState = "idle" | "copied" | "failed";

type CopyableTextBlockProps = {
    text: string;
    label: string;
    children?: ReactNode;
    enableNotationTransform?: boolean;
    markdownClassName?: string;
};

export function CopyableTextBlock({
    text,
    label,
    children,
    enableNotationTransform = false,
    markdownClassName,
}: CopyableTextBlockProps) {
    const [copyState, setCopyState] = useState<CopyState>("idle");
    const [notationMode, setNotationMode] =
        useState<NotationTransformMode>("source");
    const displayText = applyNotationTransform(text, notationMode);

    async function handleCopy() {
        try {
            await copyToClipboard(displayText);
            setCopyState("copied");
        } catch {
            setCopyState("failed");
        }

        window.setTimeout(() => setCopyState("idle"), 1600);
    }

    const statusLabel =
        copyState === "copied"
            ? "コピー済み"
            : copyState === "failed"
              ? "コピー失敗"
              : "コピー";
    const iconClassName =
        copyState === "copied"
            ? "text-emerald-600"
            : copyState === "failed"
              ? "text-rose-600"
              : "text-slate-600";

    return (
        <div className="relative pb-11">
            {enableNotationTransform ? (
                <MarkdownTex
                    content={displayText}
                    className={markdownClassName}
                />
            ) : (
                children
            )}
            <div className="absolute bottom-0 right-0 flex items-center gap-1">
                {enableNotationTransform ? (
                    <NotationTransformControl
                        label={label}
                        value={notationMode}
                        onChange={setNotationMode}
                    />
                ) : null}
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex size-8 items-center justify-center bg-transparent transition focus:outline-none focus:ring-2 focus:ring-slate-300"
                    aria-label={`${label}をコピー`}
                    title={statusLabel}
                >
                    {copyState === "copied" ? (
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
                        <span
                            aria-hidden="true"
                            className={`relative block size-4 transition-colors ${iconClassName}`}
                        >
                            <span className="absolute left-0.5 top-0.5 block h-3 w-2.5 border border-current bg-white" />
                            <span className="absolute bottom-0 right-0 block h-3 w-2.5 border border-current bg-white" />
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

type NotationTransformControlProps = {
    label: string;
    value: NotationTransformMode;
    onChange: (value: NotationTransformMode) => void;
};

function NotationTransformControl({
    label,
    value,
    onChange,
}: NotationTransformControlProps) {
    return (
        <div
            className="flex items-center border border-slate-200 bg-white"
            aria-label={`${label}の表記変換`}
        >
            {notationTransformOptions.map((option) => (
                <button
                    key={option.mode}
                    type="button"
                    onClick={() => onChange(option.mode)}
                    className={`inline-flex h-8 min-w-8 items-center justify-center px-2 text-xs transition focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                        value === option.mode
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    aria-pressed={value === option.mode}
                    aria-label={`${label}の${option.title}`}
                    title={option.title}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

async function copyToClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!copied) {
        throw new Error("Copy command failed");
    }
}
