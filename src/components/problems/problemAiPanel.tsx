"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import type { ProblemDetail } from "@/mocks/problemDetails";

type ProblemAiPanelProps = {
    ai: ProblemDetail["ai"];
};

type RunStatus = "idle" | "running" | "completed";

function buttonClassName(kind: "primary" | "secondary" = "secondary") {
    if (kind === "primary") {
        return "inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-500";
    }

    return "inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 disabled:opacity-50";
}

function statusLabel(status: RunStatus) {
    if (status === "running") {
        return "AI 実行中";
    }

    if (status === "completed") {
        return "実行済み";
    }

    return "未実行";
}

function DifficultyTab({
    ai,
    difficultyStatus,
    onRun,
}: {
    ai: ProblemDetail["ai"];
    difficultyStatus: RunStatus;
    onRun: () => void;
}) {
    return (
        <Card>
            <CardHeader
                title="難易度 AI 判定"
                subtitle="現在の設定と AI の判定結果を比較して確認できます。"
                right={
                    <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                        {statusLabel(difficultyStatus)}
                    </span>
                }
            />
            <div className="space-y-4 p-4">
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onRun}
                        disabled={difficultyStatus === "running"}
                        className={buttonClassName("primary")}
                    >
                        難易度を AI 判定
                    </button>
                </div>

                {difficultyStatus === "running" ? (
                    <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-600">
                        問題文やタグをもとに、AI が難易度を再判定しています。
                    </div>
                ) : (
                    <>
                        <dl className="grid gap-4 md:grid-cols-3">
                            <div className="border border-slate-200 p-4">
                                <dt className="text-xs text-slate-500">
                                    現在設定
                                </dt>
                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {ai.difficulty.current}
                                </dd>
                            </div>
                            <div className="border border-slate-200 p-4">
                                <dt className="text-xs text-slate-500">
                                    AI 判定
                                </dt>
                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {ai.difficulty.suggested}
                                </dd>
                            </div>
                            <div className="border border-slate-200 p-4">
                                <dt className="text-xs text-slate-500">
                                    確信度
                                </dt>
                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {ai.difficulty.confidence}
                                </dd>
                            </div>
                        </dl>
                        <div className="border border-slate-200 p-4">
                            <div className="text-xs text-slate-500">
                                判断理由
                            </div>
                            <div className="mt-2 text-sm leading-6 text-slate-700">
                                {ai.difficulty.rationale}
                            </div>
                        </div>
                        <div className="text-xs text-slate-500">
                            最終実行: {ai.difficulty.lastRunAt}
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}

function CommentaryTab({
    ai,
    commentaryStatus,
    onRun,
}: {
    ai: ProblemDetail["ai"];
    commentaryStatus: RunStatus;
    onRun: () => void;
}) {
    return (
        <Card>
            <CardHeader
                title="解説 AI 下書き"
                subtitle="解説の生成状況、プレビュー、保存前メモを確認できます。"
                right={
                    <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                        {statusLabel(commentaryStatus)}
                    </span>
                }
            />
            <div className="space-y-4 p-4">
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onRun}
                        disabled={commentaryStatus === "running"}
                        className={buttonClassName("primary")}
                    >
                        解説を AI 生成
                    </button>
                </div>

                {commentaryStatus === "running" ? (
                    <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-600">
                        問題文と模範解答をもとに、解説草案を生成しています。
                    </div>
                ) : (
                    <>
                        <div className="border border-slate-200 p-4">
                            <div className="text-xs text-slate-500">
                                生成状況
                            </div>
                            <div className="mt-2 text-sm font-semibold text-slate-900">
                                {ai.commentaryDraft.statusLabel}
                            </div>
                            <div className="mt-2 text-sm leading-6 text-slate-700">
                                {ai.commentaryDraft.summary}
                            </div>
                        </div>
                        <div className="border border-slate-200 p-4">
                            <div className="text-xs text-slate-500">
                                生成プレビュー
                            </div>
                            <div className="mt-2 text-sm leading-7 text-slate-800">
                                {ai.commentaryDraft.preview}
                            </div>
                        </div>
                        <div className="rounded-none border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
                            {ai.commentaryDraft.saveHint}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                disabled={commentaryStatus !== "completed"}
                                className={buttonClassName("primary")}
                            >
                                下書きを保存
                            </button>
                            <button type="button" className={buttonClassName()}>
                                既存解説と比較
                            </button>
                        </div>
                        <div className="text-xs text-slate-500">
                            最終実行: {ai.commentaryDraft.lastRunAt}
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}

export function ProblemAiPanel({ ai }: ProblemAiPanelProps) {
    const [difficultyStatus, setDifficultyStatus] = useState<RunStatus>("idle");
    const [commentaryStatus, setCommentaryStatus] = useState<RunStatus>(
        ai.commentaryDraft.statusLabel === "未生成" ? "idle" : "completed",
    );

    useEffect(() => {
        let difficultyTimer: ReturnType<typeof setTimeout> | undefined;
        let commentaryTimer: ReturnType<typeof setTimeout> | undefined;

        if (difficultyStatus === "running") {
            difficultyTimer = setTimeout(
                () => setDifficultyStatus("completed"),
                1200,
            );
        }

        if (commentaryStatus === "running") {
            commentaryTimer = setTimeout(
                () => setCommentaryStatus("completed"),
                1400,
            );
        }

        return () => {
            if (difficultyTimer) {
                clearTimeout(difficultyTimer);
            }

            if (commentaryTimer) {
                clearTimeout(commentaryTimer);
            }
        };
    }, [commentaryStatus, difficultyStatus]);

    const tabs = [
        {
            id: "difficulty",
            label: "難易度判定",
            description: "難易度の比較",
            content: (
                <DifficultyTab
                    ai={ai}
                    difficultyStatus={difficultyStatus}
                    onRun={() => setDifficultyStatus("running")}
                />
            ),
        },
        {
            id: "commentary",
            label: "解説生成",
            description: "下書きの確認",
            content: (
                <CommentaryTab
                    ai={ai}
                    commentaryStatus={commentaryStatus}
                    onRun={() => setCommentaryStatus("running")}
                />
            ),
        },
    ];

    return <Tabs tabs={tabs} initialTabId="difficulty" framed={false} />;
}
