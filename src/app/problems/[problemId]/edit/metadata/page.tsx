import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProblemMetadataEditScreen } from '@/components/problems/problemMetadataEditScreen';
import { isProblemDeleted } from '@/lib/problemDeletion';
import { getProblemEditScreenData } from '@/mocks/problemEdit';
import { getProblemDetailMock } from '@/mocks/problemDetails';

type ProblemMetadataEditPageProps = PageProps<'/problems/[problemId]/edit/metadata'>;

export async function generateMetadata(props: ProblemMetadataEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        return {
            title: 'Problem not found | ISE',
        };
    }

    return {
        title: `${problemId} の問題概要編集 | ISE`,
        description: '問題概要と難易度評価の編集画面',
    };
}

export default async function ProblemMetadataEditPage(props: ProblemMetadataEditPageProps) {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        notFound();
    }

    const screen = getProblemEditScreenData(problemId);
    const problem = getProblemDetailMock(problemId);

    return <ProblemMetadataEditScreen problemId={problemId} screen={screen} problem={problem} />;
}
