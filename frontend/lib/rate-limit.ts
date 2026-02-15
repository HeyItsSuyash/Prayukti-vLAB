
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const cache = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000) {
    const now = Date.now();
    const entry = cache.get(ip);

    if (!entry || now > entry.resetTime) {
        // New window
        cache.set(ip, {
            count: 1,
            resetTime: now + windowMs
        });
        return { success: true, count: 1, resetTime: now + windowMs };
    }

    if (entry.count >= limit) {
        return { success: false, count: entry.count, resetTime: entry.resetTime };
    }

    entry.count += 1;
    return { success: true, count: entry.count, resetTime: entry.resetTime };
}

// Cleanup expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [ip, entry] of cache.entries()) {
            if (now > entry.resetTime) {
                cache.delete(ip);
            }
        }
    }, 300000);
}
