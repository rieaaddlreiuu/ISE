import { saveProblemCommentaryAction } from "@/app/problems/actions";
import { CommentaryEditPreview } from "@/components/problems/commentaryEditPreview";
import { ProblemEditShell } from "@/components/problems/problemEditShell";
import { Card } from "@/components/ui/card";
import type { ProblemEditScreenData } from "@/mocks/problemEdit";

type ProblemCommentaryEditScreenProps = {
    problemId: string;
    screen: ProblemEditScreenData;
};

export function ProblemCommentaryEditScreen({
    problemId,
    screen,
}: ProblemCommentaryEditScreenProps) {
    const saveAction = saveProblemCommentaryAction.bind(null, problemId);

    return (
        <ProblemEditShell
            problemId={problemId}
            currentSection="commentary"
            title={`${screen.form.id} 解説`}
            description="edit / preview"
            meta={`Route: /problems/${problemId}/edit/commentary`}
            wide
        >
            <Card className="shadow-none ring-1 ring-slate-200">
                <CommentaryEditPreview
                    defaultValue={screen.form.answerPolicy}
                    action={saveAction}
                />
            </Card>
        </ProblemEditShell>
    );
}
