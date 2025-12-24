<template>
  <div class="min-h-screen flex bg-background">

    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-700 items-center justify-center relative">
      <div class="absolute inset-0 bg-background/40"></div>
      <div class="max-w-2xl px-8 z-10">
        <h1 class="text-4xl font-bold mb-4">Welcome to Promise Land Films</h1>
        <p class="mb-6 text-muted-foreground">Sign in with email or phone number and your password.</p>
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


    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-md">

        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold">Sign in</h2>
          <p class="text-sm text-muted-foreground mt-2">Enter your credentials to continue</p>
        </div>


        <form @submit.prevent="submitLogin" class="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Email or Phone Number</label>
            <input
              v-model="form.email"
              type="text"
              placeholder="email@example.com or 0244123456"
              class="w-full px-4 py-3 rounded-md bg-background border border-input"
            />
            <div v-if="form.errors.email" class="text-destructive text-sm mt-1">{{ form.errors.email }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full px-4 py-3 rounded-md bg-background border border-input"
            />
            <div v-if="form.errors.password" class="text-destructive text-sm mt-1">{{ form.errors.password }}</div>
          </div>

          <div class="flex items-center">
            <input
              v-model="form.remember"
              type="checkbox"
              id="remember"
              class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"
            />
            <label for="remember" class="ml-2 text-sm text-muted-foreground">Remember me for 30 days</label>
          </div>

          <div class="flex justify-between items-center">
            <a :href="route('password.request')" class="text-sm text-primary">Forgot password?</a>
            <button type="submit" :disabled="form.processing" class="px-6 py-3 bg-primary text-primary-foreground rounded-md disabled:opacity-50">
              <span v-if="form.processing">Signing in...</span>
              <span v-else>Sign in</span>
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


const form = useForm({
  email: '',
  password: '',
  remember: false,
})

const submitLogin = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
    onSuccess: () => {

    },
    preserveScroll: true,
  })
}
</script>
