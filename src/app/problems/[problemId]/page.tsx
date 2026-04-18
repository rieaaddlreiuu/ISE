import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProblemAssetsPanel } from '@/components/problems/problemAssetsPanel';
import { DeleteProblemButton } from '@/components/problems/deleteProblemButton';
import { getProblemEditSections } from '@/components/problems/problemEditShell';
import { PageHeader } from '@/components/layout/pageHeader';
import { Card, CardHeader } from '@/components/ui/card';
import { MarkdownTex } from '@/components/ui/markdownTex';
import { Tabs } from '@/components/ui/tabs';
import { isProblemDeleted } from '@/lib/problemDeletion';
import { getProblemDetailMock, problemDetailIds } from '@/mocks/problemDetails';

function statusClassName(status: string) {
    if (status === '公開中') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    }

    if (status === 'レビュー中') {
        return 'bg-amber-50 text-amber-700 ring-amber-200';
    }

    return 'bg-slate-100 text-slate-700 ring-slate-200';
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</dt>
            <dd className="mt-2 text-sm text-slate-900">{value}</dd>
        </div>
    );
}

function PlainSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <div>{children}</div>
        </section>
    );
}

function EditEntryCard({
    label,
    description,
    href,
}: {
    label: string;
    description: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-400 hover:bg-white"
        >
            <div className="text-sm font-semibold text-slate-900">{label}</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">{description}</div>
            <div className="mt-3 text-xs text-slate-500">{href}</div>
        </Link>
    );
}

export async function generateStaticParams() {
    return problemDetailIds.map((problemId) => ({ problemId }));
}

export async function generateMetadata(props: PageProps<'/problems/[problemId]'>): Promise<Metadata> {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        return {
            title: 'Problem not found | ISE',
        };
    }

    const problem = getProblemDetailMock(problemId);

    return {
        title: `${problem.title} | ISE`,
        description: `${problem.id} の問題詳細画面`,
    };
}

export default async function ProblemDetailPage(props: PageProps<'/problems/[problemId]'>) {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        notFound();
    }

    const problem = getProblemDetailMock(problemId);
    const editSections = getProblemEditSections(problem.id).filter((section) => section.id !== 'hub');

    const tabs = [
        {
            id: 'overview',
            label: '概要',
            content: (
                <div className="space-y-6">
                    <Card>
                        <CardHeader
                            title="問題概要"
                            subtitle="基本情報を閲覧する表示専用エリアです。編集は各編集画面で行います。"
                            right={
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClassName(problem.status)}`}
                                >
                                    {problem.status}
                                </span>
                            }
                        />
                        <dl className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                            <InfoItem label="問題ID" value={problem.id} />
                            <InfoItem label="科目" value={problem.subject} />
                            <InfoItem label="難易度" value={problem.level} />
                            <InfoItem label="形式" value={problem.format} />
                        </dl>
                    </Card>

                    <Card>
                        <CardHeader
                            title="編集導線"
                            subtitle="詳細画面は表示専用です。編集対象ごとに専用画面へ直接移動します。"
                        />
                        <div className="grid gap-4 p-4 md:grid-cols-2">
                            {editSections.map((section) => (
                                <EditEntryCard
                                    key={section.id}
                                    label={section.label}
                                    description={section.description}
                                    href={section.href}
                                />
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <CardHeader title="確認状況" subtitle="レビュー前に見ておきたい確認事項です。" />
                        <div className="space-y-3 p-4">
                            {problem.checklist.map((item) => (
                                <div key={item} className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                    {item}
                                </div>
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
                    <PlainSection title="解答">
                        <MarkdownTex content={problem.answer} />
                    </PlainSection>
                    <PlainSection title="解説">
                        <MarkdownTex content={problem.commentary} />
                    </PlainSection>
                </div>
            ),
        },
        {
            id: 'assets',
            label: '画像',
            content: <ProblemAssetsPanel problemId={problem.id} assets={problem.assets} />,
        },
        {
            id: 'history',
            label: '履歴',
            content: (
                <Card>
                    <CardHeader title="更新履歴" subtitle="モック上の変更履歴です。" />
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
        {
            id: 'other',
            label: '公開情報',
            content: (
                <div className="space-y-6">
                    <Card>
                        <CardHeader title="公開設定" subtitle="公開先と周辺情報の表示専用エリアです。" />
                        <div className="space-y-4 p-4">
                            <div>
                                <div className="text-xs font-medium text-slate-500">公開先</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {problem.destinations.length > 0 ? (
                                        problem.destinations.map((destination) => (
                                            <span
                                                key={destination}
                                                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                                            >
                                                {destination}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500">未設定</span>
                                    )}
                                </div>
                            </div>

                            <dl className="grid gap-4">
                                <InfoItem label="作成者" value={problem.createdBy} />
                                <InfoItem label="出典" value={problem.source} />
                                <InfoItem label="最終更新" value={problem.updatedAt} />
                            </dl>
                        </div>
                    </Card>

                    <Card className="border-dashed">
                        <CardHeader title="レビュー用メモ" subtitle="確認時の補足メモです。" />
                        <div className="p-4">
                            <MarkdownTex content={problem.reviewMemo} />
                        </div>
                    </Card>
                </div>
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
                    meta={`Route: /problems/${problem.id}`}
                    actions={
                        <>
                            <Link
                                href="/problems"
                                className="inline-flex items-center justify-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                                一覧へ
                            </Link>
                            <Link
                                href={`/problems/${problem.id}/edit/metadata`}
                                className="inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                            >
                                問題概要を編集
                            </Link>
                            <Link
                                href={`/problems/${problem.id}/edit/text`}
                                className="inline-flex items-center justify-center bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                本文を編集
                            </Link>
                            <DeleteProblemButton problemId={problem.id} />
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
