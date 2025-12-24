<template>
  <div class="min-h-screen flex bg-background">
    <!-- Left: marketing -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-700 items-center justify-center relative">
      <div class="absolute inset-0 bg-background/40"></div>
      <div class="max-w-2xl px-8 z-10">
        <h1 class="text-4xl font-bold mb-4">Join Promise Land Films</h1>
        <p class="mb-6 text-muted-foreground">
          Create your account to stream "A Crazy Day in Accra".
        </p>

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
          <h2 class="text-3xl font-bold">Create your account</h2>
          <p class="text-sm text-muted-foreground mt-2">
            Enter your details to get started
          </p>
        </div>

        <!-- Registration Form -->
        <div class="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Name</label>
            <input
              v-model="registerForm.name"
              class="w-full px-4 py-3 rounded-md bg-background border border-input"
            />
            <div v-if="registerForm.errors.name" class="text-destructive text-sm mt-1">
              {{ registerForm.errors.name }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Phone Number</label>
            <input
              v-model="registerForm.phone_number"
              type="tel"
              placeholder="0244 123 456"
              class="w-full px-4 py-3 rounded-md bg-background border border-input"
            />
            <div v-if="registerForm.errors.phone_number" class="text-destructive text-sm mt-1">
              {{ registerForm.errors.phone_number }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Email (optional)</label>
            <input
              v-model="registerForm.email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 rounded-md bg-background border border-input"
            />
            <div v-if="registerForm.errors.email" class="text-destructive text-sm mt-1">
              {{ registerForm.errors.email }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <div class="relative">
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-md bg-background border border-input pr-10"
              />
              <button
                @click="showPassword = !showPassword"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.83 9L15.5 12.67c.11-.35.17-.72.17-1.1 0-2.21-1.79-4-4-4-.38 0-.75.05-1.1.15L11.83 9zm7.08-9.14c-.37-.06-.74-.1-1.13-.1-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5.39 0 .76-.03 1.13-.1l1.41 1.41c-.54.1-1.08.16-1.54.16-5.5 0-10.27-3.61-12-8.5 1.73-4.89 6.5-8.5 12-8.5.46 0 .99.06 1.54.16L18.91.34zM19.5 13c0-1.66-1.34-3-3-3-.35 0-.69.06-1 .16l3.84 3.84c.1-.31.16-.65.16-1zm-9-8c.35 0 .69.06 1 .16L9.16 4.16C8.69 4.06 8.35 4 8 4c-1.66 0-3 1.34-3 3 0 .35.06.69.16 1l3.84-3.84z"/>
                </svg>
              </button>
            </div>
            <div v-if="registerForm.errors.password" class="text-destructive text-sm mt-1">
              {{ registerForm.errors.password }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Confirm Password</label>
            <div class="relative">
              <input
                v-model="registerForm.password_confirmation"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-md bg-background border border-input pr-10"
              />
              <button
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <svg v-if="showPasswordConfirmation" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.83 9L15.5 12.67c.11-.35.17-.72.17-1.1 0-2.21-1.79-4-4-4-.38 0-.75.05-1.1.15L11.83 9zm7.08-9.14c-.37-.06-.74-.1-1.13-.1-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5.39 0 .76-.03 1.13-.1l1.41 1.41c-.54.1-1.08.16-1.54.16-5.5 0-10.27-3.61-12-8.5 1.73-4.89 6.5-8.5 12-8.5.46 0 .99.06 1.54.16L18.91.34zM19.5 13c0-1.66-1.34-3-3-3-.35 0-.69.06-1 .16l3.84 3.84c.1-.31.16-.65.16-1zm-9-8c.35 0 .69.06 1 .16L9.16 4.16C8.69 4.06 8.35 4 8 4c-1.66 0-3 1.34-3 3 0 .35.06.69.16 1l3.84-3.84z"/>
                </svg>
              </button>
            </div>
            <div v-if="registerForm.errors.password_confirmation" class="text-destructive text-sm mt-1">
              {{ registerForm.errors.password_confirmation }}
            </div>
          </div>

          <button
            @click="submitRegistration"
            :disabled="registerForm.processing"
            class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            <span v-if="registerForm.processing">Creating Account...</span>
            <span v-else>Create Account</span>
          </button>
        </div>

        <!-- OTP Verification Step DISABLED - Direct account creation enabled -->
        <!-- <div v-else class="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4">
          <p class="text-sm text-muted-foreground text-center">
            Enter the 6-digit code sent via SMS to
            <strong>{{ registerForm.phone_number }}</strong>
          </p>

          <input
            v-model="verifyForm.code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            class="w-full px-4 py-3 rounded-md bg-background border border-input text-center text-2xl tracking-widest"
          />

          <div v-if="verifyForm.errors.code" class="text-destructive text-sm">
            {{ verifyForm.errors.code }}
          </div>

          <div class="flex gap-3">
            <button
              @click="verifyOtp"
              :disabled="verifyForm.processing"
              class="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
            >
              <span v-if="verifyForm.processing">Verifying...</span>
              <span v-else>Verify & Register</span>
            </button>

            <button
              @click="resetOtp"
              :disabled="sending"
              class="flex-1 px-4 py-3 border border-border rounded-md"
            >
              Back
            </button>
          </div>

          <button
            @click="resendOtp"
            :disabled="cooldown > 0 || registerForm.processing"
            class="text-sm text-primary disabled:opacity-50"
          >
            <span v-if="cooldown > 0">Resend in {{ cooldown }}s</span>
            <span v-else>Resend Code</span>
          </button>
        </div> -->

        <p class="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?
          <a :href="route('login')" class="text-primary font-medium">Sign in</a>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useForm } from '@inertiajs/vue3'

// slider - using public folder
const images = [
  '/movie_poster.jpg',
  '/movie_poster_2.jpg',
  '/plfilms-acradayinaccra-poster.png'
]

const current = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % images.length
  }, 4000)
})

onUnmounted(() => clearInterval(timer))

// Password visibility toggles
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

// FORMS
const registerForm = useForm({
  name: '',
  phone_number: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const verifyForm = useForm({
  code: '',
})

const otpSent = ref(false) // OTP DISABLED - kept for UI compatibility
const cooldown = ref(0)
let cooldownTimer = null

const startCooldown = (s = 60) => {
  cooldown.value = s
  if (cooldownTimer) clearInterval(cooldownTimer)

  cooldownTimer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(cooldownTimer)
  }, 1000)
}

// SUBMIT REGISTRATION (OTP DISABLED - Direct registration)
const submitRegistration = () => {
  registerForm.post('/register', {
    onSuccess: () => {
      // Redirect handled by backend
    },
    preserveScroll: true,
  })
}

// VERIFY + REGISTER (OTP DISABLED - commented out)
// const verifyOtp = () => {
//   verifyForm.transform(() => ({
//     code: verifyForm.code,
//     phone: registerForm.phone_number,
//     email: registerForm.email,
//     name: registerForm.name,
//     password: registerForm.password,
//   })).post('/otp/verify-register', {
//     onSuccess: () => {
//       // Redirect handled by backend
//     },
//     preserveScroll: true,
//   })
// }

// RESEND OTP (OTP DISABLED - commented out)
// const resendOtp = () => {
//   registerForm.post('/otp/send', {
//     onSuccess: () => {
//       startCooldown(60)
//     },
//     preserveScroll: true,
//   })
// }

const resetOtp = () => {
  otpSent.value = false
  verifyForm.reset('code')
} // OTP DISABLED - function kept for reference
</script>
