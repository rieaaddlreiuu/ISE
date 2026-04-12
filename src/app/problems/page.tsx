import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/pageHeader';
import { Card, CardHeader, SummaryCard } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { problemList, problemSummaryCards } from '@/mocks/problems';

export const metadata: Metadata = {
    title: '問題一覧 | ISE',
    description: '問題一覧の仮画面です。',
};

function statusClassName(status: string) {
    if (status === '公開済み') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    }

    if (status === 'レビュー中') {
        return 'bg-amber-50 text-amber-700 ring-amber-200';
    }

    return 'bg-slate-100 text-slate-700 ring-slate-200';
}

function ProblemsTable({ items }: { items: typeof problemList }) {
    return (
        <div className="space-y-3">
            {items.map((problem) => (
                <article
                    key={problem.id}
                    className="group relative grid gap-4 border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white lg:grid-cols-[1.5fr_1fr_0.9fr_0.8fr]"
                >
                    <Link
                        href={`/problems/${problem.id}`}
                        aria-label={`${problem.id} の詳細を見る`}
                        className="absolute inset-0"
                    />
                    <div className="relative z-10 space-y-2 pointer-events-none">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-slate-900 px-2 py-1 text-[11px] font-semibold tracking-[0.18em] text-white">
                                {problem.id}
                            </span>
                            <span className="text-xs text-slate-500">{problem.subject}</span>
                            <span className="text-xs text-slate-500">形式: {problem.format}</span>
                        </div>
                        <h2 className="text-sm font-semibold text-slate-900 transition group-hover:text-slate-700">
                            {problem.title}
                        </h2>
                        <p className="text-xs text-slate-500">出典: {problem.source}</p>
                    </div>

                    <dl className="relative z-10 grid grid-cols-2 gap-3 text-sm pointer-events-none sm:grid-cols-3 lg:grid-cols-1">
                        <div>
                            <dt className="text-xs text-slate-500">難度</dt>
                            <dd className="mt-1 text-slate-900">{problem.level}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-500">公開先</dt>
                            <dd className="mt-1 text-slate-900">
                                {problem.destinations.length > 0 ? problem.destinations.length : '-'}
                            </dd>
                        </div>
                    </dl>

                    <div className="relative z-10 pointer-events-none">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClassName(problem.status)}`}
                        >
                            {problem.status}
                        </span>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {problem.destinations.length > 0 ? (
                                problem.destinations.map((destination) => (
                                    <span
                                        key={destination}
                                        className="inline-flex items-center rounded-full bg-white px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                                    >
                                        {destination}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-500">未設定</span>
                            )}
                        </div>
                    </div>

                    <div className="relative z-10 text-sm pointer-events-none lg:text-right">
                        <div className="text-xs text-slate-500">更新日時</div>
                        <div className="mt-1 text-slate-900">{problem.updatedAt}</div>
                        <Link
                            href={`/problems/${problem.id}/edit`}
                            className="relative z-20 mt-3 inline-flex items-center justify-center border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition pointer-events-auto hover:border-slate-900 hover:text-slate-900"
                        >
                            編集
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default function ProblemsPage() {
    const tabs = [
        {
            id: 'all',
            label: 'すべて',
            description: `${problemList.length}件`,
            content: <ProblemsTable items={problemList} />,
        },
        {
            id: 'draft',
            label: '下書き',
            description: `${problemList.filter((problem) => problem.status === '下書き').length}件`,
            content: (
                <ProblemsTable items={problemList.filter((problem) => problem.status === '下書き')} />
            ),
        },
        {
            id: 'published',
            label: '公開済み',
            description: `${problemList.filter((problem) => problem.status === '公開済み').length}件`,
            content: (
                <ProblemsTable items={problemList.filter((problem) => problem.status === '公開済み')} />
            ),
        },
    ];

    return (
        <main className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <PageHeader
                    title="問題一覧"
                    description="問題データの仮一覧画面です。絞り込みや導線の雰囲気が確認できる状態まで先に用意しています。"
                    meta="Route: /problems"
                    actions={
                        <>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                                ホームへ戻る
                            </Link>
                            <Link
                                href="/problems/new"
                                className="inline-flex items-center justify-center bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                新規登録
                            </Link>
                        </>
                    }
                />

                <section className="grid gap-4 md:grid-cols-3">
                    {problemSummaryCards.map((card) => (
                        <SummaryCard key={card.label} label={card.label} value={card.value} sub={card.sub} />
                    ))}
                </section>

                <section className="mt-6 grid gap-6">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader
                                title="検索と絞り込み"
                                subtitle="見た目確認用の仮UIです。まだ検索処理やAPI接続は入れていません。"
                            />
                            <div className="grid gap-4 p-4 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
                                <label className="block">
                                    <span className="text-xs font-medium text-slate-600">キーワード</span>
                                    <input
                                        type="text"
                                        placeholder="ID・タイトル・タグを検索"
                                        className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-xs font-medium text-slate-600">教科</span>
                                    <select className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900">
                                        <option>すべて</option>
                                        <option>数学</option>
                                        <option>国語</option>
                                        <option>理科</option>
                                        <option>英語</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-xs font-medium text-slate-600">状態</span>
                                    <select className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900">
                                        <option>すべて</option>
                                        <option>下書き</option>
                                        <option>レビュー中</option>
                                        <option>公開済み</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-xs font-medium text-slate-600">形式</span>
                                    <select className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900">
                                        <option>すべて</option>
                                        <option>記述式</option>
                                        <option>選択式</option>
                                        <option>短答</option>
                                    </select>
                                </label>
                            </div>
                        </Card>

                        <Tabs tabs={tabs} initialTabId="all" />
                    </div>
                </section>
            </div>
        </main>
    );
}
