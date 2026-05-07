import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ProblemAssetsPanel } from '@/components/problems/problemAssetsPanel';
import { DeleteProblemButton } from '@/components/problems/deleteProblemButton';
import { DifficultyValue } from '@/components/problems/difficultyValue';
import { getProblemEditSections } from '@/components/problems/problemEditShell';
import { PageHeader } from '@/components/layout/pageHeader';
import { Card, CardHeader } from '@/components/ui/card';
import { MarkdownTex } from '@/components/ui/markdownTex';
import { Tabs } from '@/components/ui/tabs';
import { getProblemDetailView, getProblemRecord } from '@/lib/backend/problemViews';

function statusClassName(status: string) {
    if (status === 'published') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    }

    if (status === 'review') {
        return 'bg-amber-50 text-amber-700 ring-amber-200';
    }

    return 'bg-slate-100 text-slate-700 ring-slate-200';
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</dt>
            <dd className="mt-2 text-sm text-slate-900">{value}</dd>
        </div>
    );
}

export async function generateMetadata(props: PageProps<'/problems/[problemId]'>): Promise<Metadata> {
    const { problemId } = await props.params;
    const problem = await getProblemRecord(problemId);

    if (!problem) {
        return { title: '問題が見つかりません | ISE' };
    }

    return {
        title: `${problem.title} | ISE`,
        description: `${problem.serialCode} の問題詳細`,
    };
}

export default async function ProblemDetailPage(props: PageProps<'/problems/[problemId]'>) {
    const { problemId } = await props.params;
    const problem = await getProblemDetailView(problemId);

    if (!problem) {
        notFound();
    }

    const editSections = getProblemEditSections(problemId).filter((section) => section.id !== 'hub');

    const tabs = [
        {
            id: 'overview',
            label: '概要',
            content: (
                <div className="space-y-6">
                    <Card>
                        <CardHeader
                            title="問題サマリー"
                            subtitle="このレコードで現在利用できる DB 項目を表示しています。"
                            right={
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClassName(problem.status)}`}
                                >
                                    {problem.status}
                                </span>
                            }
                        />
                        <dl className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                            <InfoItem label="問題コード" value={problem.id} />
                            <InfoItem label="科目" value={problem.subject} />
                            <InfoItem
                                label="難易度"
                                value={
                                    problem.difficultySelf === undefined ? (
                                        problem.level
                                    ) : (
                                        <DifficultyValue value={problem.difficultySelf} fallback={problem.level} />
                                    )
                                }
                            />
                            <InfoItem label="形式" value={problem.format} />
                        </dl>
                    </Card>

                    <Card>
                        <CardHeader
                            title="編集導線"
                            subtitle="更新したい編集画面へ直接移動できます。"
                        />
                        <div className="grid gap-4 p-4 md:grid-cols-2">
                            {editSections.map((section) => (
                                <Link
                                    key={section.id}
                                    href={section.href}
                                    className="border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-400 hover:bg-white"
                                >
                                    <div className="text-sm font-semibold text-slate-900">{section.label}</div>
                                    <div className="mt-2 text-sm leading-6 text-slate-600">{section.description}</div>
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>
            ),
        },
        {
            id: 'statement',
            label: '問題文',
            content: (
                <div className="space-y-5 px-1 py-2">
                    <MarkdownTex content={problem.statement} className="text-slate-800" />
                    <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'answer',
            label: '解答・解説',
            content: (
                <div className="space-y-8 px-1 py-2">
                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold text-slate-900">解答</h2>
                        <MarkdownTex content={problem.answer} />
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold text-slate-900">解説</h2>
                        <MarkdownTex content={problem.commentary} />
                    </section>
                </div>
            ),
        },
        {
            id: 'assets',
            label: '画像',
            content: <ProblemAssetsPanel problemId={problemId} assets={problem.assets} />,
        },
        {
            id: 'history',
            label: '履歴',
            content: (
                <Card>
                    <CardHeader title="更新履歴" subtitle="DB 上の作成日時と最終更新日時です。" />
                    <div className="space-y-3 p-4">
                        {problem.timeline.map((item) => (
                            <div key={`${item.label}-${item.value}`} className="border border-slate-200 bg-slate-50 p-4">
                                <div className="text-xs font-medium text-slate-500">{item.label}</div>
                                <div className="mt-2 text-sm text-slate-900">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            ),
        },
    ];

    return (
        <main className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <PageHeader
                    backHref="/problems"
                    backLabel="問題一覧へ戻る"
                    title={problem.title}
                    description={`${problem.subject} / ${problem.level} / ${problem.format}`}
                    meta={`Route: /problems/${problemId}`}
                    actions={
                        <>
                            <Link
                                href="/problems"
                                className="inline-flex items-center justify-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                                問題一覧
                            </Link>
                            <Link
                                href={`/problems/${problemId}/edit/metadata`}
                                className="inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                            >
                                メタ情報を編集
                            </Link>
                            <Link
                                href={`/problems/${problemId}/edit/text`}
                                className="inline-flex items-center justify-center bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                本文を編集
                            </Link>
                            <DeleteProblemButton problemId={problemId} />
                        </>
                    }
                />

                <section className="grid gap-6">
                    <Tabs tabs={tabs} initialTabId="overview" />
                </section>
            </div>
        </main>
    );
}
