import type { ReactNode } from 'react';

type CardProperties = { children: ReactNode; className?: string };
type CardHeaderProperties = { title: string; subtitle?: string; right?: ReactNode };
type SummaryCardProperties = { label: string; value: number; sub?: string };

export function Card({ children, className }: CardProperties) {
    return (
        <div className={`rounded-none bg-white shadow-sm ring-1 ring-slate-200 ${className ?? ''}`.trim()}>
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, right }: CardHeaderProperties) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-4">
            <div>
                <div className="text-sm font-semibold text-slate-900">{title}</div>
                {subtitle && <div className="mt-1 text-xs text-slate-600">{subtitle}</div>}
            </div>
            {right}
        </div>
    );
}

export function SummaryCard({ label, value, sub }: SummaryCardProperties) {
    return (
        <div className="rounded-none bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="text-xs font-medium text-slate-600">{label}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
            {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
        </div>
    );
}
