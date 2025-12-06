<template>
  <button
    :disabled="loading"
    @click="startPurchase"
    class="bg-primary text-primary-foreground text-lg h-14 px-8 gap-2 cursor-pointer rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
    <span v-if="loading">Redirecting...</span>
    <span v-else>Watch Now - ₵{{ displayAmount }}</span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

const props = defineProps({
  amount: { type: Number, required: true }, // minor units
  currency: { type: String, default: 'GHS' },
  movieId: { type: [String, Number], default: null },
})

// Use authenticated user's email for Paystack; Paystack rejects blank/invalid emails
const page = usePage()
const userEmail = computed(() => page.props.auth?.user?.email || null)

const loading = ref(false)
const displayAmount = (props.amount / 100).toFixed(2)

async function startPurchase() {
  if (loading.value) return
  loading.value = true
  try {
    const response = await fetch('/payments/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        amount: props.amount,
        currency: props.currency,
        movie_id: props.movieId,
        email: userEmail.value || 'guest@acrazydayinaccra.com', // send safe fallback to avoid empty/invalid emails
      }),
      credentials: 'same-origin'
    })

    // Handle authentication redirect
    if (response.status === 401) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }

    const data = await response.json()

    if (!response.ok) {
      // Log validation errors for debugging
      if (response.status === 422 && data.errors) {
        console.error('Validation errors:', data.errors)
      }
      throw new Error(data.message || 'Failed to initialize payment')
    }

    if (data.authorization_url) {
      window.location.href = data.authorization_url
    } else {
      throw new Error('Missing authorization URL')
    }
  } catch (e) {
    console.error('Payment initialization error:', e)
    alert(e.message || 'Unable to start purchase')
    loading.value = false
  }
}
</script>
