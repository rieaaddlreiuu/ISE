import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/pageHeader';
import { Card, CardHeader, SummaryCard } from '@/components/ui/card';
import { getProblemListView } from '@/lib/backend/problemViews';

export const metadata: Metadata = {
    title: '問題一覧 | ISE',
    description: 'データベースと接続された問題一覧',
};

type ProblemsPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
    return typeof value === 'string' ? value : undefined;
}

function statusClassName(status: string) {
    if (status === 'published') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    }

    if (status === 'review') {
        return 'bg-amber-50 text-amber-700 ring-amber-200';
    }

    return 'bg-slate-100 text-slate-700 ring-slate-200';
}

export default async function ProblemsPage({ searchParams }: ProblemsPageProps) {
    const params = await searchParams;
    const query = {
        q: getValue(params.q),
        status: getValue(params.status),
        subject: getValue(params.subject),
    };

    const { items, total, summary } = await getProblemListView(query);

    return (
        <main className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <PageHeader
                    title="問題一覧"
                    description="現在のデータベースに保存されている問題を一覧・絞り込み・編集できます。"
                    meta="Route: /problems"
                    actions={
                        <>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                                ホーム
                            </Link>
                            <Link
                                href="/problems/new"
                                className="inline-flex items-center justify-center bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                新規問題登録
                            </Link>
                        </>
                    }
                />

                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard label="全問題数" value={summary.total} sub="DB に保存されている件数" />
                    <SummaryCard label="下書き" value={summary.draft} sub="編集中の問題数" />
                    <SummaryCard label="公開中" value={summary.published} sub="公開状態の問題数" />
                </section>

                <section className="mt-6 grid gap-6">
                    <Card>
                        <CardHeader
                            title="絞り込み"
                            subtitle="既存の問題一覧 API の検索条件に対応しています。"
                        />
                        <form className="grid gap-4 p-4 md:grid-cols-[1.4fr_repeat(2,minmax(0,1fr))]">
                            <label className="block">
                                <span className="text-xs font-medium text-slate-600">検索</span>
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={query.q ?? ''}
                                    placeholder="タイトル、問題コード、タグで検索"
                                    className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                                />
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-600">科目</span>
                                <select
                                    name="subject"
                                    defaultValue={query.subject ?? ''}
                                    className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900"
                                >
                                    <option value="">すべて</option>
                                    <option value="math">数学</option>
                                    <option value="physics">物理</option>
                                    <option value="chemistry">化学</option>
                                    <option value="japanese">国語</option>
                                    <option value="english">英語</option>
                                    <option value="other">その他</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-xs font-medium text-slate-600">ステータス</span>
                                <select
                                    name="status"
                                    defaultValue={query.status ?? ''}
                                    className="mt-2 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900"
                                >
                                    <option value="">すべて</option>
                                    <option value="draft">下書き</option>
                                    <option value="review">レビュー中</option>
                                    <option value="ready">公開準備完了</option>
                                    <option value="published">公開中</option>
                                </select>
                            </label>
                            <div className="md:col-span-3">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    絞り込む
                                </button>
                            </div>
                        </form>
                    </Card>

                    <Card>
                        <CardHeader title="問題一覧" subtitle={`該当件数: ${total}件`} />
                        <div className="space-y-3 p-4">
                            {items.length === 0 ? (
                                <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                                    問題はまだ登録されていません。
                                </div>
                            ) : (
                                items.map((problem) => (
                                    <article
                                        key={problem.id}
                                        className="grid gap-4 border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1.8fr_0.9fr_0.9fr_auto]"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded bg-slate-900 px-2 py-1 text-[11px] font-semibold tracking-[0.18em] text-white">
                                                    {problem.serialCode}
                                                </span>
                                                <span className="text-xs text-slate-500">{problem.subject}</span>
                                            </div>
                                            <h2 className="text-sm font-semibold text-slate-900">{problem.title}</h2>
                                            <p className="text-xs text-slate-500">
                                                タグ: {problem.tags.length > 0 ? problem.tags.join(', ') : '-'}
                                            </p>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <div className="text-xs text-slate-500">難易度</div>
                                                <div className="mt-1 text-slate-900">
                                                    {problem.difficultySelf ?? '-'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500">形式</div>
                                                <div className="mt-1 text-slate-900">
                                                    {problem.targetLevel ?? '-'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClassName(problem.status)}`}
                                            >
                                                {problem.status}
                                            </span>
                                            <div className="text-xs text-slate-500">
                                                更新日時: {problem.updatedAt}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start gap-2 lg:items-end">
                                            <Link
                                                href={`/problems/${problem.id}`}
                                                className="inline-flex items-center justify-center border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                                            >
                                                詳細
                                            </Link>
                                            <Link
                                                href={`/problems/${problem.id}/edit`}
                                                className="inline-flex items-center justify-center bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                                            >
                                                編集
                                            </Link>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </Card>
                </section>
            </div>
        </main>
    );
}
