<script lang="ts">
    import Header from '$lib/components/admin/Header.svelte';
    import Sidebar from '$lib/components/admin/Sidebar.svelte';
    export let data;
    let sortKey: 'posts' | 'total_views' | 'avg_views' | 'comments' = 'total_views';
    let descending = true;
    $: writers = [...data.writers].sort((a, b) => (Number(a[sortKey]) - Number(b[sortKey])) * (descending ? -1 : 1));
    function sortBy(key: typeof sortKey) {
        if (sortKey === key) descending = !descending;
        else { sortKey = key; descending = true; }
    }
</script>

<svelte:head><title>Writers Leaderboard - TalkAfrika Admin</title></svelte:head>
<div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="leaderboard" />
        <main class="min-w-0 flex-1 p-3 sm:p-6 lg:p-8">
            <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 class="text-2xl font-semibold text-gray-900">Writers Leaderboard</h1><p class="text-sm text-gray-600">Performance across all administrator accounts.</p></div>
                <div class="inline-flex self-start border border-gray-200">
                    <a href="?period=month" class="px-4 py-2 text-sm {data.period === 'month' ? 'bg-accent text-white' : 'bg-white text-gray-700'}">This Month</a>
                    <a href="?period=all" class="px-4 py-2 text-sm {data.period === 'all' ? 'bg-accent text-white' : 'bg-white text-gray-700'}">All Time</a>
                </div>
            </div>
            <!-- Mobile leaderboard cards -->
            <div class="space-y-3 sm:hidden">
                {#each writers as writer, index}
                    <article class="border border-gray-200 bg-white p-4">
                        <div class="flex min-w-0 items-start gap-3">
                            <span class="grid h-9 w-9 flex-none place-items-center bg-accent text-sm font-bold text-white">{index + 1}</span>
                            <div class="min-w-0 flex-1">
                                <a class="block truncate text-sm font-semibold text-gray-900" href="/admin?tab=posts&author={writer.admin_id}">{writer.name}</a>
                                <p class="truncate text-xs text-gray-500">{writer.email}</p>
                            </div>
                        </div>
                        <div class="mt-4 grid grid-cols-2 gap-px border border-gray-200 bg-gray-200">
                            <button on:click={() => sortBy('posts')} class="bg-white p-2.5 text-left"><span class="block text-[10px] uppercase tracking-wide text-gray-500">Posts</span><strong class="text-sm text-gray-900">{Number(writer.posts).toLocaleString()}</strong></button>
                            <button on:click={() => sortBy('total_views')} class="bg-white p-2.5 text-left"><span class="block text-[10px] uppercase tracking-wide text-gray-500">Total views</span><strong class="text-sm text-gray-900">{Number(writer.total_views).toLocaleString()}</strong></button>
                            <button on:click={() => sortBy('avg_views')} class="bg-white p-2.5 text-left"><span class="block text-[10px] uppercase tracking-wide text-gray-500">Average views</span><strong class="text-sm text-gray-900">{Number(writer.avg_views).toLocaleString()}</strong></button>
                            <button on:click={() => sortBy('comments')} class="bg-white p-2.5 text-left"><span class="block text-[10px] uppercase tracking-wide text-gray-500">Comments</span><strong class="text-sm text-gray-900">{Number(writer.comments).toLocaleString()}</strong></button>
                        </div>
                    </article>
                {/each}
            </div>

            <!-- Desktop leaderboard table -->
            <div class="hidden overflow-x-auto border border-gray-200 bg-white sm:block">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-gray-200 bg-gray-50 text-gray-600"><tr>
                        <th class="p-4">Rank</th><th class="p-4">Writer</th>
                        <th class="p-4"><button on:click={() => sortBy('posts')}>Posts</button></th>
                        <th class="p-4"><button on:click={() => sortBy('total_views')}>Total Views</button></th>
                        <th class="p-4"><button on:click={() => sortBy('avg_views')}>Avg Views/Post</button></th>
                        <th class="p-4"><button on:click={() => sortBy('comments')}>Comments</button></th>
                    </tr></thead>
                    <tbody>{#each writers as writer, index}
                        <tr class="border-b border-gray-100 last:border-0">
                            <td class="p-4 font-semibold text-gray-700">{index + 1}</td>
                            <td class="p-4"><a class="font-semibold text-gray-900 hover:text-accent" href="/admin?tab=posts&author={writer.admin_id}">{writer.name}</a><div class="text-xs text-gray-500">{writer.email}</div></td>
                            <td class="p-4">{Number(writer.posts).toLocaleString()}</td><td class="p-4 font-semibold">{Number(writer.total_views).toLocaleString()}</td><td class="p-4">{Number(writer.avg_views).toLocaleString()}</td><td class="p-4">{Number(writer.comments).toLocaleString()}</td>
                        </tr>
                    {/each}</tbody>
                </table>
            </div>
        </main>
    </div>
</div>
