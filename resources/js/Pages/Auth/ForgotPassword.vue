<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
    <div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl">
      <div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8">
        <h2 class="text-2xl font-bold text-white text-center mb-2">Reset Password</h2>
        <p class="text-sm text-red-100 text-center">
          Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.
        </p>
      </div>
      <div class="bg-card border border-border border-t-0 px-6 py-8">
      <form @submit.prevent="submit">
        <div>
          <label for="email" class="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            id="email"
            type="email"
            class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            v-model="form.email"
            required
            autofocus
          />
          <div v-if="form.errors.email" class="text-destructive text-sm mt-1">
            {{ form.errors.email }}
          </div>
        </div>

        <div class="flex items-center justify-between mt-6">
          <Link
            href="/login"
            class="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Back to login
          </Link>

          <button
            type="submit"
            class="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
            :disabled="form.processing"
          >
            <span v-if="form.processing">Sending...</span>
            <span v-else>Send Reset Link</span>
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'
import { Link } from '@inertiajs/vue3'

const form = useForm({
  email: ''
})

const submit = () => {
  form.post('/forgot-password')
}
</script>
