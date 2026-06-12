import Link from "next/link";
import { ThemeToggle } from "./themeToggle";

const primaryLinks = [
    { href: "/", label: "Home" },
    { href: "/problems", label: "Problems" },
    { href: "/stats", label: "Stats" },
    { href: "/problems/new", label: "New" },
    { href: "/tags/new", label: "Tags" },
];

const filterLinks = [
    { href: "/problems?status=draft", label: "Drafts" },
    { href: "/problems?status=review", label: "Review" },
    { href: "/problems?status=published", label: "Published" },
];

const navLinkClassName =
    "inline-flex h-9 shrink-0 items-center justify-center border border-transparent px-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950";

export function AppHeader() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
                <Link
                    href="/"
                    className="shrink-0 text-base font-semibold text-slate-900"
                >
                    ISE
                </Link>

                <nav
                    aria-label="Global"
                    className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto"
                >
                    <div className="flex items-center gap-1">
                        {primaryLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={navLinkClassName}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div
                        className="hidden h-5 w-px shrink-0 bg-slate-200 sm:block"
                        aria-hidden="true"
                    />
                    <div className="hidden items-center gap-1 sm:flex">
                        {filterLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={navLinkClassName}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="shrink-0">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
