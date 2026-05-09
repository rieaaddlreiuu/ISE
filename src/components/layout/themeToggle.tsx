'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const storageKey = 'ise-theme';

function readTheme(): Theme {
    if (typeof document === 'undefined') {
        return 'dark';
    }

    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('dark');
    const isDark = theme === 'dark';

    useEffect(() => {
        setTheme(readTheme());
    }, []);

    function toggleTheme() {
        const nextTheme = isDark ? 'light' : 'dark';
        applyTheme(nextTheme);
        setTheme(nextTheme);
    }

    return (
        <button
            type="button"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDark}
            onClick={toggleTheme}
            className="inline-flex h-8 w-14 items-center rounded-full border border-slate-300 bg-slate-100 p-1 transition hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
            <span
                className={[
                    'theme-toggle-thumb flex size-6 items-center justify-center rounded-full bg-white text-[13px] font-semibold leading-none text-slate-900 shadow-sm transition-transform',
                    isDark ? 'translate-x-6' : 'translate-x-0',
                ].join(' ')}
                aria-hidden="true"
            >
                {isDark ? 'D' : 'L'}
            </span>
        </button>
    );
}
