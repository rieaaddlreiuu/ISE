import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProblemTextEditScreen } from '@/components/problems/problemTextEditScreen';
import { isProblemDeleted } from '@/lib/problemDeletion';
import { getProblemEditScreenData } from '@/mocks/problemEdit';
import { getProblemDetailMock } from '@/mocks/problemDetails';

type ProblemTextEditPageProps = PageProps<'/problems/[problemId]/edit/text'>;

export async function generateMetadata(props: ProblemTextEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        return {
            title: 'Problem not found | ISE',
        };
    }

    return {
        title: `${problemId} の本文編集 | ISE`,
        description: '問題文・解答・解説の編集画面',
    };
}

export default async function ProblemTextEditPage(props: ProblemTextEditPageProps) {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        notFound();
    }

    const screen = getProblemEditScreenData(problemId);
    const problem = getProblemDetailMock(problemId);

    return <ProblemTextEditScreen problemId={problemId} screen={screen} problem={problem} />;
}
