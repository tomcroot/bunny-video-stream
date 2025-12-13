<template>
  <Head title="Settings" />
  <AdminLayout>
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Database Settings</h1>
        <p class="mt-1 text-gray-600">Manage key site features and configurations</p>

        <!-- Environment Info Banner -->
        <div class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-semibold text-blue-900 mb-2">Current Environment Configuration</p>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-blue-700 font-medium">Environment:</span>
                  <span class="ml-2 text-blue-900">{{ envInfo?.app_env || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-blue-700 font-medium">App Name:</span>
                  <span class="ml-2 text-blue-900">{{ envInfo?.app_name || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-blue-700 font-medium">App URL:</span>
                  <span class="ml-2 text-blue-900">{{ envInfo?.app_url || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-blue-700 font-medium">Mail From:</span>
                  <span class="ml-2 text-blue-900">{{ envInfo?.mail_from || 'N/A' }}</span>
                </div>
              </div>
              <p class="text-xs text-blue-700 mt-3">
                Some settings below use values from your .env file as defaults. Database settings override these defaults when saved.
              </p>
            </div>
          </div>
        </div>

        <!-- Link to Environment Settings -->
        <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800 mb-2">
            <strong>Need to Edit API Keys or Database Credentials?</strong>
          </p>
          <p class="text-xs text-yellow-700 mb-3">
            These are runtime database settings. For .env configuration (API keys, database credentials, email/SMS settings, payment keys, etc.), use the Environment Settings page.
          </p>
          <Link
            href="/admin/env-settings"
            class="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configure Environment Variables (.env)
          </Link>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <div v-if="showSuccess" class="rounded-md bg-green-50 p-4">
          <p class="text-sm font-medium text-green-800">Settings saved successfully!</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Premiere Settings</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Premiere Date & Time
              </label>
              <input
                v-model="formData.premiere_date"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p class="mt-1 text-xs text-gray-500">
                Format: ISO 8601 (e.g., 2025-12-10T06:00:00Z)
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Feature Controls</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p class="font-medium text-gray-900">Contact Form</p>
                <p class="text-sm text-gray-500">Allow visitors to submit contact requests</p>
              </div>
              <button
                type="button"
                @click="toggleSetting('enable_contact_form')"
                :class="[
                  formData.enable_contact_form ? 'bg-red-600' : 'bg-gray-300',
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                ]"
              >
                <span
                  :class="[
                    formData.enable_contact_form ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p class="font-medium text-gray-900">Reviews</p>
                <p class="text-sm text-gray-500">Allow visitors to submit reviews</p>
              </div>
              <button
                type="button"
                @click="toggleSetting('enable_reviews')"
                :class="[
                  formData.enable_reviews ? 'bg-red-600' : 'bg-gray-300',
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                ]"
              >
                <span
                  :class="[
                    formData.enable_reviews ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p class="font-medium text-gray-900">Require Review Approval</p>
                <p class="text-sm text-gray-500">Moderate reviews before publishing</p>
              </div>
              <button
                type="button"
                @click="toggleSetting('reviews_require_approval')"
                :class="[
                  formData.reviews_require_approval ? 'bg-red-600' : 'bg-gray-300',
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                ]"
              >
                <span
                  :class="[
                    formData.reviews_require_approval ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between py-3">
              <div>
                <p class="font-medium text-gray-900">Maintenance Mode</p>
                <p class="text-sm text-gray-500">Show maintenance page to visitors</p>
              </div>
              <button
                type="button"
                @click="toggleSetting('maintenance_mode')"
                :class="[
                  formData.maintenance_mode ? 'bg-yellow-600' : 'bg-gray-300',
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                ]"
              >
                <span
                  :class="[
                    formData.maintenance_mode ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Additional Settings</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Site Title
                <span v-if="!formData.site_title" class="ml-2 text-xs text-gray-500">
                  (Using .env: {{ envInfo?.app_name }})
                </span>
              </label>
              <input
                v-model="formData.site_title"
                type="text"
                :placeholder="envInfo?.app_name || 'A Crazy Day in Accra'"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p class="mt-1 text-xs text-gray-500">
                Leave empty to use APP_NAME from .env
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                v-model="formData.site_description"
                rows="3"
                placeholder="A gripping thriller set in Accra..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p class="mt-1 text-xs text-gray-500">
                SEO meta description for your site
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Contact Settings</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contact Email Address
                <span v-if="!formData.contact_email" class="ml-2 text-xs text-gray-500">
                  (Using .env: {{ envInfo?.mail_from }})
                </span>
              </label>
              <input
                v-model="formData.contact_email"
                type="email"
                :placeholder="envInfo?.mail_from || 'contact@example.com'"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p class="mt-1 text-xs text-gray-500">
                Email to receive contact form submissions (defaults to MAIL_FROM_ADDRESS)
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Max File Upload Size (MB)
              </label>
              <input
                v-model.number="formData.max_file_upload_mb"
                type="number"
                min="1"
                max="500"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p class="mt-1 text-xs text-gray-500">
                Maximum file size allowed for uploads
              </p>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
          >
            Save Settings
          </button>
          <Link
            href="/admin"
            class="px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, reactive, onMounted } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  settings: {
    type: Object,
    default: () => ({}),
  },
  settingsList: {
    type: Array,
    default: () => [],
  },
  availableSettings: {
    type: Array,
    default: () => [],
  },
  envInfo: {
    type: Object,
    default: () => ({}),
  },
})

const showSuccess = ref(false)
const formData = reactive({
  premiere_date: '',
  site_title: '',
  site_description: '',
  contact_email: '',
  enable_contact_form: false,
  enable_reviews: false,
  reviews_require_approval: false,
  maintenance_mode: false,
  max_file_upload_mb: 50,
})

// Initialize form data from props
const initializeFormData = () => {
  Object.keys(formData).forEach(key => {
    if (props.settings && props.settings[key]) {
      const settingValue = props.settings[key].value
      if (typeof formData[key] === 'boolean') {
        formData[key] = settingValue === 'true' || settingValue === true
      } else if (typeof formData[key] === 'number') {
        formData[key] = parseInt(settingValue)
      } else {
        formData[key] = settingValue
      }
    }
  })
}

onMounted(() => {
  initializeFormData()
})

const toggleSetting = (key) => {
  formData[key] = !formData[key]
}

const handleSubmit = () => {
  const settingsArray = Object.entries(formData).map(([key, value]) => {
    let dataType = 'string'
    if (typeof value === 'boolean') dataType = 'boolean'
    if (typeof value === 'number') dataType = key.includes('date') ? 'string' : 'integer'

    return {
      key,
      value: String(value),
      data_type: dataType,
      description: props.availableSettings.find(s => s.key === key)?.description,
    }
  })

  router.post('/admin/settings', { settings: settingsArray }, {
    onSuccess: () => {
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    },
  })
}
</script>
