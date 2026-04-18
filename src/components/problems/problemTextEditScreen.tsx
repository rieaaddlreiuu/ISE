import Link from 'next/link';
import { AiSingleRunPanel } from '@/components/problems/aiSingleRunPanel';
import { DeleteProblemButton } from '@/components/problems/deleteProblemButton';
import { MarkdownTexTextarea } from '@/components/problems/markdownTexTextarea';
import {
    ProblemEditActions,
    ProblemEditSection,
    ProblemEditShell,
    lineTextareaClassName,
} from '@/components/problems/problemEditShell';
import { Card, CardHeader } from '@/components/ui/card';
import type { ProblemEditScreenData } from '@/mocks/problemEdit';
import type { ProblemDetail } from '@/mocks/problemDetails';

type ProblemTextEditScreenProps = {
    problemId: string;
    screen: ProblemEditScreenData;
    problem: ProblemDetail;
};

export function ProblemTextEditScreen({ problemId, screen, problem }: ProblemTextEditScreenProps) {
    const { form } = screen;

    return (
        <ProblemEditShell
            problemId={problemId}
            currentSection="text"
            title={`${form.id} の本文編集`}
            description="問題文、解答、解説をまとめて編集する画面です。AI解説生成はその場で1回分だけ表示する前提にしています。"
            meta={`Route: /problems/${problemId}/edit/text`}
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
                    title="本文フォーム"
                    subtitle="Markdown + TeX で問題文、解答、解説を編集できます。"
                />
                <form className="space-y-8 p-5 sm:p-8">
                    <ProblemEditSection
                        label="Statement"
                        title="問題文"
                        description="受験者に提示する本文を編集します。"
                    >
                        <MarkdownTexTextarea
                            name="statement"
                            label="問題文"
                            rows={8}
                            defaultValue={form.statement}
                            textareaClassName={lineTextareaClassName()}
                            previewMinHeightClassName="min-h-[220px]"
                        />
                    </ProblemEditSection>

                    <ProblemEditSection
                        label="Answer"
                        title="解答と解説"
                        description="解答欄、解説欄、採点メモをまとめて調整します。"
                    >
                        <MarkdownTexTextarea
                            name="answer"
                            label="解答"
                            rows={6}
                            defaultValue={problem.answer}
                            textareaClassName={lineTextareaClassName()}
                        />

                        <MarkdownTexTextarea
                            name="commentary"
                            label="解説"
                            rows={8}
                            defaultValue={problem.commentary}
                            textareaClassName={lineTextareaClassName()}
                            previewMinHeightClassName="min-h-[220px]"
                        />

                        <MarkdownTexTextarea
                            name="gradingMemo"
                            label="採点メモ"
                            rows={6}
                            defaultValue={form.gradingMemo}
                            textareaClassName={lineTextareaClassName()}
                        />
                    </ProblemEditSection>

                    <ProblemEditActions />
                </form>
            </Card>

            <Card className="shadow-none ring-1 ring-slate-200">
                <CardHeader
                    title="AI解説生成"
                    subtitle="問題文、解答、解説下書きをもとに、その場で1回分だけ解説完成版を表示する想定のUIです。"
                />
                <AiSingleRunPanel
                    title="解説完成版の生成"
                    description="履歴や下書き保存はせず、押した時点の入力内容から完成版候補を1回だけ表示します。"
                    actionLabel="AIで解説完成版を表示"
                    loadingMessage="問題文、解答、解説下書きを送信して、解説完成版を組み立てています。"
                    idleMessage="まだ結果は表示していません。実行すると、この場に解説完成版の候補が1回分だけ表示されます。"
                    resultTitle="生成結果"
                    resultBody={problem.ai.commentaryDraft.preview}
                    note="表示結果は一時的なプレビューです。必要な内容だけ本文欄へ反映する想定です。"
                />
            </Card>
        </ProblemEditShell>
    );
}
