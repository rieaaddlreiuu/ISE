'use client';

import { useEffect, useState } from 'react';

type DetailItem = {
    label: string;
    value: string;
};

type AiSingleRunPanelProps = {
    title: string;
    description: string;
    actionLabel: string;
    loadingMessage: string;
    idleMessage: string;
    resultTitle: string;
    resultBody: string;
    details?: DetailItem[];
    note?: string;
};

type RunState = 'idle' | 'running' | 'done';

function buttonClassName() {
    return 'inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-500';
}

function statusLabel(state: RunState) {
    if (state === 'running') return '実行中';
    if (state === 'done') return '表示中';
    return '未実行';
}

export function AiSingleRunPanel({
    title,
    description,
    actionLabel,
    loadingMessage,
    idleMessage,
    resultTitle,
    resultBody,
    details,
    note,
}: AiSingleRunPanelProps) {
    const [state, setState] = useState<RunState>('idle');

    useEffect(() => {
        if (state !== 'running') return;

        const timer = setTimeout(() => {
            setState('done');
        }, 1200);

        return () => clearTimeout(timer);
    }, [state]);

    return (
        <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="text-sm leading-6 text-slate-600">{description}</div>
                </div>
                <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                    {statusLabel(state)}
                </span>
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => setState('running')}
                    disabled={state === 'running'}
                    className={buttonClassName()}
                >
                    {actionLabel}
                </button>
            </div>

            {state === 'idle' ? (
                <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm leading-6 text-slate-600">
                    {idleMessage}
                </div>
            ) : null}

            {state === 'running' ? (
                <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm leading-6 text-slate-600">
                    {loadingMessage}
                </div>
            ) : null}

            {state === 'done' ? (
                <div className="space-y-4">
                    {details?.length ? (
                        <dl className="grid gap-4 md:grid-cols-3">
                            {details.map((detail) => (
                                <div key={detail.label} className="border border-slate-200 bg-slate-50 p-4">
                                    <dt className="text-xs text-slate-500">{detail.label}</dt>
                                    <dd className="mt-2 text-sm font-semibold text-slate-900">
                                        {detail.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    ) : null}

                    <div className="border border-slate-200 bg-white p-4">
                        <div className="text-xs text-slate-500">{resultTitle}</div>
                        <div className="mt-2 text-sm leading-7 text-slate-800">{resultBody}</div>
                    </div>

                    {note ? (
                        <div className="border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                            {note}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
