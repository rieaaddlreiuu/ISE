import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProblemTextEditScreen } from '@/components/problems/problemTextEditScreen';
import {
    getProblemDetailView,
    getProblemEditScreenData,
    getProblemRecord,
} from '@/lib/backend/problemViews';

type ProblemTextEditPageProps = PageProps<'/problems/[problemId]/edit/text'>;

export async function generateMetadata(props: ProblemTextEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;
    const problem = await getProblemRecord(problemId);

    if (!problem) {
        return { title: '問題が見つかりません | ISE' };
    }

    return {
        title: `${problem.serialCode} 本文編集 | ISE`,
        description: '問題文・解答・解説の編集画面',
    };
}

export default async function ProblemTextEditPage(props: ProblemTextEditPageProps) {
    const { problemId } = await props.params;
    const [screen, problem] = await Promise.all([
        getProblemEditScreenData(problemId),
        getProblemDetailView(problemId),
    ]);

    if (!screen || !problem) {
        notFound();
    }

    return <ProblemTextEditScreen problemId={problemId} screen={screen} problem={problem} />;
}
