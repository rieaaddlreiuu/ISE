import Link from "next/link";
import { DeleteProblemButton } from "@/components/problems/deleteProblemButton";
import { ProblemAssetsPanel } from "@/components/problems/problemAssetsPanel";
import { ProblemEditShell } from "@/components/problems/problemEditShell";
import { Card, CardHeader } from "@/components/ui/card";
import type { ProblemDetail } from "@/mocks/problemDetails";

type ProblemAssetsEditScreenProps = {
    problemId: string;
    problem: ProblemDetail;
};

export function ProblemAssetsEditScreen({
    problemId,
    problem,
}: ProblemAssetsEditScreenProps) {
    return (
        <ProblemEditShell
            problemId={problemId}
            currentSection="assets"
            title={`${problem.id} の画像・添付編集`}
            description="図版や添付ファイルを管理します。本文に貼り付けるための参照情報も確認できます。"
            meta={`Route: /problems/${problemId}/edit/assets`}
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
                    title="画像・添付"
                    subtitle="ライブラリ確認とアップロードをこの画面に分離しました。"
                />
                <div className="p-4">
                    <ProblemAssetsPanel
                        problemId={problemId}
                        assets={problem.assets}
                    />
                </div>
            </Card>
        </ProblemEditShell>
    );
}
