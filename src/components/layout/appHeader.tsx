import Link from 'next/link';
import { ThemeToggle } from './themeToggle';

export async function AppHeader() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
                <Link href="/" className="text-base font-semibold text-slate-900">
                    ISE
                </Link>

                <nav aria-label="Global" className="flex items-center gap-2">
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
