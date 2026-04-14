import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemEditScreen } from "@/components/problems/problemEditScreen";
import { isProblemDeleted } from "@/lib/problemDeletion";
import { getProblemEditScreenData } from "@/mocks/problemEdit";

type ProblemEditPageProps = PageProps<"/problems/[problemId]/edit">;

export async function generateMetadata(props: ProblemEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        return {
            title: "Problem not found | ISE",
        };
    }

    return {
        title: `${problemId} の編集 | ISE`,
        description: "問題編集画面のモック UI",
    };
}

export default async function ProblemEditPage(props: ProblemEditPageProps) {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        notFound();
    }

    const screen = getProblemEditScreenData(problemId);

    return <ProblemEditScreen problemId={problemId} screen={screen} />;
}
