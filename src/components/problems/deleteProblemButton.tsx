import { deleteProblemAction } from "@/app/problems/actions";

type DeleteProblemButtonProps = {
    problemId: string;
};

export function DeleteProblemButton({ problemId }: DeleteProblemButtonProps) {
    return (
        <form action={deleteProblemAction}>
            <input type="hidden" name="problemId" value={problemId} />
            <button
                type="submit"
                className="inline-flex items-center justify-center border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
            >
                削除
            </button>
        </form>
    );
}
