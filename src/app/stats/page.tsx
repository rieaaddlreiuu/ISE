import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/pageHeader";
import { Card, CardHeader, SummaryCard } from "@/components/ui/card";
import { SimpleTable } from "@/components/ui/simpleTable";
import { getProblemStats } from "@/lib/backend/problemStats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "統計 | ISE",
    description: "問題データベースの難易度分布と登録状況",
};

const statusLabels: Record<string, string> = {
    draft: "下書き",
    review: "レビュー中",
    ready: "公開準備済み",
    published: "公開中",
};

const subjectLabels: Record<string, string> = {
    math: "数学",
    physics: "物理",
    chemistry: "化学",
    japanese: "国語",
    english: "英語",
    other: "その他",
};

function formatRatio(value: number) {
    return `${value.toFixed(1).replace(".0", "")}%`;
}

function BarRow({
    label,
    count,
    percentage,
    tone = "slate",
}: {
    label: string;
    count: number;
    percentage: number;
    tone?: "slate" | "sky" | "emerald" | "amber" | "rose";
}) {
    const barClassName = {
        slate: "bg-slate-700",
        sky: "bg-sky-500",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        rose: "bg-rose-500",
    }[tone];

    return (
        <div className="grid gap-2 sm:grid-cols-[7rem_1fr_5.5rem] sm:items-center">
            <div className="flex items-baseline justify-between gap-3 sm:block">
                <span className="text-sm font-medium text-slate-800">
                    {label}
                </span>
                <span className="text-xs text-slate-500 sm:hidden">
                    {count}件 / {formatRatio(percentage)}
                </span>
            </div>
            <div className="h-3 overflow-hidden bg-slate-100 ring-1 ring-inset ring-slate-200">
                <div
                    className={`h-full ${barClassName}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="hidden text-right text-sm text-slate-600 sm:block">
                {count}件 / {formatRatio(percentage)}
            </div>
        </div>
    );
}

function EmptyState({ children }: { children: React.ReactNode }) {
    return (
        <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-500">
            {children}
        </div>
    );
}

export default async function StatsPage() {
    const stats = await getProblemStats();
    const hasProblems = stats.total > 0;
    const configuredDifficulty = stats.total - stats.unsetDifficulty;

    return (
        <main className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <PageHeader
                    title="統計"
                    description="登録済み問題の難易度、ステータス、科目、形式の偏りを確認できます。"
                    meta="Route: /stats"
                    actions={
                        <>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                                ホーム
                            </Link>
                            <Link
                                href="/problems"
                                className="inline-flex items-center justify-center bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                問題一覧
                            </Link>
                        </>
                    }
                />

                <section className="grid gap-4 md:grid-cols-4">
                    <SummaryCard
                        label="総問題数"
                        value={stats.total}
                        sub="アーカイブを除外"
                    />
                    <SummaryCard
                        label="難易度設定済み"
                        value={configuredDifficulty}
                        sub={`未設定 ${stats.unsetDifficulty}件`}
                    />
                    <SummaryCard
                        label="平均難易度"
                        value={stats.averageDifficulty ?? 0}
                        sub={
                            stats.averageDifficulty === null
                                ? "難易度データなし"
                                : "設定済み問題のみ"
                        }
                    />
                    <SummaryCard
                        label="形式未設定"
                        value={stats.unsetTargetLevel}
                        sub={`解答時間未設定 ${stats.unsetSolveTime}件`}
                    />
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
                    <Card>
                        <CardHeader
                            title="難易度分布"
                            right={
                                <span className="text-xs text-slate-500">
                                    未設定 {stats.unsetDifficulty}件
                                </span>
                            }
                        />
                        <div className="space-y-4 p-4">
                            {hasProblems ? (
                                stats.difficultyDistribution.map((item) => (
                                    <BarRow
                                        key={item.difficulty}
                                        label={`難易度 ${item.difficulty}`}
                                        count={item.count}
                                        percentage={item.percentage}
                                        tone={
                                            item.difficulty >= 11
                                                ? "rose"
                                                : item.difficulty >= 9
                                                  ? "amber"
                                                  : "sky"
                                        }
                                    />
                                ))
                            ) : (
                                <EmptyState>
                                    集計できる問題がまだありません。
                                </EmptyState>
                            )}
                        </div>
                    </Card>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader
                                title="ステータス"
                                subtitle="制作状態ごとの件数です。"
                            />
                            <div className="space-y-4 p-4">
                                {hasProblems ? (
                                    stats.statusDistribution.map((item) => (
                                        <BarRow
                                            key={item.status}
                                            label={
                                                statusLabels[item.status] ??
                                                item.status
                                            }
                                            count={item.count}
                                            percentage={item.percentage}
                                            tone={
                                                item.status === "published"
                                                    ? "emerald"
                                                    : item.status === "review"
                                                      ? "amber"
                                                      : "slate"
                                            }
                                        />
                                    ))
                                ) : (
                                    <EmptyState>
                                        ステータス別の集計はありません。
                                    </EmptyState>
                                )}
                            </div>
                        </Card>

                        <Card>
                            <CardHeader
                                title="科目"
                                subtitle="登録時に選ばれた科目別の件数です。"
                            />
                            <div className="space-y-4 p-4">
                                {hasProblems ? (
                                    stats.subjectDistribution.map((item) => (
                                        <BarRow
                                            key={item.subject}
                                            label={
                                                subjectLabels[item.subject] ??
                                                item.subject
                                            }
                                            count={item.count}
                                            percentage={item.percentage}
                                            tone="sky"
                                        />
                                    ))
                                ) : (
                                    <EmptyState>
                                        科目別の集計はありません。
                                    </EmptyState>
                                )}
                            </div>
                        </Card>
                    </div>
                </section>

                <section className="mt-6">
                    <Card>
                        <CardHeader
                            title="形式分布"
                            subtitle="targetLevel に入っている形式・レベル名を集計しています。"
                        />
                        <div className="grid gap-4 p-4 md:grid-cols-2">
                            {stats.targetLevelDistribution.length > 0 ? (
                                stats.targetLevelDistribution.map((item) => (
                                    <BarRow
                                        key={item.label}
                                        label={item.label}
                                        count={item.count}
                                        percentage={item.percentage}
                                        tone="emerald"
                                    />
                                ))
                            ) : (
                                <EmptyState>
                                    形式が設定された問題はまだありません。
                                </EmptyState>
                            )}
                        </div>
                    </Card>
                </section>
                <section className="mt-6">
                    <Card>
                        <CardHeader title="難易度目安" />
                        <SimpleTable
                            headers={["Lv", "説明", "他との比較"]}
                            rows={[
                                [ 1 , "数学に自信がある場合、多少頑張れば解ける" , "九大入試数学など"],
                                [ 2 , "解ける奴は少し様子がおかしい" , "東大入試数学ぐらい"],
                                [ 3 , "解ける奴は多分様子がおかしい" , "JMO予選中盤・本選1ぐらい"],
                                [ 4 , "解ける奴は絶対様子がおかしい" , "JMO本選2～3ぐらい"],
                                [ 5 , "特に得意でも苦手でもない人が至れる限界？" , "JMO本選3～4ぐらい"],
                                [ 6 , "解ける奴はキモイ" , "MOHS5～10ぐらい"],
                                [ 7 , "ギリ人間" , "MOHS15～20ぐらい"],
                                [ 8 , "人間をやめろ！" , "MOHS20～30ぐらい"],
                                [ 9 , "エイリアン" , "MOHS35～ぐらい"],
                                [ 10 , "学部後半～研究レベルの知識が必要" , "？？？"],
                                [ 11 , "未解決問題" , "論文"]
                            ]}
                        />
                    </Card>
                </section>
            </div>
        </main>
    );
}
