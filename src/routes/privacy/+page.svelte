<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<!-- SEO is handled by layout -->

<div class="app-container min-h-screen flex flex-col">
    <Header />

    <main class="flex-grow py-16 lg:py-24 bg-gray-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-16">
                <h1 class="font-clash-grotesk text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center">
                    Privacy Policy
                </h1>
                <p class="text-gray-500 text-center mb-12">Last Updated: May 2025</p>

                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">1. Introduction</h2>
                        <p>
                            Welcome to TalkAfrica ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website <a href="/" class="text-accent hover:underline">talkafricang.com</a>.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">2. Information We Collect</h2>
                        <p>We may collect several types of information from and about users of our site, including:</p>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>Personal Identity Data:</strong> Name and email address when you subscribe to our newsletter or donate.</li>
                            <li><strong>Technical Data:</strong> IP address, browser type, time zone setting, and operating system.</li>
                            <li><strong>Usage Data:</strong> Information about how you use our website, products, and services.</li>
                            <li><strong>Financial Data:</strong> For donations, we use third-party processors like Paystack. We do not store your full card details on our servers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Provide and maintain our platform.</li>
                            <li>Send you newsletters and updates (you can opt-out at any time).</li>
                            <li>Process your donations and send confirmations.</li>
                            <li>Improve our website through analytics and user feedback.</li>
                            <li>Comply with legal obligations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">4. Cookies</h2>
                        <p>
                            We use cookies to enhance your experience. Cookies are small files stored on your device that help us understand user behavior and remember your preferences. You can disable cookies in your browser settings, though some features of the site may not function correctly.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">5. Third-Party Services</h2>
                        <p>
                            We may share your data with trusted third-party services to perform functions on our behalf:
                        </p>
                        <ul class="list-disc pl-6 space-y-2">
                            <li><strong>Payment Processors:</strong> Paystack (for donations).</li>
                            <li><strong>Analytics:</strong> Google Analytics (to understand traffic patterns).</li>
                            <li><strong>Social Media:</strong> Plugins for sharing content on LinkedIn, Twitter, and WhatsApp.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">6. Data Security</h2>
                        <p>
                            We implement appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">7. Your Rights</h2>
                        <p>
                            Depending on your location, you may have rights under data protection laws, including the right to access, correct, or delete your personal data. To exercise these rights, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            <strong>Email:</strong> info@talkafricang.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    </main>

    <Footer />
</div>

<style>
    section h2 {
        @apply mb-4 mt-8;
    }
</style>
