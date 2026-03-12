<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6">
    <div class="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center space-y-4">
      <h1 class="text-2xl font-bold text-foreground">Payment Successful</h1>
      <p class="text-sm text-muted-foreground">Your access is active. Redirecting you to the watch page…</p>
      <p v-if="reference" class="text-xs text-muted-foreground">Reference: {{ reference }}</p>
      <div class="pt-2">
        <Link href="/watch" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Continue to Watch
        </Link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link, router } from '@inertiajs/vue3'
import { onMounted } from 'vue'

const props = defineProps({
  reference: {
    type: String,
    default: '',
  },
})

onMounted(() => {
  setTimeout(() => {
    router.visit('/watch')
  }, 2500)
})
</script>
