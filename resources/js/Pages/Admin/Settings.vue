<template>
  <Head title="Settings" />
  <AdminLayout>
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Site Settings</h1>
        <p class="mt-1 text-gray-600">Manage key site features and configurations</p>
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
                Contact Email Address
              </label>
              <input
                v-model="formData.contact_email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p class="mt-1 text-xs text-gray-500">
                Email address to receive contact form submissions
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
import { ref, reactive } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

defineProps({
  settings: Object,
  settingsList: Array,
  availableSettings: Array,
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
Object.keys(formData).forEach(key => {
  if (settings[key]) {
    const settingValue = settings[key].value
    if (typeof formData[key] === 'boolean') {
      formData[key] = settingValue === 'true' || settingValue === true
    } else if (typeof formData[key] === 'number') {
      formData[key] = parseInt(settingValue)
    } else {
      formData[key] = settingValue
    }
  }
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
      description: availableSettings.find(s => s.key === key)?.description,
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
