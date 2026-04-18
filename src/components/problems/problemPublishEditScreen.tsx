import Link from 'next/link';
import { DeleteProblemButton } from '@/components/problems/deleteProblemButton';
import {
    ProblemEditActions,
    ProblemEditSection,
    ProblemEditShell,
    helperTextClassName,
    labelClassName,
    lineFieldClassName,
    lineTextareaClassName,
} from '@/components/problems/problemEditShell';
import { Card, CardHeader } from '@/components/ui/card';
import type { ProblemEditScreenData } from '@/mocks/problemEdit';

type ProblemPublishEditScreenProps = {
    problemId: string;
    screen: ProblemEditScreenData;
};

export function ProblemPublishEditScreen({ problemId, screen }: ProblemPublishEditScreenProps) {
    const { form } = screen;

    return (
        <ProblemEditShell
            problemId={problemId}
            currentSection="publish"
            title={`${form.id} の公開設定編集`}
            description="出典、公開先、補足メモなど、公開時に必要な周辺情報を編集します。"
            meta={`Route: /problems/${problemId}/edit/publish`}
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
                    title="公開設定フォーム"
                    subtitle="出典と公開先を分離し、本文編集画面とは責務を分けています。"
                />
                <form className="space-y-8 p-5 sm:p-8">
                    <ProblemEditSection
                        label="Source"
                        title="出典"
                        description="原典や参照元、作成経路など公開時に残したい出典情報を編集します。"
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
                    </ProblemEditSection>

                    <ProblemEditSection
                        label="Publish"
                        title="公開先"
                        description="どの媒体に出すかを選択します。"
                    >
                        <div className="space-y-4">
                            <div>
                                <div className={labelClassName()}>公開先</div>
                                <p className={helperTextClassName()}>
                                    現在はUIモックです。複数媒体への公開を想定した選択欄だけを置いています。
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { value: 'booklet', label: '冊子' },
                                    { value: 'web', label: 'Web' },
                                    { value: 'print', label: '印刷教材' },
                                    { value: 'teacher', label: '講師用資料' },
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
                    </ProblemEditSection>

                    <ProblemEditSection
                        label="Notes"
                        title="補足メモ"
                        description="公開時の注意点や連携メモを残します。"
                    >
                        <label className="block">
                            <span className={labelClassName()}>補足メモ</span>
                            <textarea
                                name="notes"
                                rows={5}
                                defaultValue={form.notes}
                                className={lineTextareaClassName()}
                            />
                        </label>
                    </ProblemEditSection>

                    <ProblemEditActions />
                </form>
            </Card>
        </ProblemEditShell>
    );
}
