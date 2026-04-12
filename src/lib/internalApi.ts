import 'server-only';

import { headers } from 'next/headers';

export async function resolveInternalApiBaseUrl() {
    const headerList = await headers();
    const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
    const protocol = headerList.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');

    if (host) {
        return `${protocol}://${host}`;
    }

    return process.env.NEXT_PUBLIC_APP_URL?.trim() ?? 'http://127.0.0.1:3000';
}

export async function internalApiFetch(pathname: string, init?: RequestInit) {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (!cronSecret) {
        throw new Error('CRON_SECRET is not configured');
    }

    const baseUrl = await resolveInternalApiBaseUrl();
    const headers = new Headers(init?.headers);
    headers.set('authorization', `Bearer ${cronSecret}`);

    return fetch(`${baseUrl}${pathname}`, {
        ...init,
        headers,
        cache: init?.cache ?? 'no-store',
    });
}

export async function readJsonSafe<T>(response: Response): Promise<T | null> {
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text) as T;
    } catch {
        return null;
    }
}
