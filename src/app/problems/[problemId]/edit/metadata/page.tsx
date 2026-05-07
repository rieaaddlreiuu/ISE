import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProblemMetadataEditScreen } from '@/components/problems/problemMetadataEditScreen';
import {
    getProblemDetailView,
    getProblemEditScreenData,
    getProblemRecord,
} from '@/lib/backend/problemViews';
import { listTagOptions } from '@/lib/backend/tags';

type ProblemMetadataEditPageProps = PageProps<'/problems/[problemId]/edit/metadata'>;

export async function generateMetadata(props: ProblemMetadataEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;
    const problem = await getProblemRecord(problemId);

    if (!problem) {
        return { title: '問題が見つかりません | ISE' };
    }

    return {
        title: `${problem.serialCode} メタ情報編集 | ISE`,
        description: '問題メタ情報の編集画面',
    };
}

export default async function ProblemMetadataEditPage(props: ProblemMetadataEditPageProps) {
    const { problemId } = await props.params;
    const [screen, problem, tagOptions] = await Promise.all([
        getProblemEditScreenData(problemId),
        getProblemDetailView(problemId),
        listTagOptions(),
    ]);

    if (!screen || !problem) {
        notFound();
    }

    return (
        <ProblemMetadataEditScreen
            problemId={problemId}
            screen={screen}
            problem={problem}
            tagOptions={tagOptions}
        />
    );
}
