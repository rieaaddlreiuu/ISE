import type { ReactNode } from "react";
import Link from "next/link";

type PageHeaderProps = {
    title: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    backHref?: string;
    backLabel?: ReactNode;
    actions?: ReactNode;
    className?: string;
    titleClassName?: string;
};

export function PageHeader({
    title,
    description,
    meta,
    backHref,
    backLabel,
    actions,
    className,
    titleClassName,
}: PageHeaderProps) {
    const wrapperClassName =
        className ??
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between";
    const headingClassName = titleClassName ?? "text-2xl text-slate-900";

    return (
        <div className={wrapperClassName}>
            <header>
                {backHref && backLabel && (
                    <Link
                        href={backHref}
                        className="text-sm text-slate-600 underline hover:text-slate-900"
                    >
                        {backLabel}
                    </Link>
                )}
                <h1
                    className={
                        backHref && backLabel
                            ? `mt-3 ${headingClassName}`
                            : headingClassName
                    }
                >
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 text-sm text-slate-600">{description}</p>
                )}
                {meta && <p className="mt-2 text-xs text-slate-500">{meta}</p>}
            </header>
            {actions ? <div className="flex gap-2">{actions}</div> : null}
        </div>
    );
}
