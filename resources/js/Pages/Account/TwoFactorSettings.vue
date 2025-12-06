<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border px-6 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-foreground">Account Security</h1>
        <p class="text-muted-foreground mt-2">Manage two-factor authentication</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-2xl mx-auto px-6 py-8">
      <!-- 2FA Status Card -->
      <div class="bg-card border border-border rounded-lg p-6 mb-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-semibold text-foreground mb-2">Two-Factor Authentication</h2>
            <p v-if="!userTwoFactorEnabled" class="text-sm text-muted-foreground">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <p v-else class="text-sm text-green-600 font-medium">
              ✓ Two-factor authentication is enabled on your account.
            </p>
          </div>
        </div>

        <div class="mt-6">
          <button
            v-if="!userTwoFactorEnabled"
            @click="startEnabling"
            :disabled="enabling"
            class="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
          >
            <span v-if="enabling">Setting up...</span>
            <span v-else>Enable Two-Factor Auth</span>
          </button>

          <button
            v-else
            @click="showConfirmDisable = true"
            :disabled="disabling"
            class="px-6 py-3 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 font-medium transition-colors"
          >
            <span v-if="disabling">Disabling...</span>
            <span v-else>Disable Two-Factor Auth</span>
          </button>
        </div>
      </div>

      <!-- QR Code Setup (during enablement) -->
      <div v-if="showQrCode && !userTwoFactorEnabled" class="bg-card border border-border rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Set up authenticator app</h3>
        <div class="space-y-4">
          <p class="text-sm text-muted-foreground">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
          </p>

          <div class="flex justify-center p-4 bg-background rounded-lg border border-border">
            <div v-if="qrCode" v-html="qrCode" class=""></div>
            <div v-else class="text-muted-foreground">Loading QR code...</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Or enter this code manually:</label>
            <input
              :value="secretKey"
              readonly
              class="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground font-mono text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Enter 6-digit code to confirm:</label>
            <input
              v-model="confirmCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="000000"
              class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center text-lg tracking-widest"
            />
            <div v-if="error" class="text-destructive text-sm mt-1">{{ error }}</div>
          </div>

          <div class="flex gap-3">
            <button
              @click="confirmEnableTwoFactor"
              :disabled="confirming || confirmCode.length < 6"
              class="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
            >
              <span v-if="confirming">Confirming...</span>
              <span v-else>Confirm & Enable</span>
            </button>
            <button
              @click="cancelEnable"
              class="flex-1 px-4 py-3 border border-border bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Recovery Codes -->
      <div v-if="userTwoFactorEnabled" class="bg-card border border-border rounded-lg p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Recovery Codes</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Save these recovery codes in a safe place. Use them if you lose access to your authenticator app.
        </p>

        <div class="bg-background border border-border rounded-lg p-4 mb-4 font-mono text-sm space-y-2">
          <div v-for="(code, idx) in recoveryCodes" :key="idx" class="text-foreground">
            {{ code }}
          </div>
        </div>

        <button
          @click="copyRecoveryCodes"
          class="px-4 py-2 border border-border rounded-md hover:bg-background text-sm font-medium transition-colors"
        >
          {{ copiedRecovery ? '✓ Copied' : 'Copy Codes' }}
        </button>
      </div>

      <!-- Disable Confirmation Dialog -->
      <div v-if="showConfirmDisable" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-card border border-border rounded-lg p-6 max-w-sm mx-4">
          <h3 class="text-lg font-semibold text-foreground mb-2">Disable Two-Factor Auth?</h3>
          <p class="text-sm text-muted-foreground mb-6">
            This will reduce your account security. Are you sure?
          </p>
          <div class="flex gap-3">
            <button
              @click="disableTwoFactor"
              :disabled="disabling"
              class="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 font-medium transition-colors"
            >
              <span v-if="disabling">Disabling...</span>
              <span v-else>Disable</span>
            </button>
            <button
              @click="showConfirmDisable = false"
              class="flex-1 px-4 py-2 border border-border rounded-md hover:bg-background font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

const props = defineProps({
  userTwoFactorEnabled: Boolean,
  recoveryCodes: Array,
})

const showing = ref(false)
const showQrCode = ref(false)
const showConfirmDisable = ref(false)
const enabling = ref(false)
const confirming = ref(false)
const disabling = ref(false)
const qrCode = ref('')
const secretKey = ref('')
const confirmCode = ref('')
const error = ref('')
const copiedRecovery = ref(false)

const startEnabling = async () => {
  enabling.value = true
  error.value = ''

  try {
    const response = await fetch('/user/two-factor-authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      }
    })

    const data = await response.json()
    if (response.ok) {
      qrCode.value = data.qr_code
      secretKey.value = data.secret
      showQrCode.value = true
    } else {
      error.value = data.message || 'Failed to generate QR code'
    }
  } catch (e) {
    error.value = 'Failed to set up two-factor authentication'
  } finally {
    enabling.value = false
  }
}

const confirmEnableTwoFactor = async () => {
  confirming.value = true
  error.value = ''

  try {
    const response = await fetch('/user/confirmed-two-factor-authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify({ code: confirmCode.value })
    })

    const data = await response.json()
    if (response.ok) {
      window.location.reload()
    } else {
      error.value = data.message || 'Invalid code. Please try again.'
    }
  } catch (e) {
    error.value = 'Verification failed'
  } finally {
    confirming.value = false
  }
}

const disableTwoFactor = async () => {
  disabling.value = true

  try {
    const response = await fetch('/user/two-factor-authentication', {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      }
    })

    if (response.ok) {
      window.location.reload()
    }
  } catch (e) {
    // Handle error
  } finally {
    disabling.value = false
  }
}

const cancelEnable = () => {
  showQrCode.value = false
  confirmCode.value = ''
  error.value = ''
}

const copyRecoveryCodes = async () => {
  const codes = props.recoveryCodes.join('\n')
  await navigator.clipboard.writeText(codes)
  copiedRecovery.value = true
  setTimeout(() => {
    copiedRecovery.value = false
  }, 2000)
}
</script>
