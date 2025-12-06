<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
    <div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl">
      <div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8">
        <h2 class="text-2xl font-bold text-white text-center mb-2">Confirm Password</h2>
        <p class="text-sm text-red-100 text-center">
          Please confirm your password before continuing.
        </p>
      </div>
      <div class="bg-card border border-border border-t-0 px-6 py-8">
      <form @submit.prevent="submit">
        <div>
          <label for="password" class="block text-sm font-medium text-foreground mb-2">Password</label>
          <input
            id="password"
            type="password"
            class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            v-model="form.password"
            required
            autofocus
          />
          <div v-if="form.errors.password" class="text-destructive text-sm mt-1">
            {{ form.errors.password }}
          </div>
        </div>

        <div class="flex items-center justify-end mt-6">
          <button
            type="submit"
            class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
            :disabled="form.processing"
          >
            <span v-if="form.processing">Confirming...</span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  password: ''
})

const submit = () => {
  form.post('/user/confirm-password')
}
</script>
