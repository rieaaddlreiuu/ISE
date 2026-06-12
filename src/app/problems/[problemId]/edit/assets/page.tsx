import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemAssetsEditScreen } from "@/components/problems/problemAssetsEditScreen";
import {
    getProblemDetailView,
    getProblemRecord,
} from "@/lib/backend/problemViews";

type ProblemAssetsEditPageProps =
    PageProps<"/problems/[problemId]/edit/assets">;

export async function generateMetadata(
    props: ProblemAssetsEditPageProps,
): Promise<Metadata> {
    const { problemId } = await props.params;
    const problem = await getProblemRecord(problemId);

    if (!problem) {
        return { title: "問題が見つかりません | ISE" };
    }

    return {
        title: `${problem.serialCode} 画像編集 | ISE`,
        description: "紐づく画像の確認画面",
    };
}

export default async function ProblemAssetsEditPage(
    props: ProblemAssetsEditPageProps,
) {
    const { problemId } = await props.params;
    const problem = await getProblemDetailView(problemId);

    if (!problem) {
        notFound();
    }

    return <ProblemAssetsEditScreen problemId={problemId} problem={problem} />;
}
