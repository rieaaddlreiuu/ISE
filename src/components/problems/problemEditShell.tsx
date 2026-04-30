import type { ReactNode } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/pageHeader';
import { Card, CardHeader } from '@/components/ui/card';

export type ProblemEditSectionId = 'hub' | 'metadata' | 'text' | 'assets' | 'publish';

export function getProblemEditSections(problemId: string) {
    return [
        {
            id: 'hub' as const,
            label: '編集トップ',
            description: '編集項目の一覧',
            href: `/problems/${problemId}/edit`,
        },
        {
            id: 'metadata' as const,
            label: 'メタ情報',
            description: 'タイトル、科目、難易度、タグ',
            href: `/problems/${problemId}/edit/metadata`,
        },
        {
            id: 'text' as const,
            label: '本文',
            description: '問題文、解答、解説',
            href: `/problems/${problemId}/edit/text`,
        },
        {
            id: 'assets' as const,
            label: '画像',
            description: '添付画像と参照情報',
            href: `/problems/${problemId}/edit/assets`,
        },
        {
            id: 'publish' as const,
            label: '公開設定',
            description: '出典と公開先',
            href: `/problems/${problemId}/edit/publish`,
        },
    ];
}

type ProblemEditShellProps = {
    problemId: string;
    currentSection: ProblemEditSectionId;
    title: string;
    description: string;
    meta: string;
    children: ReactNode;
    headerActions?: ReactNode;
};

export function ProblemEditShell({
    problemId,
    currentSection,
    title,
    description,
    meta,
    children,
    headerActions,
}: ProblemEditShellProps) {
    const sections = getProblemEditSections(problemId);

    return (
        <main className="min-h-screen bg-[#f5f2ea] text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    backHref={`/problems/${problemId}`}
                    backLabel="問題詳細へ戻る"
                    title={title}
                    description={description}
                    meta={meta}
                    className="mb-8 flex flex-col gap-4 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between"
                    actions={headerActions}
                />

                <Card className="mb-8 shadow-none ring-1 ring-slate-200">
                    <CardHeader
                        title="編集セクション"
                        subtitle="この問題の各編集画面を切り替えます。"
                    />
                    <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
                        {sections.map((section) => {
                            const isActive = currentSection === section.id;

                            return (
                                <Link
                                    key={section.id}
                                    href={section.href}
                                    className={[
                                        'border px-4 py-4 transition',
                                        isActive
                                            ? 'border-slate-900 bg-slate-900 text-white'
                                            : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-400 hover:bg-white',
                                    ].join(' ')}
                                >
                                    <div className="text-sm font-semibold">{section.label}</div>
                                    <div
                                        className={[
                                            'mt-2 text-xs leading-5',
                                            isActive ? 'text-slate-200' : 'text-slate-500',
                                        ].join(' ')}
                                    >
                                        {section.description}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </Card>

                <section className="grid gap-8">{children}</section>
            </div>
        </main>
    );
}

export function sectionLabelClassName() {
    return 'text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500';
}

export function labelClassName() {
    return 'text-sm font-medium text-slate-700';
}

export function helperTextClassName() {
    return 'mt-2 text-xs leading-5 text-slate-500';
}

export function lineFieldClassName() {
    return [
        'mt-3 w-full border-0 border-b border-slate-300 bg-transparent px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition',
        'placeholder:text-slate-400',
        'focus:border-slate-900',
        'focus:ring-0',
    ].join(' ');
}

export function lineTextareaClassName() {
    return `${lineFieldClassName()} min-h-[132px] resize-y leading-7`;
}

export function lineSelectClassName() {
    return [
        'mt-3 w-full appearance-none border-0 border-b border-slate-300 bg-transparent px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition',
        'focus:border-slate-900',
        'focus:ring-0',
    ].join(' ');
}

function formSectionClassName() {
    return 'space-y-6 border-t border-slate-200 pt-8 first:border-t-0 first:pt-0';
}

export function ProblemEditSection({
    label,
    title,
    description,
    children,
}: {
    label: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className={formSectionClassName()}>
            <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="space-y-2">
                    <p className={sectionLabelClassName()}>{label}</p>
                    <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
                    <p className="text-sm leading-6 text-slate-500">{description}</p>
                </div>
                <div className="space-y-6">{children}</div>
            </div>
        </section>
    );
}

export function ProblemEditActions({ saveLabel = '保存' }: { saveLabel?: string }) {
    return (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8">
            <button
                type="submit"
                className="inline-flex items-center justify-center bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
                {saveLabel}
            </button>
            <button
                type="submit"
                className="inline-flex items-center justify-center border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
            >
                下書きとして保存
            </button>
            <span className="text-xs text-slate-500">保存すると現在のデータベースへ反映されます。</span>
        </div>
    );
}
