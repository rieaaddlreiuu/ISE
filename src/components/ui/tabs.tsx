'use client';

import { useState, type ReactNode } from 'react';

export type TabDefinition = {
    id: string;
    label: string;
    description?: string;
    content: ReactNode;
};

type TabsProperties = {
    tabs: TabDefinition[];
    initialTabId?: string;
};

export function Tabs({ tabs, initialTabId }: TabsProperties) {
    const fallbackTabId = tabs[0]?.id ?? '';
    const [activeTabId, setActiveTabId] = useState(initialTabId ?? fallbackTabId);

    if (tabs.length === 0) {
        return null;
    }

    const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

    return (
        <div className="overflow-hidden rounded-none bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-end justify-start gap-1 border-b border-slate-200 px-4 pt-3">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTabId(tab.id)}
                            className={[
                                'rounded-none px-3 py-2 text-left transition-colors',
                                isActive
                                    ? 'border-b-2 border-slate-900 text-slate-900'
                                    : 'border-b-2 border-transparent text-slate-500 hover:text-slate-900',
                            ].join(' ')}
                            aria-pressed={isActive}
                        >
                            <div className="text-sm font-semibold">{tab.label}</div>
                            {tab.description ? (
                                <div
                                    className={[
                                        'mt-1 text-xs',
                                        isActive ? 'text-slate-300' : 'text-slate-500',
                                    ].join(' ')}
                                >
                                    {tab.description}
                                </div>
                            ) : null}
                        </button>
                    );
                })}
            </div>
            <section className="p-4">{activeTab.content}</section>
        </div>
    );
}
