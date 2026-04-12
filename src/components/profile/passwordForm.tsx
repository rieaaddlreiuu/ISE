'use client';

import { FormEvent, useState } from 'react';

type PasswordFormProperties = {
    userId: string;
    hasPassword: boolean;
};

export function PasswordForm({ userId, hasPassword }: PasswordFormProperties) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitting) return;

        if (newPassword !== confirmPassword) {
            setError('new password and confirmation do not match');
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(`/api/users/${encodeURIComponent(userId)}/profile/password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: currentPassword || undefined,
                    newPassword,
                }),
            });
            const body = (await response.json().catch(() => ({}))) as {
                message?: string;
            };
            if (!response.ok) {
                setError(body.message ?? 'failed to update password');
                return;
            }

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSuccess('password updated');
        } catch {
            setError('failed to update password');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="rounded border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Password</h2>
            <p className="mt-2 text-sm text-slate-600">
                {hasPassword ? 'Change your current password.' : 'Set your password for the first time.'}
            </p>

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                {hasPassword && (
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Current password</span>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            autoComplete="current-password"
                            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
                            required
                            minLength={8}
                            maxLength={128}
                        />
                    </label>
                )}

                <label className="block">
                    <span className="text-sm font-medium text-slate-700">New password</span>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        autoComplete="new-password"
                        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
                        required
                        minLength={8}
                        maxLength={128}
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-slate-700">Confirm new password</span>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
                        required
                        minLength={8}
                        maxLength={128}
                    />
                </label>

                {error && (
                    <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                )}
                {success && (
                    <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {submitting ? 'Saving...' : 'Save password'}
                </button>
            </form>
        </section>
    );
}
