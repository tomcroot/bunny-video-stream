<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
    <div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl">
      <div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8">
        <h2 class="text-2xl font-bold text-white text-center mb-3">Verify Your Email</h2>
        <p class="text-sm text-red-100">
          Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
        </p>
      </div>
      <div class="bg-card border border-border border-t-0 px-6 py-8">
      <div class="flex flex-col gap-3">
        <form @submit.prevent="submit">
          <button
            type="submit"
            class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
            :disabled="form.processing"
          >
            <span v-if="form.processing">Resending...</span>
            <span v-else>Resend Verification Email</span>
          </button>
        </form>

        <form method="POST" action="{{ route('logout') }}">
          <button
            type="submit"
            class="w-full text-sm text-primary hover:text-primary/80 py-2 transition-colors"
          >
            Log Out
          </button>
        </form>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const form = useForm({})

const status = computed(() => page.props.flash?.message)

const submit = () => {
  form.post('/email/verification-notification', {
    onSuccess: () => {
      alert('Verification link sent to your email!')
    }
  })
}
</script>
