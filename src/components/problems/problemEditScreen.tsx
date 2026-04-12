import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/pageHeader";
import { MarkdownTexTextarea } from "@/components/problems/markdownTexTextarea";
import { Card, CardHeader } from "@/components/ui/card";
import type { ProblemEditScreenData } from "@/mocks/problemEdit";

type ProblemEditScreenProps = {
    problemId: string;
    screen: ProblemEditScreenData;
};

function sectionLabelClassName() {
    return "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500";
}

function labelClassName() {
    return "text-sm font-medium text-slate-700";
}

function helperTextClassName() {
    return "mt-2 text-xs leading-5 text-slate-500";
}

function lineFieldClassName() {
    return [
        "mt-3 w-full border-0 border-b border-slate-300 bg-transparent px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-slate-900",
        "focus:ring-0",
    ].join(" ");
}

function lineTextareaClassName() {
    return `${lineFieldClassName()} min-h-[132px] resize-y leading-7`;
}

function lineSelectClassName() {
    return [
        "mt-3 w-full appearance-none border-0 border-b border-slate-300 bg-transparent px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition",
        "focus:border-slate-900",
        "focus:ring-0",
    ].join(" ");
}

function formSectionClassName() {
    return "space-y-6 border-t border-slate-200 pt-8 first:border-t-0 first:pt-0";
}

