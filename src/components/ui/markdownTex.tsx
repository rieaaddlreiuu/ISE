import ReactMarkdown from "react-markdown";
import {
    markdownRehypePlugins,
    markdownRemarkPlugins,
    normalizeDisplayMathBlocks,
    parseDetailsBlocks,
} from "@/lib/markdown";

type MarkdownTexProps = {
    content: string;
    className?: string;
};

export function MarkdownTex({ content, className }: MarkdownTexProps) {
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
                "[&_details]:my-3 [&_details]:rounded [&_details]:border [&_details]:border-slate-200 [&_details]:bg-slate-50 [&_details]:px-4 [&_details]:py-3",
                "[&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-slate-900",
                "[&_summary+*]:mt-3",
                "[&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.92em]",
                "[&_pre]:overflow-x-auto [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-slate-100",
                "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
                className ?? "",
            ].join(" ")}
        >
            <MarkdownTexContent content={content} />
        </div>
    );
}

type MarkdownTexContentProps = {
    content: string;
    inlineParagraphs?: boolean;
};

export function MarkdownTexContent({ content, inlineParagraphs = false }: MarkdownTexContentProps) {
    const normalizedContent = normalizeDisplayMathBlocks(content);
    const segments = parseDetailsBlocks(normalizedContent);

    return (
        <>
            {segments.map((segment, index) => {
                if (segment.type === "details") {
                    return (
                        <details key={index} open={segment.open}>
                            <summary>
                                <MarkdownTexContent content={segment.summary} inlineParagraphs />
                            </summary>
                            <MarkdownTexContent content={segment.body} />
                        </details>
                    );
                }

                return (
                    <ReactMarkdown
                        key={index}
                        remarkPlugins={markdownRemarkPlugins}
                        rehypePlugins={markdownRehypePlugins}
                        components={inlineParagraphs ? { p: ({ children }) => <>{children}</> } : undefined}
                    >
                        {segment.content}
                    </ReactMarkdown>
                );
            })}
        </>
    );
}
