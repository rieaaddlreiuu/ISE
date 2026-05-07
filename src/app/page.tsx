import Link from 'next/link';
import { PageHeader } from '@/components/layout/pageHeader';
import { Card, CardHeader, SummaryCard } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { getProblemListView } from '@/lib/backend/problemViews';
import type { ProblemListItem } from '@/lib/backend/problems';

export const dynamic = 'force-dynamic';

function statusLabel(status: string) {
    const labels: Record<string, string> = {
        draft: '下書き',
        review: 'レビュー中',
        ready: '公開準備済み',
        published: '公開中',
    };

    return labels[status] ?? status;
}

function statusClass(status: string) {
    if (status === 'published') return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    if (status === 'review') return 'bg-amber-50 text-amber-700 ring-amber-200';
    if (status === 'ready') return 'bg-sky-50 text-sky-700 ring-sky-200';
    return 'bg-slate-100 text-slate-700 ring-slate-200';
}

function splitDestinations(sourceType: string | null) {
    if (!sourceType) return [];
    return sourceType
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

function formatDate(value: string) {
    return value.slice(0, 16).replace('T', ' ');
}

function ProblemList({ items }: { items: ProblemListItem[] }) {
    return (
        <div className="space-y-3">
            {items.length === 0 ? (
                <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                    表示できる問題はまだありません。
                </div>
            ) : (
                items.map((problem) => {
                    const destinations = splitDestinations(problem.sourceType);

                    return (
                        <Link
                            key={problem.id}
                            href={`/problems/${problem.id}`}
                            aria-label={`${problem.serialCode} detail`}
                            className="grid gap-4 rounded-none border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white md:grid-cols-[1.45fr_0.8fr_0.95fr_0.75fr]"
                        >
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded bg-slate-900 px-2 py-1 text-[11px] font-medium tracking-[0.18em] text-white">
                                        {problem.serialCode}
                                    </span>
                                    <span className="text-xs text-slate-500">{problem.subject}</span>
                                </div>
                                <div className="mt-2 text-sm font-semibold text-slate-900">{problem.title}</div>
                            </div>

                            <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-1">
                                <div>
                                    <dt className="text-xs text-slate-500">難易度</dt>
                                    <dd className="mt-1 text-slate-900">{problem.difficultySelf ?? '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-slate-500">出典</dt>
                                    <dd className="mt-1 text-slate-900">{problem.sourceDetail ?? '-'}</dd>
                                </div>
                            </dl>

                            <div>
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusClass(problem.status)}`}
                                >
                                    {statusLabel(problem.status)}
                                </span>
                                <div className="mt-2 text-xs text-slate-500">公開先</div>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {destinations.length > 0 ? (
                                        destinations.map((destination) => (
                                            <span
                                                key={destination}
                                                className="inline-flex items-center rounded-full bg-white px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                                            >
                                                {destination}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500">未設定</span>
                                    )}
                                </div>
                            </div>

                            <div className="text-sm md:text-right">
                                <div className="text-xs text-slate-500">最終更新</div>
                                <div className="mt-1 text-slate-900">{formatDate(problem.updatedAt)}</div>
                            </div>
                        </Link>
                    );
                })
            )}
        </div>
    );
}

export default async function Home() {
    const { items, summary } = await getProblemListView({
        pageSize: '100',
        sort: 'updatedAt',
        order: 'desc',
    });
    const publishedItems = items.filter((problem) => problem.status === 'published');
    const unpublishedItems = items.filter((problem) => problem.status !== 'published');
    const recentItems = items.slice(0, 4);
    const destinationCounts = new Map<string, number>();

    for (const problem of publishedItems) {
        for (const destination of splitDestinations(problem.sourceType)) {
            destinationCounts.set(destination, (destinationCounts.get(destination) ?? 0) + 1);
        }
    }

    const listedTabs = [
        {
            id: 'all',
            label: 'すべて',
            description: 'DB の問題一覧',
            content: <ProblemList items={items} />,
        },
        {
            id: 'private',
            label: '未公開',
            description: '下書き・レビュー中',
            content: <ProblemList items={unpublishedItems} />,
        },
        {
            id: 'published',
            label: '公開中',
            description: '公開ステータス',
            content: <ProblemList items={publishedItems} />,
        },
    ];

    return (
        <main className="min-h-screen bg-slate-100">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <PageHeader
                    title="問題ストック管理"
                    description="データベースに保存されている問題を、公開状態と公開先を中心に確認できます。"
                    meta="Database connected"
                    actions={
                        <>
                            <Link
                                href="/problems"
                                className="inline-flex items-center justify-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                            >
                                問題一覧
                            </Link>
                            <Link
                                href="/problems/new"
                                className="inline-flex items-center justify-center bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                新しい問題を追加
                            </Link>
                        </>
                    }
                />

                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard label="総問題数" value={summary.total} sub="DB に保存済み" />
                    <SummaryCard label="公開中" value={summary.published} sub="published ステータス" />
                    <SummaryCard label="下書き" value={summary.draft} sub="draft ステータス" />
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
                    <div className="space-y-6">
                        <Tabs tabs={listedTabs} initialTabId="all" />

                        <Card>
                            <CardHeader
                                title="公開先ごとの内訳"
                                subtitle="公開中の問題に設定されている公開先を集計しています。"
                                right={<span className="text-xs text-slate-500">公開中のみ</span>}
                            />
                            <div className="grid gap-4 p-4 md:grid-cols-2">
                                {[...destinationCounts.entries()].length > 0 ? (
                                    [...destinationCounts.entries()].map(([name, count]) => (
                                        <div key={name} className="rounded-none border border-slate-200 bg-slate-50 p-4">
                                            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                                公開先
                                            </div>
                                            <div className="mt-3 text-lg font-semibold text-slate-900">{name}</div>
                                            <div className="mt-2 text-3xl font-semibold text-slate-900">{count}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-500 md:col-span-2">
                                        公開先が設定された公開中の問題はまだありません。
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader title="最近の更新" subtitle="updatedAt の新しい順に表示しています。" />
                            <div className="space-y-3 p-4">
                                {recentItems.length > 0 ? (
                                    recentItems.map((problem) => (
                                        <Link
                                            key={problem.id}
                                            href={`/problems/${problem.id}`}
                                            className="block rounded-none border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                                        >
                                            <div className="text-sm font-semibold text-slate-900">{problem.title}</div>
                                            <div className="mt-1 text-sm text-slate-600">
                                                {problem.serialCode} / {statusLabel(problem.status)}
                                            </div>
                                            <div className="mt-3 text-xs text-slate-500">
                                                {formatDate(problem.updatedAt)}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                                        更新履歴として表示できる問題はまだありません。
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader title="データ状況" subtitle="現在の問題ストックの概況です。" />
                            <div className="p-4 text-sm leading-7 text-slate-700">
                                表示中の問題は {items.length} 件です。公開中は {publishedItems.length} 件、未公開は{' '}
                                {unpublishedItems.length} 件です。
                            </div>
                        </Card>
                    </div>
                </section>
            </div>
        </main>
    );
}
