type RateLimitBucket = {
    count: number;
    resetAtMs: number;
};

type RateLimitState = {
    buckets: Map<string, RateLimitBucket>;
};

const rateLimitStateKey = '__simpleRateLimitState__';

function getRateLimitState() {
    const target = globalThis as typeof globalThis & {
        [rateLimitStateKey]?: RateLimitState;
    };
    if (!target[rateLimitStateKey]) {
        target[rateLimitStateKey] = { buckets: new Map<string, RateLimitBucket>() };
    }
    return target[rateLimitStateKey];
}

function pruneBuckets(state: RateLimitState, nowMs: number) {
    for (const [key, bucket] of state.buckets) {
        if (bucket.resetAtMs <= nowMs) {
            state.buckets.delete(key);
        }
    }
}

export function consumeRateLimit(input: { key: string; limit: number; windowMs: number }) {
    const nowMs = Date.now();
    const state = getRateLimitState();
    pruneBuckets(state, nowMs);

    const existing = state.buckets.get(input.key);
    if (!existing || existing.resetAtMs <= nowMs) {
        const resetAtMs = nowMs + input.windowMs;
        state.buckets.set(input.key, { count: 1, resetAtMs });
        return { ok: true as const, remaining: input.limit - 1, retryAfterSeconds: 0 };
    }

    existing.count += 1;
    const remaining = Math.max(0, input.limit - existing.count);
    if (existing.count > input.limit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAtMs - nowMs) / 1000));
        return { ok: false as const, remaining: 0, retryAfterSeconds };
    }

    return { ok: true as const, remaining, retryAfterSeconds: 0 };
}
