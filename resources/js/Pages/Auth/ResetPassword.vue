<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
    <div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl">
      <div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8">
        <h2 class="text-2xl font-bold text-white text-center">Create New Password</h2>
        <p class="text-sm text-red-100 text-center mt-2">Enter your new password below</p>
      </div>
      <div class="bg-card border border-border border-t-0 px-6 py-8">
      <form @submit.prevent="submit">
        <div class="space-y-4">
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

          <div>
            <label for="password" class="block text-sm font-medium text-foreground mb-2">New Password</label>
            <input
              id="password"
              type="password"
              class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              v-model="form.password"
              required
            />
            <div v-if="form.errors.password" class="text-destructive text-sm mt-1">
              {{ form.errors.password }}
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <input
              id="password_confirmation"
              type="password"
              class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              v-model="form.password_confirmation"
              required
            />
            <div v-if="form.errors.password_confirmation" class="text-destructive text-sm mt-1">
              {{ form.errors.password_confirmation }}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end mt-6">
          <button
            type="submit"
            class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
            :disabled="form.processing"
          >
            <span v-if="form.processing">Resetting...</span>
            <span v-else>Reset Password</span>
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'

const props = defineProps({
  email: String,
  token: String
})

const form = useForm({
  token: props.token,
  email: props.email,
  password: '',
  password_confirmation: ''
})

const submit = () => {
  form.post('/reset-password', {
    onFinish: () => form.reset('password', 'password_confirmation'),
  })
}
</script>
