import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/pageHeader";
import { MarkdownTexTextarea } from "@/components/problems/markdownTexTextarea";
import { Card, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "問題作成 | ISE",
    description: "問題文、解答方針メモ、公開設定を入力して新しい問題を作成する画面",
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

function RegistrationSection({
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

export default function ProblemRegistrationPage() {
    return (
        <main className="min-h-screen bg-[#f5f2ea] text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    backHref="/"
                    backLabel="ホームへ戻る"
                    title="問題作成"
                    description="新しい問題を登録するための入力画面です。問題内容に関する入力欄は Markdown + TeX に対応しています。"
                    meta="Route: /problems/new"
                    className="mb-10 flex flex-col gap-4 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between"
                    actions={
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                        >
                            一覧へ戻る
                        </Link>
                    }
                />

                <section className="grid gap-8">
                    <Card className="shadow-none ring-1 ring-slate-200">
                        <CardHeader
                            title="登録フォーム"
                            subtitle="基本情報、問題本文、公開設定の順に入力します。現在は画面確認用のモックです。"
                        />

                        <form className="space-y-8 p-5 sm:p-8">
                            <RegistrationSection
                                label="Basics"
                                title="基本情報"
                                description="タイトル、科目、難易度などの基本項目を入力します。"
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    <label className="block">
                                        <span className={labelClassName()}>登録状態</span>
                                        <select name="stage" defaultValue="draft" className={lineSelectClassName()}>
                                            <option value="draft">下書き</option>
                                            <option value="review">レビュー中</option>
                                            <option value="ready">公開準備完了</option>
                                            <option value="published">公開中</option>
                                        </select>
                                    </label>
                                </div>

                                <label className="block">
                                    <span className={labelClassName()}>問題タイトル</span>
                                    <input
                                        name="title"
                                        defaultValue="整数 a, b が a + b = 12 を満たすときの最大値と最小値を求める"
                                        className={lineFieldClassName()}
                                        placeholder="問題タイトル"
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
                                            <option value="hard">やや難</option>
                                            <option value="very-hard">難しい</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className={labelClassName()}>形式</span>
                                        <select name="format" defaultValue="descriptive" className={lineSelectClassName()}>
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
                                        defaultValue="整数, 最大値, 最小値"
                                        className={lineFieldClassName()}
                                        placeholder="タグをカンマ区切りで入力"
                                    />
                                </label>
                            </RegistrationSection>

                            <RegistrationSection
                                label="Content"
                                title="問題内容"
                                description="問題文、解答方針メモ、採点メモは Markdown + TeX 記法に対応しています。"
                            >
                                <MarkdownTexTextarea
                                    name="statement"
                                    label="問題文"
                                    rows={6}
                                    defaultValue={`整数 $a, b$ が $a + b = 12$ を満たすとする。\n\n$ab$ の最大値と最小値を求めよ。\n\n$$a(12-a)$$`}
                                    textareaClassName={lineTextareaClassName()}
                                    previewMinHeightClassName="min-h-[180px]"
                                />

                                <div className="space-y-6">
                                    <MarkdownTexTextarea
                                        name="answerPolicy"
                                        label="解答方針メモ"
                                        rows={6}
                                        defaultValue={`- $b = 12 - a$ とおいて $ab = a(12-a)$ に変形する。\n- 二次関数として頂点を確認する。\n- 最小値は整数条件の扱いも確認する。`}
                                        textareaClassName={lineTextareaClassName()}
                                    />

                                    <MarkdownTexTextarea
                                        name="gradingMemo"
                                        label="採点メモ"
                                        rows={6}
                                        defaultValue={`- 変形のみで終わっている解答は途中点。\n- 最大値・最小値の両方が正しいことを確認する。\n- 根拠のない結論のみの答案は減点対象。`}
                                        textareaClassName={lineTextareaClassName()}
                                    />
                                </div>
                            </RegistrationSection>

                            <RegistrationSection
                                label="Source"
                                title="出典と公開設定"
                                description="出典情報と公開先を入力します。公開先は画面モックです。"
                            >
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <label className="block">
                                        <span className={labelClassName()}>出典</span>
                                        <input
                                            name="source"
                                            defaultValue="自作 / 2026 年度教材案"
                                            className={lineFieldClassName()}
                                            placeholder="出典、年度、媒体など"
                                        />
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className={labelClassName()}>公開先</div>
                                        <p className={helperTextClassName()}>
                                            問題をどの媒体で利用するかを選択します。現在はモック表示です。
                                        </p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {["冊子", "学年共有", "Web掲載", "採点メモ共有"].map((target, index) => (
                                            <label
                                                key={target}
                                                className="flex items-start gap-3 border-b border-slate-300 pb-3 text-sm text-slate-700"
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="publishingTargets"
                                                    value={target}
                                                    defaultChecked={index === 0}
                                                    className="mt-1 h-4 w-4 border-slate-300 text-slate-900"
                                                />
                                                <span>{target}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <label className="block">
                                    <span className={labelClassName()}>備考</span>
                                    <textarea
                                        name="notes"
                                        rows={4}
                                        defaultValue="採点者向け共有が必要な場合は、公開前に採点基準との整合を確認する。"
                                        className={lineTextareaClassName()}
                                    />
                                </label>
                            </RegistrationSection>

                            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    保存
                                </button>
                                <span className="text-xs text-slate-500">モック画面のため、保存処理は未実装です。</span>
                            </div>
                        </form>
                    </Card>
                </section>
            </div>
        </main>
    );
}
