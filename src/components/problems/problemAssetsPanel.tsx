'use client';

import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import type { ProblemDetail } from "@/mocks/problemDetails";

type ProblemAssetsPanelProps = {
    problemId: string;
    assets: ProblemDetail["assets"];
};

function buttonClassName(kind: "primary" | "secondary" = "secondary") {
    if (kind === "primary") {
        return "inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800";
    }

    return "inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900";
}

function assetPreviewTone(index: number) {
    const tones = [
        "from-amber-100 via-orange-50 to-white",
        "from-sky-100 via-cyan-50 to-white",
        "from-emerald-100 via-teal-50 to-white",
    ];

    return tones[index % tones.length];
}

export function ProblemAssetsPanel({ problemId, assets }: ProblemAssetsPanelProps) {
    const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id ?? "");
    const selectedAsset = useMemo(
        () => assets.find((asset) => asset.id === selectedAssetId) ?? assets[0],
        [assets, selectedAssetId],
    );
    const selectedIndex = Math.max(
        0,
        assets.findIndex((asset) => asset.id === selectedAsset?.id),
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader
                    title="画像管理"
                    subtitle="アップロード、差し替え、削除、本文挿入用の記法確認をまとめて行うモックです。"
                    right={
                        <button type="button" className={buttonClassName("primary")}>
                            画像をアップロード
                        </button>
                    }
                />
                <div className="grid gap-6 p-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-none border border-dashed border-slate-300 bg-slate-50 p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Upload Queue
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                            PNG / JPG / SVG を想定しています。実装時はここからドラッグ&ドロップまたはファイル選択で追加します。
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className="border border-slate-200 bg-white px-2 py-1">問題ID: {problemId}</span>
                            <span className="border border-slate-200 bg-white px-2 py-1">最大 10 枚</span>
                            <span className="border border-slate-200 bg-white px-2 py-1">単体 5 MB まで</span>
                        </div>
                    </div>

                    <div className="rounded-none border border-slate-200 bg-slate-50 p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            本文挿入補助
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                            選択中の画像を本文へ挿入するための Markdown 記法を確認できます。
                        </p>
                        <div className="mt-4 rounded-none border border-slate-200 bg-white p-3 font-mono text-xs text-slate-700">
                            {selectedAsset ? selectedAsset.markdownSnippet : "画像を選択すると挿入記法を表示します。"}
                        </div>
                        <button type="button" className={`mt-4 ${buttonClassName()}`}>
                            本文に挿入する記法を使う
                        </button>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card>
                    <CardHeader
                        title="画像一覧"
                        subtitle={assets.length > 0 ? `${assets.length} 件の画像が登録されています。` : "まだ画像は登録されていません。"}
                    />
                    <div className="space-y-3 p-4">
                        {assets.length > 0 ? (
                            assets.map((asset, index) => {
                                const isSelected = asset.id === selectedAsset?.id;

                                return (
                                    <button
                                        key={asset.id}
                                        type="button"
                                        onClick={() => setSelectedAssetId(asset.id)}
                                        className={[
                                            "grid w-full gap-4 border p-4 text-left transition sm:grid-cols-[120px_minmax(0,1fr)]",
                                            isSelected
                                                ? "border-slate-900 bg-slate-100"
                                                : "border-slate-200 bg-slate-50 hover:border-slate-400",
                                        ].join(" ")}
                                    >
                                        <div
                                            className={[
                                                "flex aspect-[4/3] items-end justify-start border border-slate-200 bg-gradient-to-br p-3 text-xs font-medium text-slate-700",
                                                assetPreviewTone(index),
                                            ].join(" ")}
                                        >
                                            {asset.kind}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-900">{asset.name}</span>
                                                <span className="border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600">
                                                    {asset.sizeLabel}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {asset.dimensions} / 更新 {asset.updatedAt}
                                            </div>
                                            <div className="text-sm leading-6 text-slate-700">{asset.usageHint}</div>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                画像はまだ登録されていません。
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <CardHeader
                        title="画像プレビュー"
                        subtitle={selectedAsset ? "選択中の画像を大きめに確認できます。" : "画像を選択するとプレビューが表示されます。"}
                    />
                    <div className="space-y-4 p-4">
                        {selectedAsset ? (
                            <>
                                <div
                                    className={[
                                        "flex aspect-[16/10] items-end justify-between border border-slate-200 bg-gradient-to-br p-5",
                                        assetPreviewTone(selectedIndex),
                                    ].join(" ")}
                                >
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Preview
                                        </div>
                                        <div className="mt-3 text-lg font-semibold text-slate-900">{selectedAsset.name}</div>
                                    </div>
                                    <div className="border border-white/80 bg-white/80 px-3 py-2 text-xs text-slate-600">
                                        {selectedAsset.dimensions}
                                    </div>
                                </div>

                                <dl className="grid gap-3 text-sm text-slate-700">
                                    <div className="border border-slate-200 bg-slate-50 p-3">
                                        <dt className="text-xs text-slate-500">用途メモ</dt>
                                        <dd className="mt-1 leading-6">{selectedAsset.usageHint}</dd>
                                    </div>
                                    <div className="border border-slate-200 bg-slate-50 p-3">
                                        <dt className="text-xs text-slate-500">本文用記法</dt>
                                        <dd className="mt-1 font-mono text-xs text-slate-700">{selectedAsset.markdownSnippet}</dd>
                                    </div>
                                </dl>

                                <div className="flex flex-wrap gap-3">
                                    <button type="button" className={buttonClassName()}>
                                        画像を差し替え
                                    </button>
                                    <button type="button" className={buttonClassName()}>
                                        画像を削除
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-sm text-slate-500">
                                プレビュー対象の画像がありません。
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
