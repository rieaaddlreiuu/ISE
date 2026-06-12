import type { Metadata } from "next";
import Link from "next/link";
import { createTagAction, importTagsCsvAction } from "@/app/tags/actions";
import { PageHeader } from "@/components/layout/pageHeader";
import { Card, CardHeader } from "@/components/ui/card";
import { listTagOptions } from "@/lib/backend/tags";

export const metadata: Metadata = {
    title: "タグ追加 | ISE",
    description: "ISE に検索・分類用タグを追加します。",
};

export const dynamic = "force-dynamic";

function lineFieldClassName() {
    return [
        "mt-3 w-full border-0 border-b border-slate-300 px-0 pb-3 pt-1 text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-slate-900",
        "focus:ring-0",
    ].join(" ");
}

export default async function NewTagPage() {
    const tagOptions = await listTagOptions();

    return (
        <main className="min-h-screen text-slate-900">
            <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    backHref="/problems"
                    backLabel="問題一覧へ戻る"
                    title="タグ追加"
                    description="問題の検索や分類に使うタグを登録します。既存タグと同じ名前は重複作成されません。"
                    meta="Route: /tags/new"
                    actions={
                        <Link
                            href="/problems/new"
                            className="inline-flex items-center justify-center border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                        >
                            問題を追加
                        </Link>
                    }
                />

                <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader
                                title="新しいタグ"
                                subtitle="タグ名は前後の空白と連続スペースを整理して保存します。"
                            />
                            <form action={createTagAction} className="space-y-6 p-5 sm:p-6">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">タグ名</span>
                                    <input
                                        name="name"
                                        maxLength={80}
                                        required
                                        className={lineFieldClassName()}
                                        placeholder="例: 整数、ベクトル、読解"
                                    />
                                </label>

                                <button
                                    type="submit"
                                    className="inline-flex min-h-10 items-center justify-center bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    タグを追加
                                </button>
                            </form>
                        </Card>

                        <Card>
                            <CardHeader
                                title="CSV インポート"
                                subtitle="1行1タグ、または先頭列をタグ名として読み込みます。"
                            />
                            <form action={importTagsCsvAction} className="space-y-6 p-5 sm:p-6">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">CSV ファイル</span>
                                    <input
                                        name="csv"
                                        type="file"
                                        accept=".csv,text/csv"
                                        required
                                        className="mt-3 block w-full text-sm text-slate-700 file:mr-4 file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                                    />
                                </label>

                                <div className="border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-600">
                                    <div>例: 1列目に「タグ名」を並べます。</div>
                                    <code className="mt-2 block whitespace-pre-wrap text-slate-700">
                                        タグ名{"\n"}整数{"\n"}ベクトル{"\n"}読解
                                    </code>
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex min-h-10 items-center justify-center border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
                                >
                                    CSV をインポート
                                </button>
                            </form>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader
                            title="登録済みタグ"
                            subtitle={`${tagOptions.length} 件のタグが登録されています。`}
                        />
                        <div className="p-5 sm:p-6">
                            {tagOptions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tagOptions.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700"
                                        >
                                            <span>{tag.name}</span>
                                            <span className="text-xs text-slate-500">{tag.problemCount}件</span>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
                                    登録済みタグはありません。
                                </div>
                            )}
                        </div>
                    </Card>
                </section>
            </div>
        </main>
    );
}
