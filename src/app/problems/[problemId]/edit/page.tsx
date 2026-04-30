import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProblemEditScreen } from '@/components/problems/problemEditScreen';
import { getProblemEditScreenData, getProblemRecord } from '@/lib/backend/problemViews';

type ProblemEditPageProps = PageProps<'/problems/[problemId]/edit'>;

export async function generateMetadata(props: ProblemEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;
    const problem = await getProblemRecord(problemId);

    if (!problem) {
        return { title: '問題が見つかりません | ISE' };
    }

    return {
        title: `${problem.serialCode} 編集 | ISE`,
        description: 'DB 連携された問題編集画面',
    };
}

export default async function ProblemEditPage(props: ProblemEditPageProps) {
    const { problemId } = await props.params;
    const screen = await getProblemEditScreenData(problemId);

    if (!screen) {
        notFound();
    }

    return <ProblemEditScreen problemId={problemId} screen={screen} />;
}
