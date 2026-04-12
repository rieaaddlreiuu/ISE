import Link from 'next/link';
import { cookies } from 'next/headers';
import { authSessionCookieName, parseSessionToken } from '@/lib/auth/session';
import { isSelfSignupAllowed } from '@/lib/auth/selfSignup';

export async function AppHeader() {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(authSessionCookieName)?.value;
    const session = await parseSessionToken(rawToken);
    const selfSignupAllowed = isSelfSignupAllowed();

    return (
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-base font-semibold text-slate-900">
                    DO-DEATH
                </Link>

                <nav aria-label="Global" className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                        Home
                    </Link>
                    <Link
                        href="/docs"
                        className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                        Docs
                    </Link>
                    {session ? (
                        <>
                            <Link
                                href={`/${encodeURIComponent(session.userId)}`}
                                className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            >
                                {session.userId}
                            </Link>
                            <Link
                                href={`/${encodeURIComponent(session.userId)}/notifications`}
                                className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            >
                                Notifications
                            </Link>
                            <Link
                                href={`/${encodeURIComponent(session.userId)}/billing`}
                                className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            >
                                決済設定
                            </Link>
                            <form action="/api/auth/logout?returnTo=/login" method="post">
                                <button
                                    type="submit"
                                    className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                >
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {selfSignupAllowed ? (
                                <Link
                                    href="/register"
                                    className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                >
                                    Register
                                </Link>
                            ) : null}
                            <Link
                                href="/login"
                                className="rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
