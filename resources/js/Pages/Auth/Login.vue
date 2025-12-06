<template>
  <div class="min-h-screen flex bg-background">
    <!-- Left: image gallery / marketing -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-foreground items-center justify-center overflow-hidden relative">
      <div class="absolute inset-0 bg-background/40"></div>
      <div class="max-w-2xl px-8 z-10">
        <h1 class="text-4xl font-bold mb-4 text-foreground">Welcome to Promise Films</h1>
        <p class="mb-6 text-muted-foreground">Stream "A Crazy Day in Accra" and behind-the-scenes content. Sign in with phone OTP or email.</p>
        <div class="rounded-lg overflow-hidden shadow-2xl border border-border">
          <img :src="images[current]" class="w-full h-64 object-cover" alt="slide" />
        </div>
      </div>
      <div class="absolute left-6 bottom-6 z-20 flex space-x-3">
        <button v-for="(i, idx) in images" :key="idx" @click="current = idx" class="w-3 h-3 rounded-full transition-all" :class="current===idx? 'bg-primary':'bg-muted'"></button>
      </div>
    </div>

    <!-- Right: auth form -->
    <div class="flex-1 flex items-center justify-center p-6 bg-background">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold text-foreground">Sign in</h2>
          <p class="text-sm text-muted-foreground mt-2">Use phone OTP or your email and password.</p>
        </div>

        <!-- OTP form -->
        <div class="bg-card border border-border rounded-lg p-6 shadow-lg mb-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Phone number</label>
              <input v-model="phone" type="tel" placeholder="+233 24 000 0000" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div v-if="otpSent">
              <label class="block text-sm font-medium text-foreground mb-2">Enter OTP</label>
              <input v-model="code" type="text" inputmode="numeric" maxlength="6" placeholder="123456" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div class="flex items-center justify-between gap-3">
              <button @click="sendOtp" :disabled="sending || cooldown > 0" class="flex-1 inline-flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors">
                <span v-if="sending">Sending...</span>
                <span v-else-if="cooldown > 0">Resend in {{ cooldown }}s</span>
                <span v-else>{{ otpSent ? 'Resend OTP' : 'Send OTP' }}</span>
              </button>

              <button v-if="otpSent" @click="verifyOtp" :disabled="verifying" class="flex-1 inline-flex items-center justify-center px-4 py-3 border border-border bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors">
                <span v-if="verifying">Verifying...</span>
                <span v-else>Verify</span>
              </button>
            </div>

            <div v-if="error" class="text-destructive text-sm font-medium">{{ error }}</div>
            <div v-if="success" class="text-green-500 text-sm font-medium">{{ success }}</div>
          </div>
        </div>

        <p style="text-align: center; margin: 2px 0; font-size: 12px; color: #666;">Or log in with password if you have one</p>

        <!-- Email/password form -->
        <form @submit.prevent="submitEmail" class="bg-card border border-border rounded-lg p-6 shadow-lg">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Email or Phone</label>
              <input v-model="form.email" type="text" placeholder="email@example.com or +233 24 000 0000" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div v-if="form.errors?.email" class="text-destructive text-sm mt-1">{{ form.errors.email }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Password</label>
              <input v-model="form.password" type="password" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div v-if="form.errors?.password" class="text-destructive text-sm mt-1">{{ form.errors.password }}</div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <a :href="route('password.request')" class="text-sm text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
              <button type="submit" :disabled="form.processing" class="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors">Sign in</button>
            </div>
          </div>
        </form>

        <p class="mt-6 text-center text-sm text-muted-foreground">Don't have an account? <a :href="route('register')" class="text-primary hover:text-primary/80 font-medium transition-colors">Register</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useForm } from '@inertiajs/vue3'

const images = [
  'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1',
  'https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2',
  'https://images.unsplash.com/photo-1508873699372-7ae59b0f2fef?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3',
]

const current = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % images.length
  }, 4000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const phone = ref('')
const code = ref('')
const otpSent = ref(false)
const sending = ref(false)
const verifying = ref(false)
const cooldown = ref(0)
let cooldownTimer = null
const error = ref('')
const success = ref('')

const form = useForm({ email: '', password: '' })

const sendOtp = async () => {
  error.value = ''
  success.value = ''

  if (!phone.value) {
    error.value = 'Please enter a valid phone number.'
    return
  }

  // Basic phone validation
  const cleaned = phone.value.replace(/\D/g, '')
  if (cleaned.length < 9 || cleaned.length > 12) {
    error.value = 'Please enter a valid phone number (e.g., 0244000000 or +233244000000)'
    return
  }

  sending.value = true
  try {
    const response = await fetch('/otp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify({ phone: phone.value })
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: 'Server error. Please try again.' }))
      error.value = data.message || 'Failed to send OTP. Please check your phone number.'
      return
    }

    const data = await response.json()
    if (data.success) {
      otpSent.value = true
      success.value = 'OTP sent successfully. Check your messages.'
      // start resend cooldown (60s) unless server provided retry_after
      const retry = data.retry_after ?? 60
      cooldown.value = Number(retry) > 0 ? Number(retry) : 60
      if (cooldownTimer) clearInterval(cooldownTimer)
      cooldownTimer = setInterval(() => {
        if (cooldown.value > 0) cooldown.value -= 1
        if (cooldown.value <= 0) {
          clearInterval(cooldownTimer)
          cooldownTimer = null
        }
      }, 1000)
    } else {
      error.value = data.message || 'Failed to send OTP.'
    }
  } catch (e) {
    console.error('OTP send error:', e)
    error.value = 'Network error. Please check your connection and try again.'
  } finally {
    sending.value = false
  }
}

const verifyOtp = async () => {
  error.value = ''
  success.value = ''

  if (!code.value || code.value.length < 6) {
    error.value = 'Please enter the complete 6-digit code.'
    return
  }

  verifying.value = true
  try {
    const response = await fetch('/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify({ phone: phone.value, code: code.value })
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: 'Verification error. Please try again.' }))
      error.value = data.message || 'Invalid or expired code.'
      return
    }

    const data = await response.json()
    if (data.success) {
      success.value = 'Verified! Redirecting...'
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } else {
      error.value = data.message || 'Invalid code.'
    }
  } catch (e) {
    console.error('OTP verify error:', e)
    error.value = 'Network error. Please try again.'
  } finally {
    verifying.value = false
  }
}

const submitEmail = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
  })
}
</script>
