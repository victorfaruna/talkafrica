<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade, slide } from 'svelte/transition';

    export let data;
    export let form;

    let loading = false;
    let previewUrl = data.employee?.photo_url || '';

    function handleFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewUrl = e.target?.result as string;
            };
            reader.readAsDataURL(target.files[0]);
        }
    }
</script>

<div class="p-6 max-w-4xl mx-auto">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 font-clash-grotesk">Employee of the Month</h1>
            <p class="text-gray-600 mt-1">Manage the featured employee on the homepage.</p>
        </div>
        <a href="/admin" class="text-accent hover:underline flex items-center gap-1 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
        </a>
    </div>

    {#if form?.success}
        <div 
            class="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg flex items-center gap-3"
            transition:slide
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Successfully updated Employee of the Month!
        </div>
    {/if}

    {#if form?.message}
        <div 
            class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3"
            transition:slide
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {form.message}
        </div>
    {/if}

    <form 
        method="POST" 
        action="?/update" 
        use:enhance={() => {
            loading = true;
            return async ({ update }) => {
                loading = false;
                update();
            };
        }}
        enctype="multipart/form-data"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
        <div class="p-6 md:p-8 space-y-6">
            <div class="grid lg:grid-cols-12 gap-8">
                <!-- Left Column: Photo -->
                <div class="lg:col-span-5 space-y-4">
                    <label class="block text-sm font-semibold text-gray-700">Employee Photo</label>
                    <div class="relative group">
                        <div class="aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center transition-colors group-hover:border-accent/50">
                            {#if previewUrl}
                                <img src={previewUrl} alt="Preview" class="w-full h-full object-cover" />
                            {:else}
                                <div class="text-center p-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p class="mt-2 text-sm text-gray-500">Click to upload photo</p>
                                </div>
                            {/if}
                        </div>
                        <input 
                            type="file" 
                            name="photo" 
                            accept="image/*"
                            on:change={handleFileChange}
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <input type="hidden" name="current_photo_url" value={data.employee?.photo_url || ''} />
                    </div>
                    <p class="text-xs text-gray-400 italic text-center">Recommended: Square aspect ratio, high resolution.</p>
                </div>

                <!-- Right Column: Details -->
                <div class="lg:col-span-7 space-y-5">
                    <div class="grid sm:grid-cols-2 gap-4">
                        <div class="sm:col-span-2">
                            <label for="name" class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                required
                                value={data.employee?.name || ''}
                                placeholder="e.g. Sarah Mensah"
                                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div class="sm:col-span-2">
                            <label for="role" class="block text-sm font-semibold text-gray-700 mb-1">Role / Position</label>
                            <input 
                                type="text" 
                                id="role" 
                                name="role" 
                                required
                                value={data.employee?.role || ''}
                                placeholder="e.g. Lead Storyteller"
                                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div class="sm:col-span-1">
                            <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={data.employee?.email || ''}
                                placeholder="e.g. sarah@talkafrica.com"
                                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm"
                            />
                        </div>

                        <div class="sm:col-span-1">
                            <label for="social_links" class="block text-sm font-semibold text-gray-700 mb-1">Social Links</label>
                            <input 
                                type="text" 
                                id="social_links" 
                                name="social_links"
                                value={data.employee?.social_links || ''}
                                placeholder="LinkedIn or Twitter URL"
                                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm"
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label for="impact_quote" class="block text-sm font-semibold text-gray-700 mb-1">Impact Quote</label>
                            <input 
                                type="text" 
                                id="impact_quote" 
                                name="impact_quote"
                                value={data.employee?.impact_quote || ''}
                                placeholder="e.g. Impact starts with a single story."
                                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm italic"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-2">
                <label for="bio" class="block text-sm font-semibold text-gray-700 mb-1">Impact Story (Bio)</label>
                <textarea 
                    id="bio" 
                    name="bio" 
                    required
                    rows="4"
                    value={data.employee?.bio || ''}
                    placeholder="Tell their story... How are they shaping the African narrative?"
                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none text-sm md:text-base leading-relaxed"
                ></textarea>
            </div>

            <div class="pt-2">
                <label for="contribution" class="block text-sm font-semibold text-gray-700 mb-1">Key Contribution (Short Summary)</label>
                <textarea 
                    id="contribution" 
                    name="contribution" 
                    rows="3"
                    value={data.employee?.contribution || ''}
                    placeholder="Summarize their main achievement this month..."
                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none text-sm md:text-base leading-relaxed"
                ></textarea>
                <p class="text-[11px] text-gray-400 mt-2 font-medium">This will appear in the "Key Contribution" card on the homepage.</p>
            </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end items-center gap-3">
            <button 
                type="reset" 
                class="w-full sm:w-auto px-6 py-2.5 text-gray-500 hover:text-gray-800 font-semibold transition-colors text-sm"
                disabled={loading}
            >
                Reset Fields
            </button>
            <button 
                type="submit" 
                disabled={loading}
                class="w-full sm:w-auto px-10 py-3 bg-accent hover:bg-orange-600 text-white font-bold rounded-lg shadow-md hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
            >
                {#if loading}
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                {:else}
                    Save Impact Profile
                {/if}
            </button>
        </div>
    </form>
</div>

<style>
    :global(body) {
        background-color: #f9fafb;
    }
</style>
