<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
    <div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl">
      <div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8">
        <h2 class="text-2xl font-bold text-white text-center mb-2">Two-Factor Authentication</h2>
        <p class="text-sm text-red-100 text-center">
          Verify access to your account
        </p>
      </div>
      <div class="bg-card border border-border border-t-0 px-6 py-8">
        <!-- Tab Selection -->
        <div class="flex gap-2 mb-6 border-b border-border">
          <button
            @click="activeTab = 'authenticator'"
            :class="[
              'pb-3 px-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'authenticator'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            ]"
          >
            Authenticator
          </button>
          <button
            @click="activeTab = 'recovery'"
            :class="[
              'pb-3 px-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'recovery'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            ]"
          >
            Recovery Code
          </button>
        </div>

        <!-- Authenticator Code Form -->
        <form v-show="activeTab === 'authenticator'" @submit.prevent="submitAuthenticator">
          <div>
            <label for="code" class="block text-sm font-medium text-foreground mb-2">6-digit Code</label>
            <input
              id="code"
              v-model="form.code"
              type="text"
              inputmode="numeric"
              maxlength="6"
              class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center text-lg tracking-widest"
              autofocus
              required
              placeholder="000000"
            />
            <div v-if="form.errors.code" class="text-destructive text-sm mt-1">
              {{ form.errors.code }}
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

        <!-- Recovery Code Form -->
        <form v-show="activeTab === 'recovery'" @submit.prevent="submitRecovery">
          <div>
            <label for="recovery_code" class="block text-sm font-medium text-foreground mb-2">Recovery Code</label>
            <input
              id="recovery_code"
              v-model="recoveryForm.recovery_code"
              type="text"
              class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              required
            />
            <div v-if="recoveryForm.errors.recovery_code" class="text-destructive text-sm mt-1">
              {{ recoveryForm.errors.recovery_code }}
            </div>
          </div>

          <div class="flex items-center justify-end mt-6">
            <button
              type="submit"
              class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
              :disabled="recoveryForm.processing"
            >
              <span v-if="recoveryForm.processing">Confirming...</span>
              <span v-else>Confirm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

const activeTab = ref('authenticator')

const form = useForm({
  code: ''
})

const recoveryForm = useForm({
  recovery_code: ''
})

const submitAuthenticator = () => {
  form.post('/two-factor-challenge')
}

const submitRecovery = () => {
  recoveryForm.post('/two-factor-challenge')
}
</script>
