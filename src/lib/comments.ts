import { writable } from 'svelte/store';

export type PublicComment = {
    comment_id: string; user_id: string; content: string; status: string;
    created_at: string; user?: { name: string };
};

export function createCommentResource(postId: string, fetcher: typeof fetch = fetch, now = Date.now) {
    let state = { comments: [] as PublicComment[], loading: false, hasMore: false, error: '' };
    const store = writable(state);
    let pending: Promise<void> | undefined;
    let loadedAt = 0;
    function update(patch: Partial<typeof state>) { state = { ...state, ...patch }; store.set(state); }
    function load(mode: 'initial' | 'refresh' | 'more' = 'initial'): Promise<void> {
        if (pending) return mode === 'refresh' ? pending.then(() => load('refresh')) : pending;
        if (mode === 'initial' && loadedAt && now() - loadedAt < 30_000) return Promise.resolve();
        const offset = mode === 'more' ? state.comments.length : 0;
        update({ loading: true, error: '' });
        pending = (async () => {
            try {
                const response = await fetcher(`/api/posts/${postId}/comments?offset=${offset}`);
                const data = await response.json();
                if (!response.ok || !data.success) throw new Error('Comments unavailable');
                update({ comments: offset ? [...state.comments, ...data.comments] : data.comments, hasMore: !!data.hasMore });
                loadedAt = now();
            } catch { update({ error: 'Unable to load comments. Please try again.' }); }
            finally { update({ loading: false }); pending = undefined; }
        })();
        return pending;
    }
    return { subscribe: store.subscribe, load };
}

// Accessed only by mounted browser components. Mobile and desktop instances
// subscribe to one resource, so both see refreshes after a comment is submitted.
const resources = new Map<string, ReturnType<typeof createCommentResource>>();
export function getCommentResource(postId: string) {
    if (!resources.has(postId)) {
        if (resources.size >= 32) resources.delete(resources.keys().next().value!);
        resources.set(postId, createCommentResource(postId));
    }
    return resources.get(postId)!;
}
