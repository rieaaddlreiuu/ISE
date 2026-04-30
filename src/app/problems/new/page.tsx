import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { createProblemAction } from '@/app/problems/actions';
import { PageHeader } from '@/components/layout/pageHeader';
import { MarkdownTexTextarea } from '@/components/problems/markdownTexTextarea';
import { Card, CardHeader } from '@/components/ui/card';

export const metadata: Metadata = {
    title: '問題新規登録 | ISE',
    description: 'データベースに問題を登録',
};

function sectionLabelClassName() {
    return 'text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500';
}

function labelClassName() {
    return 'text-sm font-medium text-slate-700';
}

function lineFieldClassName() {
    return [
        'mt-3 w-full border-0 border-b border-slate-300 bg-transparent px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition',
        'placeholder:text-slate-400',
        'focus:border-slate-900',
        'focus:ring-0',
    ].join(' ');
}

function lineTextareaClassName() {
    return `${lineFieldClassName()} min-h-[132px] resize-y leading-7`;
}

function lineSelectClassName() {
    return [
        'mt-3 w-full appearance-none border-0 border-b border-slate-300 bg-transparent px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition',
        'focus:border-slate-900',
        'focus:ring-0',
    ].join(' ');
}

function Section({
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
        <section className="space-y-6 border-t border-slate-200 pt-8 first:border-t-0 first:pt-0">
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

export default function ProblemRegistrationPage() {
    return (
        <main className="min-h-screen bg-[#f5f2ea] text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    backHref="/problems"
                    backLabel="問題一覧へ戻る"
                    title="問題新規登録"
                    description="このフォームから SQLite の実データとして問題を登録します。"
                    meta="Route: /problems/new"
                    className="mb-10 flex flex-col gap-4 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between"
                    actions={
                        <Link
                            href="/problems"
                            className="inline-flex items-center justify-center border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                        >
                            問題一覧
                        </Link>
                    }
                />

                <section className="grid gap-8">
                    <Card className="shadow-none ring-1 ring-slate-200">
                        <CardHeader
                            title="新規問題フォーム"
                            subtitle="送信すると必須項目がそのままデータベースに保存されます。"
                        />

                        <form action={createProblemAction} className="space-y-8 p-5 sm:p-8">
                            <Section
                                label="Basics"
                                title="基本情報"
                                description="既存の Problem テーブルに保存される項目です。"
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    <label className="block">
                                        <span className={labelClassName()}>ステータス</span>
                                        <select name="stage" defaultValue="draft" className={lineSelectClassName()}>
                                            <option value="draft">下書き</option>
                                            <option value="review">レビュー中</option>
                                            <option value="ready">公開準備完了</option>
                                            <option value="published">公開中</option>
                                        </select>
                                    </label>
                                </div>

                                <label className="block">
                                    <span className={labelClassName()}>タイトル</span>
                                    <input
                                        name="title"
                                        className={lineFieldClassName()}
                                        placeholder="問題タイトルを入力"
                                    />
                                </label>

                                <div className="grid gap-6 md:grid-cols-3">
                                    <label className="block">
                                        <span className={labelClassName()}>科目</span>
                                        <select name="subject" defaultValue="math" className={lineSelectClassName()}>
                                            <option value="math">数学</option>
                                            <option value="physics">物理</option>
                                            <option value="chemistry">化学</option>
                                            <option value="japanese">国語</option>
                                            <option value="english">英語</option>
                                            <option value="other">その他</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className={labelClassName()}>難易度</span>
                                        <select name="difficulty" defaultValue="standard" className={lineSelectClassName()}>
                                            <option value="easy">やさしい</option>
                                            <option value="standard">標準</option>
                                            <option value="hard">難しい</option>
                                            <option value="very-hard">かなり難しい</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className={labelClassName()}>形式</span>
                                        <select name="format" defaultValue="descriptive" className={lineSelectClassName()}>
                                            <option value="descriptive">記述</option>
                                            <option value="multiple">選択式</option>
                                            <option value="short">短答</option>
                                            <option value="set">セット問題</option>
                                        </select>
                                    </label>
                                </div>

                                <label className="block">
                                    <span className={labelClassName()}>タグ</span>
                                    <input
                                        name="tags"
                                        className={lineFieldClassName()}
                                        placeholder="タグをカンマ区切りで入力"
                                    />
                                </label>
                            </Section>

                            <Section
                                label="Content"
                                title="本文と解説"
                                description="問題文は必須です。解説とメモは任意です。"
                            >
                                <MarkdownTexTextarea
                                    name="statement"
                                    label="問題文"
                                    rows={8}
                                    defaultValue=""
                                    textareaClassName={lineTextareaClassName()}
                                    previewMinHeightClassName="min-h-[180px]"
                                />

                                <MarkdownTexTextarea
                                    name="answer"
                                    label="解答"
                                    rows={6}
                                    defaultValue=""
                                    textareaClassName={lineTextareaClassName()}
                                />

                                <MarkdownTexTextarea
                                    name="answerPolicy"
                                    label="解説"
                                    rows={6}
                                    defaultValue=""
                                    textareaClassName={lineTextareaClassName()}
                                />

                                <MarkdownTexTextarea
                                    name="gradingMemo"
                                    label="作問メモ"
                                    rows={6}
                                    defaultValue=""
                                    textareaClassName={lineTextareaClassName()}
                                />
                            </Section>

                            <Section
                                label="Source"
                                title="出典"
                                description="出典情報は既存の source フィールドに保存されます。"
                            >
                                <label className="block">
                                    <span className={labelClassName()}>出典</span>
                                    <input
                                        name="source"
                                        className={lineFieldClassName()}
                                        placeholder="出典の詳細を入力"
                                    />
                                </label>
                            </Section>

                            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    登録する
                                </button>
                                <span className="text-xs text-slate-500">
                                    問題コードは自動採番され、登録後に編集画面へ移動します。
                                </span>
                            </div>
                        </form>
                    </Card>
                </section>
            </div>
        </main>
    );
}
