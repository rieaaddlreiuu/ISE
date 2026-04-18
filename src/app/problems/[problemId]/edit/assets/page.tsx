import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProblemAssetsEditScreen } from '@/components/problems/problemAssetsEditScreen';
import { isProblemDeleted } from '@/lib/problemDeletion';
import { getProblemDetailMock } from '@/mocks/problemDetails';

type ProblemAssetsEditPageProps = PageProps<'/problems/[problemId]/edit/assets'>;

export async function generateMetadata(props: ProblemAssetsEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        return {
            title: 'Problem not found | ISE',
        };
    }

    return {
        title: `${problemId} の画像・添付編集 | ISE`,
        description: '画像・添付ファイルの編集画面',
    };
}

export default async function ProblemAssetsEditPage(props: ProblemAssetsEditPageProps) {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        notFound();
    }

    const problem = getProblemDetailMock(problemId);

    return <ProblemAssetsEditScreen problemId={problemId} problem={problem} />;
}
