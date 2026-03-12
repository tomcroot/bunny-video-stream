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
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

const props = defineProps({
  amount: { type: Number, required: true }, // minor units
  currency: { type: String, default: 'GHS' },
  movieId: { type: [String, Number], default: null },
})

const loading = ref(false)
const displayAmount = (props.amount / 100).toFixed(2)

async function startPurchase() {
  if (loading.value) return
  loading.value = true
  const query = new URLSearchParams()
  if (props.movieId !== null && props.movieId !== undefined && props.movieId !== '') {
    query.set('movieId', String(props.movieId))
  }

  router.visit(`/payment/checkout${query.toString() ? `?${query.toString()}` : ''}`)
}
</script>
