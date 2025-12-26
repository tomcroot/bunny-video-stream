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
    <div v-else class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-4xl">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <!-- Payment Form -->
          <div class="lg:col-span-2 space-y-6 lg:space-y-8">
            <!-- Validation Errors -->
            <div v-if="Object.keys(validationErrors).length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 class="font-semibold text-red-900 mb-2">Please fix the following errors:</h3>
              <ul class="space-y-1">
                <li v-for="(errors, field) in validationErrors" :key="field" class="text-sm text-red-700">
                  <strong>{{ field }}:</strong> {{ Array.isArray(errors) ? errors.join(', ') : errors }}
                </li>
              </ul>
            </div>

            <!-- Movie Details -->
            <div class="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Movie Details</h2>
              <div class="flex flex-col sm:flex-row gap-4">
                <div v-if="movie?.image_url" class="shrink-0 w-24 h-32 mx-auto sm:mx-0">
                  <img :src="movie.image_url" :alt="movie.title" class="w-full h-full object-cover rounded-lg" />
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-foreground mb-2">{{ movie?.title || 'A Crazy Day in Accra' }}</h3>
                  <p class="text-muted-foreground mb-4">{{ movie?.description || 'Unlimited streaming access to this film.' }}</p>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span class="text-muted-foreground">Access:</span><span class="font-medium">Unlimited Streaming</span></div>
                    <div class="flex justify-between"><span class="text-muted-foreground">Availability:</span><span class="font-medium">All Devices</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method Selection -->
            <div class="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
              <div class="space-y-3">
                <label class="flex items-center p-3 sm:p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" :class="{ 'border-primary bg-primary/5': paymentChannel === 'mobile_money' }">
                  <input v-model="paymentChannel" type="radio" value="mobile_money" class="h-4 w-4 text-primary cursor-pointer" />
                  <span class="ml-3 flex-1"><span class="font-medium block">Mobile Money (Recommended)</span><p class="text-sm text-muted-foreground">MTN, Vodafone, AirtelTigo – fast and reliable.</p></span>
                </label>

                <label class="flex items-center p-3 sm:p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" :class="{ 'border-primary bg-primary/5': paymentChannel === 'card' }">
                  <input v-model="paymentChannel" type="radio" value="card" class="h-4 w-4 text-primary cursor-pointer" />
                  <span class="ml-3 flex-1"><span class="font-medium block">Card Payment</span><p class="text-sm text-muted-foreground">Visa & Mastercard via Paystack.</p></span>
                </label>
              </div>
            </div>

            <!-- Promo Code -->
            <div class="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Promo Code</h2>
              <div class="flex flex-col sm:flex-row gap-2">
                <input v-model="couponCode" type="text" placeholder="Enter promo/referral code (optional)" class="flex-1 px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <button @click="validateCoupon" :disabled="validatingCoupon || !couponCode" class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50">{{ validatingCoupon ? 'Checking...' : 'Apply' }}</button>
              </div>
              <p v-if="discount > 0" class="text-sm text-green-600 mt-2">✓ Discount applied: {{ discount }}%</p>
            </div>

            <!-- Billing Email -->
            <div v-if="showEmailPrompt" class="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Billing Email (Optional)</h2>
              <input v-model="billingEmail" type="email" placeholder="your@email.com (optional)" class="w-full px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <p class="text-sm text-muted-foreground mt-2">Leave empty to use your phone number as default email.</p>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-card border border-border rounded-lg p-4 sm:p-6 lg:sticky lg:top-6">
              <h2 class="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
              <div class="space-y-3 pb-4 border-b border-border">
                <div class="flex justify-between text-sm"><span class="text-muted-foreground">Subtotal</span><span class="font-medium">₵{{ (amount / 100).toFixed(2) }}</span></div>
                <div v-if="discount > 0" class="flex justify-between text-sm text-green-600"><span>Discount ({{ discount }}%)</span><span>-₵{{ ((amount * discount) / 100 / 100).toFixed(2) }}</span></div>
              </div>
              <div class="flex justify-between text-lg font-bold pt-4 mb-6"><span>Total</span><span>₵{{ finalAmount.toFixed(2) }}</span></div>
              <button @click="initiatePayment" :disabled="processing" class="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">{{ processing ? 'Processing...' : 'Pay Securely with Paystack' }}</button>
              <p class="text-xs text-muted-foreground text-center mt-4">Secured by Paystack.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Overlay -->
    <div v-if="statusOverlay.visible" class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6">
      <div class="max-w-md w-full bg-card border border-border rounded-2xl p-6 text-center">
        <div class="mb-4 flex justify-center"><div class="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>
        <h2 class="text-lg font-semibold mb-2">{{ statusOverlay.title }}</h2>
        <p class="text-sm text-muted-foreground">{{ statusOverlay.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Link, router } from '@inertiajs/vue3'

const props = defineProps({
  user: Object,
  movie: Object,
  amount: { type: Number, default: 1500 }
})

const loading = ref(true)
const paymentChannel = ref('mobile_money')
const couponCode = ref('')
const discount = ref(0)
const validatingCoupon = ref(false)
const billingEmail = ref('')
const showEmailPrompt = ref(!props.user)
const processing = ref(false)
const validationErrors = ref({})

const finalAmount = computed(() => (props.amount / 100) * (1 - discount.value / 100))

// Track ViewContent event on page load
const trackViewContent = () => {
  if (!window.appAnalytics || !window.appAnalytics.trackMetaViewContent) {
    return
  }

  const movieId = new URLSearchParams(window.location.search).get('movieId') || 'a-crazy-day-in-accra'

  window.appAnalytics.trackMetaViewContent({
    content_name: props.movie?.title || 'A Crazy Day in Accra',
    content_id: movieId,
    value: finalAmount.value,
    currency: 'GHS'
  })
}

const statusOverlay = ref({ visible: false, title: '', message: '' })
const showStatusOverlay = (t, m) => (statusOverlay.value = { visible: true, title: t, message: m })
const hideStatusOverlay = () => (statusOverlay.value.visible = false)

const validateCoupon = async () => {
  validatingCoupon.value = true
  try {
    const res = await fetch('/referral/validate-discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || '' },
      body: JSON.stringify({ code: couponCode.value })
    })
    const data = await res.json()
    discount.value = res.ok && data.success ? data.discount_percentage : 0
  } finally { validatingCoupon.value = false }
}