function ProblemEditSection({
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

export function ProblemEditScreen({ problemId, screen }: ProblemEditScreenProps) {
    const { form } = screen;

    return (
        <main className="min-h-screen bg-[#f5f2ea] text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    backHref="/problems"
                    backLabel="問題一覧へ戻る"
                    title={`${form.id} の問題編集`}
                    description="既存の問題情報を更新するための編集画面です。入力内容はモック表示ですが、画面上の構成と導線は実運用に近い形に合わせています。"
                    meta={`Route: /problems/${problemId}/edit`}
                    className="mb-10 flex flex-col gap-4 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between"
                    actions={
                        <>
                            <Link
                                href="/problems"
                                className="inline-flex items-center justify-center border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                            >
                                一覧へ戻る
                            </Link>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                保存
                            </button>
                        </>
                    }
                />

                <section className="grid gap-8">
                    <Card className="shadow-none ring-1 ring-slate-200">
                        <CardHeader
                            title="編集フォーム"
                            subtitle="問題の基本情報、本文、公開設定をひとつの画面で編集できます。現在はモックデータを表示しています。"
                        />

                        <form className="space-y-8 p-5 sm:p-8">
                            <ProblemEditSection
                                label="Basics"
                                title="基本情報"
                                description="問題 ID、状態、科目、難易度などの基本項目を更新します。"
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    <label className="block">
                                        <span className={labelClassName()}>問題 ID</span>
                                        <input
                                            name="id"
                                            defaultValue={form.id}
                                            className={lineFieldClassName()}
                                            placeholder="ALG-201"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className={labelClassName()}>ステータス</span>
                                        <select name="status" defaultValue={form.status} className={lineSelectClassName()}>
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
                                        defaultValue={form.title}
                                        className={lineFieldClassName()}
                                        placeholder="問題タイトル"
                                    />
                                </label>

                                <div className="grid gap-6 md:grid-cols-3">
                                    <label className="block">
                                        <span className={labelClassName()}>科目</span>
                                        <select name="subject" defaultValue={form.subject} className={lineSelectClassName()}>
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
                                        <select
                                            name="difficulty"
                                            defaultValue={form.difficulty}
                                            className={lineSelectClassName()}
                                        >
                                            <option value="easy">やさしい</option>
                                            <option value="standard">標準</option>
                                            <option value="hard">やや難</option>
                                            <option value="very-hard">難しい</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className={labelClassName()}>形式</span>
                                        <select name="format" defaultValue={form.format} className={lineSelectClassName()}>
                                            <option value="descriptive">記述</option>
                                            <option value="multiple">選択</option>
                                            <option value="short">短答</option>
                                            <option value="set">大問セット</option>
                                        </select>
                                    </label>
                                </div>

                                <label className="block">
                                    <span className={labelClassName()}>タグ</span>
                                    <input
                                        name="tags"
                                        defaultValue={form.tags}
                                        className={lineFieldClassName()}
                                        placeholder="タグをカンマ区切りで入力"
                                    />
                                </label>
                            </ProblemEditSection>

                            <ProblemEditSection
                                label="Content"
                                title="問題内容"
                                description="問題文とメモ類は Markdown + TeX 記法に対応しています。プレビューで数式の表示を確認できます。"
                            >
                                <MarkdownTexTextarea
                                    name="statement"
                                    label="問題文"
                                    rows={7}
                                    defaultValue={form.statement}
                                    textareaClassName={lineTextareaClassName()}
                                    previewMinHeightClassName="min-h-[180px]"
                                />

                                <div className="space-y-6">
                                    <MarkdownTexTextarea
                                        name="answerPolicy"
                                        label="解答方針メモ"
                                        rows={6}
                                        defaultValue={form.answerPolicy}
                                        textareaClassName={lineTextareaClassName()}
                                    />

                                    <MarkdownTexTextarea
                                        name="gradingMemo"
                                        label="採点メモ"
                                        rows={6}
                                        defaultValue={form.gradingMemo}
                                        textareaClassName={lineTextareaClassName()}
                                    />
                                </div>
                            </ProblemEditSection>

                            <ProblemEditSection
                                label="Publish"
                                title="出典と公開設定"
                                description="出典情報と公開先をまとめて確認できます。公開先はモック表示です。"
                            >
                                <label className="block">
                                    <span className={labelClassName()}>出典</span>
                                    <input
                                        name="source"
                                        defaultValue={form.source}
                                        className={lineFieldClassName()}
                                        placeholder="出典情報"
                                    />
                                </label>

                                <div className="space-y-4">
                                    <div>
                                        <div className={labelClassName()}>公開先</div>
                                        <p className={helperTextClassName()}>
                                            どの媒体に掲載するかを選択します。現在は UI のみのモックです。
                                        </p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {[
                                            { value: "booklet", label: "冊子" },
                                            { value: "web", label: "Web" },
                                            { value: "print", label: "印刷教材" },
                                            { value: "teacher", label: "教員用資料" },
                                        ].map((target) => (
                                            <label
                                                key={target.value}
                                                className="flex items-start gap-3 border-b border-slate-300 pb-3 text-sm text-slate-700"
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="destinations"
                                                    value={target.value}
                                                    defaultChecked={form.destinations.includes(target.value)}
                                                    className="mt-1 h-4 w-4 border-slate-300 text-slate-900"
                                                />
                                                <span>{target.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <label className="block">
                                    <span className={labelClassName()}>備考メモ</span>
                                    <textarea
                                        name="notes"
                                        rows={4}
                                        defaultValue={form.notes}
                                        className={lineTextareaClassName()}
                                    />
                                </label>
                            </ProblemEditSection>

                            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    保存
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                                >
                                    下書きに戻す
                                </button>
                                <span className="text-xs text-slate-500">
                                    モック画面のため、保存ボタンではデータは更新されません。
                                </span>
                            </div>
                        </form>
                    </Card>
                </section>

                <section className="mt-8">
                    <Card className="border-dashed shadow-none ring-1 ring-slate-200">
                        <CardHeader title="現在の状態" subtitle="編集対象の表示情報です。" />
                        <div className="space-y-2 p-4 text-sm leading-6 text-slate-600">
                            <p>最終更新: {form.updatedAt}</p>
                            <p>更新者: {form.editor}</p>
                            <p>problemId: {problemId}</p>
                        </div>
                    </Card>
                </section>
            </div>
        </main>
    );
}
