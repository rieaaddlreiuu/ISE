import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { normalizeDisplayMathBlocks } from "@/lib/markdown";

type MarkdownTexProps = {
    content: string;
    className?: string;
};

export function MarkdownTex({ content, className }: MarkdownTexProps) {
    const normalizedContent = normalizeDisplayMathBlocks(content);

    return (
        <div
            className={[
                "text-sm leading-7 text-slate-700",
                "[&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-slate-900",
                "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900",
                "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900",
                "[&_h1]:mt-8 [&_h2]:mt-7 [&_h3]:mt-6 [&_h1:first-child]:mt-0 [&_h2:first-child]:mt-0 [&_h3:first-child]:mt-0",
                "[&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
                "[&_ul]:my-3 [&_ol]:my-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6",
                "[&_li]:my-1",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600",
                "[&_hr]:my-6 [&_hr]:border-slate-200",
                "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse",
                "[&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
                "[&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2",
                "[&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.92em]",
                "[&_pre]:overflow-x-auto [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-slate-100",
                "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
                className ?? "",
            ].join(" ")}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {normalizedContent}
            </ReactMarkdown>
        </div>
    );
}
