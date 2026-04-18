import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProblemPublishEditScreen } from '@/components/problems/problemPublishEditScreen';
import { isProblemDeleted } from '@/lib/problemDeletion';
import { getProblemEditScreenData } from '@/mocks/problemEdit';

type ProblemPublishEditPageProps = PageProps<'/problems/[problemId]/edit/publish'>;

export async function generateMetadata(props: ProblemPublishEditPageProps): Promise<Metadata> {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        return {
            title: 'Problem not found | ISE',
        };
    }

    return {
        title: `${problemId} の公開設定編集 | ISE`,
        description: '出典と公開設定の編集画面',
    };
}

export default async function ProblemPublishEditPage(props: ProblemPublishEditPageProps) {
    const { problemId } = await props.params;
    if (await isProblemDeleted(problemId)) {
        notFound();
    }

    const screen = getProblemEditScreenData(problemId);

    return <ProblemPublishEditScreen problemId={problemId} screen={screen} />;
}
