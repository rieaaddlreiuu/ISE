import Link from 'next/link';
import { saveProblemMetadataAction } from '@/app/problems/actions';
import { AiSingleRunPanel } from '@/components/problems/aiSingleRunPanel';
import { DeleteProblemButton } from '@/components/problems/deleteProblemButton';
import { ProblemTagChipSelector } from '@/components/problems/problemTagChipSelector';
import {
    ProblemEditActions,
    ProblemEditSection,
    ProblemEditShell,
    labelClassName,
    lineFieldClassName,
    lineSelectClassName,
} from '@/components/problems/problemEditShell';
import { Card, CardHeader } from '@/components/ui/card';
import type { TagOption } from '@/lib/backend/tags';
import type { ProblemEditScreenData } from '@/mocks/problemEdit';
import type { ProblemDetail } from '@/mocks/problemDetails';

type ProblemMetadataEditScreenProps = {
    problemId: string;
    screen: ProblemEditScreenData;
    problem: ProblemDetail;
    tagOptions: TagOption[];
};

export function ProblemMetadataEditScreen({
    problemId,
    screen,
    problem,
    tagOptions,
}: ProblemMetadataEditScreenProps) {
    const { form } = screen;
    const saveAction = saveProblemMetadataAction.bind(null, problemId);

    return (
        <ProblemEditShell
            problemId={problemId}
            currentSection="metadata"
            title={`${form.id} のメタ情報編集`}
            description="タイトル、状態、教科、難易度などの基本情報を編集する画面です。AI難易度評価はその場で1回分だけ表示する前提にしています。"
            meta={`Route: /problems/${problemId}/edit/metadata`}
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
                    title="メタ情報フォーム"
                    subtitle="ID、タイトル、状態、教科、タグなどの基本情報を編集できます。"
                />
                <form action={saveAction} className="space-y-8 p-5 sm:p-8">
                    <ProblemEditSection
                        label="Basics"
                        title="基本情報"
                        description="問題の識別情報と分類情報を編集します。"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <label className="block">
                                <span className={labelClassName()}>問題ID</span>
                                <input
                                    name="id"
                                    defaultValue={form.id}
                                    className={lineFieldClassName()}
                                    placeholder="ALG-201"
                                />
                            </label>

                            <label className="block">
                                <span className={labelClassName()}>ステータス</span>
                                <select name="status" defaultValue={form.status} className={lineSelectClassName()}>
                                    <option value="draft">下書き</option>
                                    <option value="review">レビュー中</option>
                                    <option value="ready">公開準備</option>
                                    <option value="published">公開済み</option>
                                </select>
                            </label>
                        </div>

                        <label className="block">
                            <span className={labelClassName()}>タイトル</span>
                            <input
                                name="title"
                                defaultValue={form.title}
                                className={lineFieldClassName()}
                                placeholder="問題タイトル"
                            />
                        </label>

                        <div className="grid gap-6 md:grid-cols-3">
                            <label className="block">
                                <span className={labelClassName()}>教科</span>
                                <select name="subject" defaultValue={form.subject} className={lineSelectClassName()}>
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
                                <input
                                    name="difficulty"
                                    type="number"
                                    min="1"
                                    max="11"
                                    step="1"
                                    defaultValue={form.difficulty || '5'}
                                    className={lineFieldClassName()}
                                    placeholder="1〜11"
                                />
                            </label>

                            <label className="block">
                                <span className={labelClassName()}>形式</span>
                                <select name="format" defaultValue={form.format} className={lineSelectClassName()}>
                                    <option value="descriptive">記述</option>
                                    <option value="multiple">選択式</option>
                                    <option value="short">短答</option>
                                    <option value="set">大問セット</option>
                                </select>
                            </label>
                        </div>

                        <div className="block">
                            <span className={labelClassName()}>タグ</span>
                            <div className="mt-3">
                                <ProblemTagChipSelector
                                    options={tagOptions}
                                    initialSelectedTagIds={form.tagIds}
                                />
                            </div>
                        </div>
                    </ProblemEditSection>

                    <ProblemEditActions />
                </form>
            </Card>

            <Card className="shadow-none ring-1 ring-slate-200">
                <CardHeader
                    title="AI難易度評価"
                    subtitle="問題文をもとに、その場で1回分だけ難易度評価を表示する想定のUIです。"
                />
                <AiSingleRunPanel
                    title="難易度評価の表示"
                    description="現在の問題文を評価対象として送り、その場で1回分の判定だけを表示します。"
                    actionLabel="AIで難易度を表示"
                    loadingMessage="問題文と基本情報をもとに、難易度の判定理由をまとめています。"
                    idleMessage="まだ評価結果は表示していません。実行すると、この場に難易度と理由が1回分だけ表示されます。"
                    resultTitle="評価理由"
                    resultBody={problem.ai.difficulty.rationale}
                    details={[
                        { label: '自己評価', value: problem.ai.difficulty.current },
                        { label: 'AI評価', value: problem.ai.difficulty.suggested },
                        { label: '信頼度', value: problem.ai.difficulty.confidence },
                    ]}
                    note="評価結果は保存前提ではなく、その場で確認するための表示です。"
                />
            </Card>
        </ProblemEditShell>
    );
}
