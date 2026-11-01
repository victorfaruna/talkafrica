// Only call this for published, visitor-independent data. Never put sessions,
// editor responses, admin queries or credentials in this process-local cache.
export class PublicDataCache {
    private entries = new Map<string, { value: unknown; expires: number; bytes: number }>();
    private pending = new Map<string, Promise<unknown>>();
    private bytes = 0;

    constructor(
        private now = Date.now,
        private maxEntries = 128,
        private maxBytes = 16 * 1024 * 1024,
    ) {}

    async get<T>(key: string, loader: () => T | PromiseLike<T>, ttl = 60): Promise<T> {
        const entry = this.entries.get(key);
        if (entry && entry.expires > this.now()) return entry.value as T;
        if (entry) { this.bytes -= entry.bytes; this.entries.delete(key); }
        const pending = this.pending.get(key);
        if (pending) return pending as Promise<T>;

        const promise = Promise.resolve().then(loader).then((value) => {
            // A publish/edit may have invalidated this read while it was running.
            if (this.pending.get(key) !== promise) return value;
            const bytes = Buffer.byteLength(JSON.stringify(value) ?? 'null');
            if (bytes <= Math.min(this.maxBytes, 512 * 1024)) {
                while (this.entries.size >= this.maxEntries || this.bytes + bytes > this.maxBytes) {
                    const oldest = this.entries.keys().next().value;
                    if (oldest === undefined) break;
                    this.bytes -= this.entries.get(oldest)!.bytes;
                    this.entries.delete(oldest);
                }
                this.entries.set(key, { value, expires: this.now() + ttl * 1000, bytes });
                this.bytes += bytes;
            }
            return value;
        }).finally(() => {
            if (this.pending.get(key) === promise) this.pending.delete(key);
        });
        // Bound simultaneous cache keys as well as completed entries.
        if (this.pending.size < this.maxEntries) this.pending.set(key, promise);
        return promise;
    }

    invalidate() {
        this.entries.clear();
        this.pending.clear();
        this.bytes = 0;
    }
}

export const publicDataCache = new PublicDataCache();

export function isAuthenticatedRequest(request?: Request) {
    return !!request && (
        request.headers.has('authorization') ||
        /(?:^|;\s*)(?:admin|sb-[^=;]+)=/.test(request.headers.get('cookie') ?? '')
    );
}

export function cachedPublicData<T>(key: string, loader: () => T | PromiseLike<T>, request?: Request, ttl = 60) {
    return isAuthenticatedRequest(request) ? Promise.resolve(loader()) : publicDataCache.get(key, loader, ttl);
}

// Includes unpublishing, soft deletion, category changes and form actions.
export function changesPublicContent(path: string, method: string) {
    return !['GET', 'HEAD', 'OPTIONS'].includes(method) && (
        /^\/api\/(?:posts|categories)$/.test(path) ||
        /^\/api\/(?:videos|movie-reviews|our-impact)(?:\/[^/]+)?$/.test(path) ||
        path === '/admin/employee-of-the-month'
    );
}
