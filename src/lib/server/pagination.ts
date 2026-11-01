export function boundedInteger(value: string | null, fallback: number, max: number) {
    if (value === null || value.trim() === '') return fallback;
    const number = Number(value);
    return Number.isSafeInteger(number) && number >= 0 ? Math.min(number, max) : fallback;
}

export function pageNumber(url: URL) {
    return Math.max(1, boundedInteger(url.searchParams.get('page'), 1, 1_000_000));
}

export function listRange(url: URL, defaultLimit = 20, maxLimit = 50) {
    return {
        limit: Math.max(1, boundedInteger(url.searchParams.get('limit'), defaultLimit, maxLimit)),
        offset: boundedInteger(url.searchParams.get('offset'), 0, 1_000_000),
    };
}
