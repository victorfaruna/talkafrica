<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";

    let name = "";
    let email = "";
    let subject = "";
    let message = "";
    let isSubmitting = false;

    async function handleSubmit() {
        isSubmitting = true;
        // Logic to handle form submission
        setTimeout(() => {
            alert("Thank you for your message! We will get back to you soon.");
            isSubmitting = false;
            name = "";
            email = "";
            subject = "";
            message = "";
        }, 1500);
    }
</script>

<!-- SEO is handled by layout -->

<div class="app-container min-h-screen flex flex-col">
    <Header />

    <main class="flex-grow py-16 lg:py-24 bg-gray-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <!-- Contact Info -->
                <div class="bg-secondary p-8 lg:p-16 text-white flex flex-col justify-between">
                    <div>
                        <h1 class="font-clash-grotesk text-4xl lg:text-5xl font-bold mb-6">
                            Get in Touch
                        </h1>
                        <p class="text-primary/70 text-lg mb-12">
                            Have a story to tell or want to collaborate? Reach out to us and let's shape the African narrative together.
                        </p>

                        <div class="space-y-8">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg">Email Us</h3>
                                    <p class="text-primary/60">info@talkafricang.com</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg">Location</h3>
                                    <p class="text-primary/60">Lagos, Nigeria</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-12 pt-12 border-t border-white/10">
                        <p class="text-sm text-primary/40">Follow us for updates</p>
                        <!-- Social links could go here -->
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="p-8 lg:p-16">
                    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label for="name" class="text-sm font-semibold text-gray-700">Full Name</label>
                                <input 
                                    id="name"
                                    type="text" 
                                    bind:value={name}
                                    placeholder="John Doe" 
                                    required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                />
                            </div>
                            <div class="space-y-2">
                                <label for="email" class="text-sm font-semibold text-gray-700">Email Address</label>
                                <input 
                                    id="email"
                                    type="email" 
                                    bind:value={email}
                                    placeholder="john@example.com" 
                                    required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="subject" class="text-sm font-semibold text-gray-700">Subject</label>
                            <input 
                                id="subject"
                                type="text" 
                                bind:value={subject}
                                placeholder="How can we help?" 
                                required
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                            />
                        </div>

                        <div class="space-y-2">
                            <label for="message" class="text-sm font-semibold text-gray-700">Your Message</label>
                            <textarea 
                                id="message"
                                bind:value={message}
                                rows="5" 
                                placeholder="Tell us more..." 
                                required
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            class="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/30"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </main>

    <Footer />
</div>
