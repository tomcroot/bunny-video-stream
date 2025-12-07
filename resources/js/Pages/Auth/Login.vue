<template>
  <div class="min-h-screen flex bg-background">
    <!-- Left: marketing -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-700 items-center justify-center relative">
      <div class="absolute inset-0 bg-background/40"></div>
      <div class="max-w-2xl px-8 z-10">
        <h1 class="text-4xl font-bold mb-4">Welcome to Promise Films</h1>
        <p class="mb-6 text-muted-foreground">Sign in with phone OTP or email.</p>
        <div class="rounded-lg overflow-hidden shadow-2xl border border-border">
          <img :src="images[current]" class="w-full h-64 object-cover" />
        </div>
      </div>

      <div class="absolute left-6 bottom-6 flex space-x-3">
        <button
          v-for="(_, idx) in images"
          :key="idx"
          @click="current = idx"
          class="w-3 h-3 rounded-full"
          :class="current === idx ? 'bg-primary' : 'bg-muted'"
        />
      </div>
    </div>

    <!-- Right -->
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-md">

        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold">Sign in</h2>
          <p class="text-sm text-muted-foreground mt-2">OTP or email/password</p>
        </div>

        <!-- OTP -->
        <div class="bg-card border border-border rounded-lg p-6 shadow-lg mb-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Phone number</label>
            <input
              v-model="otpForm.phone"
              type="tel"
              placeholder="+233 24 000 0000"
              class="w-full px-4 py-3 rounded-md bg-background border border-input"
            />
            <div v-if="otpForm.errors.phone" class="text-destructive text-sm mt-1">
              {{ otpForm.errors.phone }}
            </div>
          </div>

          <div v-if="otpSent">
            <label class="block text-sm font-medium mb-2">Enter OTP</label>
            <input
              v-model="verifyForm.code"
              type="text"
              inputmode="numeric"
              maxlength="6"
              class="w-full px-4 py-3 rounded-md bg-background border border-input text-center tracking-widest"
            />
            <div v-if="verifyForm.errors.code" class="text-destructive text-sm mt-1">
              {{ verifyForm.errors.code }}
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="sendOtp"
              :disabled="otpForm.processing || cooldown > 0"
              class="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
            >
              <span v-if="otpForm.processing">Sending...</span>
              <span v-else-if="cooldown > 0">Resend in {{ cooldown }}s</span>
              <span v-else>{{ otpSent ? 'Resend OTP' : 'Send OTP' }}</span>
            </button>

            <button
              v-if="otpSent"
              @click="verifyOtp"
              :disabled="verifyForm.processing"
              class="flex-1 px-4 py-3 border border-border rounded-md disabled:opacity-50"
            >
              <span v-if="verifyForm.processing">Verifying...</span>
              <span v-else>Verify</span>
            </button>
          </div>

          <div v-if="flash.success" class="text-green-500 text-sm">
            {{ flash.success }}
          </div>
        </div>

        <!-- Email login -->
        <form @submit.prevent="submitEmail" class="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Email or Phone</label>
            <input v-model="form.email" class="w-full px-4 py-3 rounded-md bg-background border border-input" />
            <div v-if="form.errors.email" class="text-destructive text-sm mt-1">{{ form.errors.email }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <input v-model="form.password" type="password" class="w-full px-4 py-3 rounded-md bg-background border border-input" />
            <div v-if="form.errors.password" class="text-destructive text-sm mt-1">{{ form.errors.password }}</div>
          </div>

          <div class="flex justify-between items-center">
            <a :href="route('password.request')" class="text-sm text-primary">Forgot password?</a>
            <button type="submit" :disabled="form.processing" class="px-6 py-3 bg-primary text-primary-foreground rounded-md">
              Sign in
            </button>
          </div>
        </form>

        <p class="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?
          <a :href="route('register')" class="text-primary font-medium">Register</a>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'

const flash = usePage().props.flash

// slider
const images = [
  'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
  'https://images.unsplash.com/photo-1515169067865-5387ec356754',
  'https://images.unsplash.com/photo-1508873699372-7ae59b0f2fef'
]

const current = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % images.length
  }, 4000)
})

onUnmounted(() => clearInterval(timer))

// OTP FORMS
const otpSent = ref(false)
const cooldown = ref(0)
let cooldownTimer = null

const otpForm = useForm({ phone: '' })
const verifyForm = useForm({ phone: '', code: '' })

const startCooldown = (s = 60) => {
  cooldown.value = s
  if (cooldownTimer) clearInterval(cooldownTimer)

  cooldownTimer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(cooldownTimer)
  }, 1000)
}

const sendOtp = () => {
  otpForm.post('/otp/send', {
    onSuccess: () => {
      otpSent.value = true
      verifyForm.phone = otpForm.phone
      startCooldown(60)
    },
    preserveScroll: true,
  })
}

const verifyOtp = () => {
  verifyForm.phone = otpForm.phone

  verifyForm.post('/otp/verify', {
    onSuccess: () => {
      // Redirect handled by backend
    },
    preserveScroll: true,
  })
}

// EMAIL LOGIN
const form = useForm({
  email: '',
  password: '',
})

const submitEmail = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
    onSuccess: () => {
      // Redirect handled by backend
    },
    preserveScroll: true,
  })
}
</script>
