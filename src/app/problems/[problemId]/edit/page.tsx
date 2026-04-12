import type { Metadata } from "next";
import { ProblemEditScreen } from "@/components/problems/problemEditScreen";
import { getProblemEditScreenData } from "@/mocks/problemEdit";

type ProblemEditPageProps = PageProps<"/problems/[problemId]/edit">;

export async function generateMetadata(props: ProblemEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;

    return {
        title: `${problemId} の編集 | ISE`,
        description: "問題編集画面のモック UI",
    };
}

export default async function ProblemEditPage(props: ProblemEditPageProps) {
    const { problemId } = await props.params;
    const screen = getProblemEditScreenData(problemId);

    return <ProblemEditScreen problemId={problemId} screen={screen} />;
}
