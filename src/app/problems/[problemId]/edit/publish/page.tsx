import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemPublishEditScreen } from "@/components/problems/problemPublishEditScreen";
import {
    getProblemEditScreenData,
    getProblemRecord,
} from "@/lib/backend/problemViews";

type ProblemPublishEditPageProps =
    PageProps<"/problems/[problemId]/edit/publish">;

export async function generateMetadata(
    props: ProblemPublishEditPageProps,
): Promise<Metadata> {
    const { problemId } = await props.params;
    const problem = await getProblemRecord(problemId);

    if (!problem) {
        return { title: "問題が見つかりません | ISE" };
    }

    return {
        title: `${problem.serialCode} 公開設定編集 | ISE`,
        description: "出典と公開設定の編集画面",
    };
}

export default async function ProblemPublishEditPage(
    props: ProblemPublishEditPageProps,
) {
    const { problemId } = await props.params;
    const screen = await getProblemEditScreenData(problemId);

    if (!screen) {
        notFound();
    }

    return <ProblemPublishEditScreen problemId={problemId} screen={screen} />;
}
