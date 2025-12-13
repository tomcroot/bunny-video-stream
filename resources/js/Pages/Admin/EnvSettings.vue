<template>
  <Head title="Environment Settings" />

  <AdminLayout>
    <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Environment Settings</h1>
        <p class="mt-2 text-muted-foreground">
          Configure your application environment variables. Changes require application restart.
        </p>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="showSuccess" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
        Settings updated successfully! Please restart your application for changes to take effect.
      </div>

      <div v-if="$page.props.flash?.error" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        {{ $page.props.flash.error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Loop through each section -->
        <div v-for="(settings, sectionName) in envStructure" :key="sectionName" class="mb-8">
          <div class="bg-card rounded-lg shadow-md overflow-hidden">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 class="text-xl font-semibold text-white">{{ sectionName }}</h2>
            </div>

            <!-- Section Settings -->
            <div class="p-6 space-y-6">
              <div v-for="setting in settings" :key="setting.key" class="space-y-2">
                <label class="block">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-foreground">
                      {{ setting.key }}
                      <span v-if="setting.is_sensitive" class="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                        Sensitive
                      </span>
                    </span>
                  </div>

                  <input
                    v-model="formData[setting.key]"
                    :type="setting.is_sensitive ? 'password' : 'text'"
                    :placeholder="setting.example || `Enter ${setting.key}`"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground"
                  />

                  <p v-if="setting.description" class="mt-1 text-xs text-muted-foreground">
                    {{ setting.description }}
                  </p>
                  <p v-else-if="setting.example" class="mt-1 text-xs text-muted-foreground">
                    Example: {{ setting.example }}
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 sticky bottom-4 bg-background p-4 rounded-lg shadow-lg border border-border">
          <button
            type="submit"
            class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
          >
            Save Environment Settings
          </button>
          <Link
            href="/admin/settings"
            class="px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium transition-colors"
          >
            Back to Database Settings
          </Link>
          <Link
            href="/admin"
            class="px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </form>

      <!-- Warning Notice -->
      <div class="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Important Notes</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <ul class="list-disc list-inside space-y-1">
                <li>Changes to environment variables require restarting your application</li>
                <li>Sensitive values (passwords, keys, secrets) are masked for security</li>
                <li>Make sure to backup your .env file before making changes</li>
                <li>Invalid configurations may cause your application to fail</li>
                <li>Database settings: Use the Database Settings page for runtime settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, reactive } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  envSettings: Object,
  envStructure: Object,
})

const showSuccess = ref(false)
const formData = reactive({})

// Initialize form data from current .env values
Object.keys(props.envSettings).forEach(key => {
  formData[key] = props.envSettings[key]
})

// Also initialize any keys from structure that aren't in current .env
Object.values(props.envStructure).forEach(section => {
  section.forEach(setting => {
    if (!(setting.key in formData)) {
      formData[setting.key] = ''
    }
  })
})

const handleSubmit = () => {
  router.post('/admin/env-settings', { settings: formData }, {
    onSuccess: () => {
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    },
    preserveScroll: true,
  })
}
</script>
