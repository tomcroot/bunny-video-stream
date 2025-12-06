<template>
  <div class="min-h-screen flex bg-background">
    <!-- Left: image gallery / marketing -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-foreground items-center justify-center overflow-hidden relative">
      <div class="absolute inset-0 bg-background/40"></div>
      <div class="max-w-2xl px-8 z-10">
        <h1 class="text-4xl font-bold mb-4 text-foreground">Join Promise Films</h1>
        <p class="mb-6 text-muted-foreground">Create your account to stream "A Crazy Day in Accra" and exclusive behind-the-scenes content.</p>
        <div class="rounded-lg overflow-hidden shadow-2xl border border-border">
          <img :src="images[current]" class="w-full h-64 object-cover" alt="slide" />
        </div>
      </div>
      <div class="absolute left-6 bottom-6 z-20 flex space-x-3">
        <button v-for="(i, idx) in images" :key="idx" @click="current = idx" class="w-3 h-3 rounded-full transition-all" :class="current===idx? 'bg-primary':'bg-muted'"></button>
      </div>
    </div>

    <!-- Right: registration form -->
    <div class="flex-1 flex items-center justify-center p-6 bg-background">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold text-foreground">Create your account</h2>
          <p class="text-sm text-muted-foreground mt-2">Simple & direct registration</p>
        </div>

        <!-- Step 1: Basic Info -->
        <div v-if="!otpSent" class="bg-card border border-border rounded-lg p-6 shadow-lg">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                id="name"
                type="text"
                v-model="form.name"
                placeholder="Your name"
                class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div v-if="form.errors.name" class="text-destructive text-sm mt-1">{{ form.errors.name }}</div>
            </div>

            <div>
              <label for="phone_number" class="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <input
                id="phone_number"
                type="tel"
                v-model="form.phone_number"
                placeholder="+233 24 000 0000"
                class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div v-if="form.errors.phone_number" class="text-destructive text-sm mt-1">{{ form.errors.phone_number }}</div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-foreground mb-2">Email (optional)</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                placeholder="your@email.com"
                class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div v-if="form.errors.email" class="text-destructive text-sm mt-1">{{ form.errors.email }}</div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                id="password"
                type="password"
                v-model="form.password"
                placeholder="min. 8 characters"
                class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div v-if="form.errors.password" class="text-destructive text-sm mt-1">{{ form.errors.password }}</div>
            </div>

            <button
              @click="sendOtp"
              :disabled="form.processing || sending"
              class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
            >
              <span v-if="sending">Sending OTP...</span>
              <span v-else-if="form.processing">Processing...</span>
              <span v-else>Send Verification Code</span>
            </button>

            <div v-if="error" class="text-destructive text-sm font-medium">{{ error }}</div>
          </div>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-else class="bg-card border border-border rounded-lg p-6 shadow-lg">
          <div class="mb-4 text-center">
            <p class="text-sm text-muted-foreground">Enter the 6-digit code sent to <strong>{{ form.phone_number }}</strong></p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Verification Code</label>
              <input
                v-model="code"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="123456"
                class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center text-2xl tracking-widest"
              />
            </div>

            <div class="flex gap-3">
              <button
                @click="verifyOtp"
                :disabled="verifying || code.length < 6"
                class="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
              >
                <span v-if="verifying">Verifying...</span>
                <span v-else>Verify & Register</span>
              </button>

              <button
                @click="resetOtp"
                :disabled="sending"
                class="flex-1 px-4 py-3 border border-border bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium transition-colors"
              >
                Back
              </button>
            </div>

            <div class="flex items-center justify-between gap-3">
              <button
                @click="sendOtp"
                :disabled="sending || cooldown > 0"
                class="text-sm text-primary hover:text-primary/80 disabled:opacity-50 font-medium transition-colors"
              >
                <span v-if="sending">Sending...</span>
                <span v-else-if="cooldown > 0">Resend in {{ cooldown }}s</span>
                <span v-else>Resend Code</span>
              </button>
            </div>

            <div v-if="error" class="text-destructive text-sm font-medium">{{ error }}</div>
            <div v-if="success" class="text-green-500 text-sm font-medium">{{ success }}</div>
          </div>
        </div>

        <p class="mt-6 text-center text-sm text-muted-foreground">Already have an account? <a :href="route('login')" class="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</a></p>
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

const form = useForm({
  name: '',
  email: '',
  phone_number: '',
  password: '',
})

const code = ref('')
const otpSent = ref(false)
const sending = ref(false)
const verifying = ref(false)
const cooldown = ref(0)
let cooldownTimer = null
const error = ref('')
const success = ref('')

const sendOtp = async () => {
  error.value = ''
  success.value = ''

  if (!form.name || !form.phone_number || !form.password) {
    error.value = 'Please fill in all required fields.'
    return
  }

  if (form.password.length < 8) {
    error.value = 'Password must be at least 8 characters.'
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
      body: JSON.stringify({ phone: form.phone_number })
    })

    const data = await response.json()
    if (response.ok && data.success) {
      otpSent.value = true
      success.value = 'OTP sent. Check your messages.'
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
    error.value = 'Failed to send OTP.'
  } finally {
    sending.value = false
  }
}

const verifyOtp = async () => {
  error.value = ''
  success.value = ''

  if (!code.value || code.value.length < 6) {
    error.value = 'Enter the 6-digit code.'
    return
  }

  verifying.value = true
  try {
    const response = await fetch('/otp/verify-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify({
        phone: form.phone_number,
        code: code.value,
        name: form.name,
        email: form.email || null,
        password: form.password
      })
    })

    const data = await response.json()
    if (response.ok && data.success) {
      success.value = 'Account created! Redirecting...'
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } else {
      error.value = data.message || 'Invalid code.'
    }
  } catch (e) {
    error.value = 'Verification failed.'
  } finally {
    verifying.value = false
  }
}

const resetOtp = () => {
  otpSent.value = false
  code.value = ''
  error.value = ''
  success.value = ''
}
</script>
