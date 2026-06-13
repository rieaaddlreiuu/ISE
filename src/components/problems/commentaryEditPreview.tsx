"use client";

import { useDeferredValue, useState } from "react";
import { MarkdownTexContent } from "@/components/ui/markdownTex";

type CommentaryEditPreviewProps = {
    defaultValue: string;
    action: (formData: FormData) => void | Promise<void>;
};

export function CommentaryEditPreview({
    defaultValue,
    action,
}: CommentaryEditPreviewProps) {
    const [value, setValue] = useState(defaultValue);
    const previewValue = useDeferredValue(value);

    return (
        <form action={action} className="grid gap-4 p-4 lg:grid-cols-2">
            <label className="grid min-h-[560px] grid-rows-[auto_1fr] border border-slate-200 bg-white">
                <span className="border-b border-slate-200 px-4 py-3 text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                    edit
                </span>
                <textarea
                    name="commentary"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    className="min-h-0 w-full resize-none border-0 bg-transparent p-4 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                />
            </label>

            <section className="grid min-h-[560px] grid-rows-[auto_1fr] border border-slate-200 bg-slate-50">
                <h2 className="border-b border-slate-200 px-4 py-3 text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                    preview
                </h2>
                <div className="markdown-preview overflow-auto p-4 text-sm text-slate-800">
                    {previewValue.trim().length > 0 ? (
                        <MarkdownTexContent content={previewValue} />
                    ) : null}
                </div>
            </section>

            <div className="lg:col-span-2">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    保存
                </button>
            </div>
        </form>
    );
}