const initiatePayment = async () => {
  processing.value = true
  validationErrors.value = {}
  showStatusOverlay('Redirecting to Paystack', 'Opening secure checkout...')

  try {
    const movieId = new URLSearchParams(window.location.search).get('movieId')

    // Track Meta Pixel Purchase event
    if (window.appAnalytics && window.appAnalytics.trackMetaPurchase) {
      window.appAnalytics.trackMetaPurchase({
        value: finalAmount.value,
        currency: 'GHS',
        content_name: props.movie?.title || 'A Crazy Day in Accra',
        content_id: movieId || 'a-crazy-day-in-accra',
        content_type: 'product'
      })
    }

    // Track Google Ads Purchase event
    if (window.appAnalytics && window.appAnalytics.trackGoogleAdsPurchase) {
      window.appAnalytics.trackGoogleAdsPurchase({
        value: finalAmount.value,
        currency: 'GHS'
      })
    }

    router.post('/payments/init', {
      amount: props.amount,
      currency: 'GHS',
      movie_id: movieId,
      referral_code: couponCode.value || null,
      email: billingEmail.value || null,
      channel: paymentChannel.value
    }, {
      onError: (errors) => {
        validationErrors.value = errors
        hideStatusOverlay()
        processing.value = false
        console.error('Validation errors:', errors)
      },
      onFinish: () => {
        // Inertia will handle the redirect via Inertia::location()
        // If we're still on this page, there was an error
        if (window.location.href.includes('/payment')) {
          hideStatusOverlay()
          processing.value = false
        }
      }
    })
  } catch (e) {
    hideStatusOverlay()
    console.error('Network error:', e)
    alert('Network error starting payment')
    processing.value = false
  }
}

onMounted(() => {
  setTimeout(() => (loading.value = false), 400)
  // Track ViewContent event on component mount
  setTimeout(() => trackViewContent(), 500)
})
onUnmounted(() => {})
</script>
