import Link from 'next/link';
import { DeleteProblemButton } from '@/components/problems/deleteProblemButton';
import { ProblemEditShell, getProblemEditSections } from '@/components/problems/problemEditShell';
import { Card, CardHeader } from '@/components/ui/card';
import type { ProblemEditScreenData } from '@/mocks/problemEdit';

type ProblemEditHubScreenProps = {
    problemId: string;
    screen: ProblemEditScreenData;
};

export function ProblemEditHubScreen({ problemId, screen }: ProblemEditHubScreenProps) {
    const sections = getProblemEditSections(problemId).filter((section) => section.id !== 'hub');

    return (
        <ProblemEditShell
            problemId={problemId}
            currentSection="hub"
            title={`${screen.form.id} の編集トップ`}
            description="詳細画面から直接アクセスする編集先を整理したハブです。必要なカテゴリだけを開いて編集します。"
            meta={`Route: /problems/${problemId}/edit`}
            headerActions={
                <>
                    <Link
                        href={`/problems/${problemId}`}
                        className="inline-flex items-center justify-center border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                    >
                        詳細を表示
                    </Link>
                    <DeleteProblemButton problemId={problemId} />
                </>
            }
        >
            <Card className="shadow-none ring-1 ring-slate-200">
                <CardHeader
                    title="編集先を選ぶ"
                    subtitle="このページ自体は補助用です。運用上は詳細画面から各編集画面へ直接移動します。"
                />
                <div className="grid gap-4 p-4 md:grid-cols-2">
                    {sections.map((section) => (
                        <Link
                            key={section.id}
                            href={section.href}
                            className="border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-400 hover:bg-white"
                        >
                            <div className="text-lg font-semibold text-slate-900">{section.label}</div>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
                            <div className="mt-4 text-xs text-slate-500">{section.href}</div>
                        </Link>
                    ))}
                </div>
            </Card>

            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <Card className="shadow-none ring-1 ring-slate-200">
                    <CardHeader
                        title="現在の進捗"
                        subtitle="編集カテゴリをまたいで確認したい状態だけをここに残しています。"
                    />
                    <div className="grid gap-4 p-4 sm:grid-cols-3">
                        {screen.progress.map((item) => (
                            <div key={item.label} className="border border-slate-200 bg-slate-50 p-4">
                                <div className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
                                    {item.label}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-slate-900">{item.value}</div>
                                <div className="mt-2 text-xs leading-5 text-slate-500">{item.note}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="border-dashed shadow-none ring-1 ring-slate-200">
                    <CardHeader title="更新情報" subtitle="モック上の最終更新情報です。" />
                    <div className="space-y-2 p-4 text-sm leading-6 text-slate-600">
                        <p>更新日時: {screen.form.updatedAt}</p>
                        <p>更新者: {screen.form.editor}</p>
                        <p>problemId: {problemId}</p>
                    </div>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                <Card className="shadow-none ring-1 ring-slate-200">
                    <CardHeader title="確認チェックリスト" subtitle="分割後も共通で見たい確認項目です。" />
                    <div className="space-y-3 p-4">
                        {screen.checklist.map((item) => (
                            <div key={item} className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                {item}
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="shadow-none ring-1 ring-slate-200">
                    <CardHeader title="最近の更新" subtitle="モックの編集履歴です。" />
                    <div className="space-y-3 p-4">
                        {screen.activities.map((activity) => (
                            <div key={`${activity.label}-${activity.timestamp}`} className="border border-slate-200 bg-slate-50 p-4">
                                <div className="text-xs font-medium text-slate-500">{activity.label}</div>
                                <div className="mt-2 text-sm text-slate-900">{activity.detail}</div>
                                <div className="mt-2 text-xs text-slate-500">{activity.timestamp}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </ProblemEditShell>
    );
}
