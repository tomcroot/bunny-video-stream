<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold">Complete Your Purchase</h1>
          <Link href="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back Home
          </Link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading payment details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-4xl">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Payment Form -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Movie Details -->
            <div class="bg-card border border-border rounded-lg p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Movie Details</h2>
              <div class="flex gap-6">
                <div v-if="movie?.image_url" class="shrink-0 w-24 h-32">
                  <img
                    :src="movie.image_url"
                    :alt="movie.title"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-foreground mb-2">{{ movie?.title || 'A Crazy Day in Accra' }}</h3>
                  <p class="text-muted-foreground mb-4">{{ movie?.description || 'Unlimited streaming access to this film.' }}</p>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Duration:</span>
                      <span class="font-medium">Unlimited Access</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Available on:</span>
                      <span class="font-medium">All Devices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method Selection -->
            <div class="bg-card border border-border rounded-lg p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
              <div class="space-y-3">
                <label class="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" :class="{ 'border-primary bg-primary/5': paymentChannel === 'card' }">
                  <input v-model="paymentChannel" type="radio" value="card" class="h-4 w-4 text-primary cursor-pointer" />
                  <span class="ml-3 flex-1">
                    <span class="font-medium">Card Payment</span>
                    <p class="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                  </span>
                </label>

                <label class="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" :class="{ 'border-primary bg-primary/5': paymentChannel === 'mobile_money' }">
                  <input v-model="paymentChannel" type="radio" value="mobile_money" class="h-4 w-4 text-primary cursor-pointer" />
                  <span class="ml-3 flex-1">
                    <span class="font-medium">Mobile Money</span>
                    <p class="text-sm text-muted-foreground">MTN, Vodafone, Tigo</p>
                  </span>
                </label>
              </div>
            </div>

            <!-- Coupon Code (Optional) -->
            <div class="bg-card border border-border rounded-lg p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Promo Code</h2>
              <div class="flex gap-2">
                <input
                  v-model="couponCode"
                  type="text"
                  placeholder="Enter promo code (optional)"
                  class="flex-1 px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  @click="validateCoupon"
                  :disabled="validatingCoupon || !couponCode"
                  class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="validatingCoupon">Checking...</span>
                  <span v-else>Apply</span>
                </button>
              </div>
              <p v-if="discount > 0" class="text-sm text-green-600 mt-2">
                ✓ Discount applied: {{ discount }}%
              </p>
            </div>

            <!-- Payment Email (for guests) -->
            <div v-if="!user && showEmailPrompt" class="bg-card border border-border rounded-lg p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Billing Email</h2>
              <input
                v-model="billingEmail"
                type="email"
                placeholder="your@email.com"
                class="w-full px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <p class="text-sm text-muted-foreground mt-2">We'll send your receipt and access details here.</p>
            </div>
          </div>

          <!-- Order Summary (Sidebar) -->
          <div class="lg:col-span-1">
            <div class="bg-card border border-border rounded-lg p-6 sticky top-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

              <div class="space-y-3 pb-4 border-b border-border">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Subtotal</span>
                  <span class="font-medium">₵{{ (amount / 100).toFixed(2) }}</span>
                </div>
                <div v-if="discount > 0" class="flex justify-between text-sm text-green-600">
                  <span>Discount ({{ discount }}%)</span>
                  <span>-₵{{ ((amount * discount) / 100 / 100).toFixed(2) }}</span>
                </div>
              </div>

              <div class="flex justify-between text-lg font-bold pt-4 mb-6">
                <span>Total</span>
                <span>₵{{ finalAmount.toFixed(2) }}</span>
              </div>

              <button
                @click="initiatePayment"
                :disabled="processing || (showEmailPrompt && !billingEmail)"
                class="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="processing">Processing...</span>
                <span v-else>
                  Proceed to Payment
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>

              <p class="text-xs text-muted-foreground text-center mt-4">
                Secured by Paystack. Your payment information is encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()

const props = defineProps({
  user: Object,
  movie: Object,
  amount: {
    type: Number,
    default: 1500 // pesewas (₵15)
  }
})

const loading = ref(true)
const paymentChannel = ref('card')
const couponCode = ref('')
const discount = ref(0)
const validatingCoupon = ref(false)
const billingEmail = ref('')
const showEmailPrompt = ref(!props.user)
const processing = ref(false)

const finalAmount = computed(() => {
  return (props.amount / 100) * (1 - discount.value / 100)
})

const validateCoupon = async () => {
  if (!couponCode.value) return

  validatingCoupon.value = true
  try {
    const response = await fetch('/referral/validate-discount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || ''
      },
      body: JSON.stringify({ code: couponCode.value })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      discount.value = data.discount_percentage
    } else {
      alert(data.message || 'Invalid or inactive referral code')
      discount.value = 0
    }
  } catch (error) {
    console.error('Coupon validation failed:', error)
    alert('Failed to validate referral code. Please try again.')
    discount.value = 0
  } finally {
    validatingCoupon.value = false
  }
}

const initiatePayment = async () => {
  if (!billingEmail.value && showEmailPrompt.value) {
    alert('Please enter your email address')
    return
  }

  processing.value = true

  try {
    const movieId = new URLSearchParams(window.location.search).get('movieId')

    const response = await fetch('/payments/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
      },
      body: JSON.stringify({
        amount: props.amount, // Already in pesewas (minor units)
        currency: 'GHS',
        movie_id: movieId,
        referral_code: couponCode.value || null // Include referral code if provided
      })
    })

    const data = await response.json()

    if (data.authorization_url) {
      // Redirect to Paystack payment page
      window.location.href = data.authorization_url
    } else {
      alert('Failed to initialize payment. Please try again.')
      processing.value = false
    }
  } catch (error) {
    console.error('Payment initialization failed:', error)
    alert('An error occurred. Please try again.')
    processing.value = false
  }
}

onMounted(() => {
  // Simulate loading movie details
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>
