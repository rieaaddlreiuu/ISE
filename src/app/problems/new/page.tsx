import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/pageHeader";
import { Card, CardHeader } from "@/components/ui/card";
import { latexSnippets, recentChecks, registrationFlow } from "@/mocks/problemRegistration";

export const metadata: Metadata = {
    title: "問題登録 | ISE",
    description: "問題文、解答方針、出典情報を整理して登録するための画面",
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

function AsideListItem({ text }: { text: string }) {
    return (
        <li className="border-b border-slate-200 pb-3 text-sm leading-6 text-slate-600 last:border-b-0 last:pb-0">
            {text}
        </li>
    );
}

export default function ProblemRegistrationPage() {
    return (
        <main className="problem-registration-page min-h-screen bg-[#f5f2ea] text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    backHref="/"
                    backLabel="ホームへ戻る"
                    title="問題登録"
                    description="ダッシュボードではなく、登録作業に集中するための入力画面として整理しています。項目は作業順にまとめ、入力欄は下線ベースで軽く見せています。"
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
                            title="登録内容"
                            subtitle="入力に必要な情報だけを順番に並べています。サマリーカードは置かず、記入対象を先頭から追える構成です。"
                        />

                        <form className="space-y-8 p-5 sm:p-8">
                            <RegistrationSection
                                label="Basics"
                                title="基本情報"
                                description="識別情報と分類を最初に確定させ、後続の編集対象を明確にします。"
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    <label className="block">
                                        <span className={labelClassName()}>登録状態</span>
                                        <select name="stage" defaultValue="draft" className={lineSelectClassName()}>
                                            <option value="draft">下書き</option>
                                            <option value="review">レビュー中</option>
                                            <option value="ready">公開準備完了</option>
                                            <option value="published">公開済み</option>
                                        </select>
                                    </label>
                                </div>

                                <label className="block">
                                    <span className={labelClassName()}>問題タイトル</span>
                                    <input
                                        name="title"
                                        defaultValue="整数条件から最大値と最小値を考察する問題"
                                        className={lineFieldClassName()}
                                        placeholder="問題の内容がすぐ分かるタイトル"
                                    />
                                </label>

                                <div className="grid gap-6 md:grid-cols-3">
                                    <label className="block">
                                        <span className={labelClassName()}>教科</span>
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
                                        <span className={labelClassName()}>難度</span>
                                        <select
                                            name="difficulty"
                                            defaultValue="standard"
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
                                        defaultValue="整数, 場合分け, 最大値"
                                        className={lineFieldClassName()}
                                        placeholder="カンマ区切りで入力"
                                    />
                                </label>
                            </RegistrationSection>

                            <RegistrationSection
                                label="Content"
                                title="問題内容"
                                description="問題文、解答方針、採点メモを分けて管理し、編集とレビューをしやすくします。"
                            >
                                <label className="block">
                                    <span className={labelClassName()}>問題文</span>
                                    <textarea
                                        name="statement"
                                        rows={6}
                                        defaultValue={`a, b を整数とし、a + b = 12 を満たすとする。\nこのとき ab の最大値と最小値を求め、理由を説明しなさい。`}
                                        className={lineTextareaClassName()}
                                    />
                                </label>

                                <div className="grid gap-6 lg:grid-cols-2">
                                    <label className="block">
                                        <span className={labelClassName()}>解答方針メモ</span>
                                        <textarea
                                            name="answerPolicy"
                                            rows={6}
                                            defaultValue={`和が固定された整数の組として整理する。\n場合分けを先に書き、最大値と最小値の候補を明示する。`}
                                            className={lineTextareaClassName()}
                                        />
                                    </label>

                                    <label className="block">
                                        <span className={labelClassName()}>採点メモ</span>
                                        <textarea
                                            name="gradingMemo"
                                            rows={6}
                                            defaultValue={`最大値だけでなく最小値にも根拠があるか確認する。\n途中の整理が不十分でも結論が正しければ部分点対象。`}
                                            className={lineTextareaClassName()}
                                        />
                                    </label>
                                </div>

                            </RegistrationSection>

                            <RegistrationSection
                                label="Source"
                                title="出典と公開設定"
                                description="出典情報と公開対象を最後に確認し、そのまま保存や次工程へ渡せる状態にします。"
                            >
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <label className="block">
                                        <span className={labelClassName()}>出典</span>
                                        <input
                                            name="source"
                                            defaultValue="自作 / 2026 春期教材向け作問"
                                            className={lineFieldClassName()}
                                            placeholder="書籍名、年度、教材名など"
                                        />
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className={labelClassName()}>公開先</div>
                                        <p className={helperTextClassName()}>
                                            ダッシュボード的な一覧ではなく、登録対象にひもづく公開先だけを選びます。
                                        </p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {["校内ストック", "学年教材", "Web掲載候補", "採点基準共有"].map((target, index) => (
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
                                        defaultValue="授業内使用を優先。外部公開時は表現を一部調整する。"
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
                                <span className="text-xs text-slate-500">UI モックのため送信処理は未接続です。</span>
                            </div>
                        </form>
                    </Card>
                </section>
            </div>
        </main>
    );
}
