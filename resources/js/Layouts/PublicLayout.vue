<script setup>
import PublicHeader from '@/components/PublicHeader.vue'
import PublicFooter from '@/components/PublicFooter.vue'
import ContactBubble from '@/components/ContactBubble.vue'
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <PublicHeader />

    <main class="pt-20">
      <slot />
    </main>

    <PublicFooter />
    <ContactBubble />
  </div>
</template>
