import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemCommentaryEditScreen } from "@/components/problems/problemCommentaryEditScreen";
import {
    getProblemEditScreenData,
    getProblemRecord,
} from "@/lib/backend/problemViews";

type ProblemCommentaryEditPageProps = {
    params: Promise<{
        problemId: string;
    }>;
};

export async function generateMetadata(
    props: ProblemCommentaryEditPageProps,
): Promise<Metadata> {
    const { problemId } = await props.params;
    const problem = await getProblemRecord(problemId);

    if (!problem) {
        return { title: "問題が見つかりません | ISE" };
    }

    return {
        title: `${problem.serialCode} 解説 | ISE`,
        description: "解説編集画面",
    };
}

export default async function ProblemCommentaryEditPage(
    props: ProblemCommentaryEditPageProps,
) {
    const { problemId } = await props.params;
    const screen = await getProblemEditScreenData(problemId);

    if (!screen) {
        notFound();
    }

    return (
        <ProblemCommentaryEditScreen problemId={problemId} screen={screen} />
    );
}
