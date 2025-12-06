<template>
  <div class="min-h-screen bg-background">

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

      <div class="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p class="text-muted-foreground">
            By accessing and using Promise Land Films ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
          <p class="text-muted-foreground mb-4">
            Permission is granted to temporarily stream one copy of the materials (film content) on Promise Land Films for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or public display</li>
            <li>Remove any copyright or proprietary notations from the materials</li>
            <li>Transfer the materials to another person or mirror the content on any other server</li>
            <li>Record, download, or redistribute the content</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">3. Account Responsibilities</h2>
          <p class="text-muted-foreground mb-4">
            When you create an account with us, you must provide accurate and complete information. You are responsible for:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use of your account</li>
            <li>Ensuring you have the legal capacity to enter into this agreement</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">4. Payment and Subscription</h2>
          <p class="text-muted-foreground mb-4">
            Access to film content requires payment as specified on our platform. By providing payment information, you:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Authorize us to charge your payment method for the subscription fee</li>
            <li>Agree that subscriptions are valid for the specified duration</li>
            <li>Understand that access expires at the end of the subscription period</li>
            <li>Acknowledge that prices are subject to change with notice</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">5. Content Restrictions</h2>
          <p class="text-muted-foreground mb-4">
            You may not use the Service to:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Violate any local, state, national, or international law</li>
            <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>Share account credentials with others</li>
            <li>Attempt to bypass any access restrictions or security measures</li>
            <li>Use automated systems to access the Service</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
          <p class="text-muted-foreground">
            All content on Promise Land Films, including but not limited to films, images, text, graphics, logos, and software, is the property of Promise Land Films or its content suppliers and is protected by international copyright laws. Unauthorized use may result in legal action.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">7. Disclaimer</h2>
          <p class="text-muted-foreground">
            The materials on Promise Land Films are provided on an 'as is' basis. Promise Land Films makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">8. Limitations</h2>
          <p class="text-muted-foreground">
            In no event shall Promise Land Films or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Service.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">9. Termination</h2>
          <p class="text-muted-foreground">
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms. Upon termination, your right to use the Service will cease immediately.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">10. Governing Law</h2>
          <p class="text-muted-foreground">
            These terms shall be governed by and construed in accordance with the laws of Ghana, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">11. Changes to Terms</h2>
          <p class="text-muted-foreground">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
          <p class="text-muted-foreground mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p class="text-muted-foreground">
            Email: info@promiselandfilms.com<br />
            Phone: +233 123 456 789
          </p>
        </section>

        <p class="text-sm text-muted-foreground mt-8">
          Last Updated: {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue'
defineOptions({ layout: PublicLayout })
</script>
