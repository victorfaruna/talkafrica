<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import SEO from "$lib/components/SEO.svelte";
</script>

<SEO 
    title="Terms of Service | TalkAfrica" 
    description="Read the Terms of Service for TalkAfrica. By using our website, you agree to these terms and conditions."
/>

<div class="app-container min-h-screen flex flex-col">
    <Header />

    <main class="flex-grow py-16 lg:py-24 bg-gray-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-16">
                <h1 class="font-clash-grotesk text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center">
                    Terms of Service
                </h1>
                <p class="text-gray-500 text-center mb-12">Last Updated: May 2025</p>

                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using TalkAfrica (<a href="/" class="text-accent hover:underline">talkafricang.com</a>), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">2. Intellectual Property Rights</h2>
                        <p>
                            The content on TalkAfrica, including text, graphics, logos, images, and videos, is the property of TalkAfrica or its content suppliers and is protected by international copyright and intellectual property laws. 
                        </p>
                        <p>
                            You may not reproduce, distribute, or create derivative works from our content without explicit written permission from TalkAfrica.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">3. User Conduct</h2>
                        <p>When using our platform, you agree not to:</p>
                        <ul class="list-disc pl-6 space-y-2">
                            <li>Use the site for any unlawful purpose.</li>
                            <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
                            <li>Post or transmit any content that is defamatory, obscene, or infringing on intellectual property.</li>
                            <li>Engage in any activity that interferes with or disrupts the site's functionality.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">4. Donations</h2>
                        <p>
                            Donations made to TalkAfrica are voluntary and non-refundable. We use Paystack to process payments securely. By making a donation, you represent that you have the legal right to use the payment method provided.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">5. Disclaimer of Warranties</h2>
                        <p>
                            TalkAfrica is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the site or its content.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">6. Limitation of Liability</h2>
                        <p>
                            In no event shall TalkAfrica or its team be liable for any damages arising out of the use or inability to use the materials on our website, even if we have been notified of the possibility of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">7. External Links</h2>
                        <p>
                            TalkAfrica may contain links to external websites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">8. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms of Service at any time without prior notice. By continuing to use the site after changes are posted, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">9. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
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
