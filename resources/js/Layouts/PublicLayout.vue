<script setup>
import PublicHeader from '@/Components/PublicHeader.vue'
import PublicFooter from '@/Components/PublicFooter.vue'
import ContactBubble from '@/Components/ContactBubble.vue'
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
