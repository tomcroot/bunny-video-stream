<template>
  <div class="space-y-4">
    <!-- Image Preview -->
    <div v-if="previewUrl || modelValue" class="relative">
      <img
        :src="previewUrl || modelValue"
        :alt="alt"
        class="w-full max-w-md rounded-lg border border-border object-cover"
        :class="aspectClass"
      />
      <button
        v-if="previewUrl || (modelValue && !disabled)"
        type="button"
        @click="clearImage"
        class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        title="Remove image"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Upload Area -->
    <div
      v-if="!previewUrl && !modelValue"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    >
      <Upload class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p class="text-sm text-foreground font-medium mb-1">
        Click to upload or drag and drop
      </p>
      <p class="text-xs text-muted-foreground">
        {{ acceptedFormats }} (Max {{ maxSizeMB }}MB)
      </p>
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        @change="handleFileSelect"
        class="hidden"
        :disabled="disabled"
      />
    </div>

    <!-- Upload Button (when URL is shown) -->
    <div v-if="modelValue && !previewUrl && !disabled" class="flex gap-2">
      <button
        type="button"
        @click="triggerFileInput"
        class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"
      >
        Change Image
      </button>
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        @change="handleFileSelect"
        class="hidden"
      />
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Upload Progress -->
    <div v-if="isUploading" class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">Uploading...</span>
        <span class="text-foreground font-medium">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-secondary rounded-full h-2">
        <div
          class="bg-primary h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Upload, X } from 'lucide-vue-next'
import { router } from '@inertiajs/vue3'

const props = defineProps({
  modelValue: { type: String, default: '' },
  folder: { type: String, default: 'uploads' },
  accept: { type: String, default: 'image/jpeg,image/png,image/jpg,image/gif,image/webp' },
  maxSize: { type: Number, default: 10240 }, // KB
  alt: { type: String, default: 'Preview' },
  aspectClass: { type: String, default: 'aspect-video' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error'])

const fileInput = ref(null)
const previewUrl = ref('')
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')

const maxSizeMB = computed(() => Math.round(props.maxSize / 1024))
const acceptedFormats = computed(() => {
  const formats = props.accept.split(',').map(f => f.split('/')[1].toUpperCase())
  return formats.join(', ')
})

const triggerFileInput = () => {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    validateAndUpload(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files?.[0]
  if (file) {
    validateAndUpload(file)
  }
}

const validateAndUpload = (file) => {
  error.value = ''

  // Validate file type
  if (!props.accept.split(',').some(type => file.type.match(type.trim()))) {
    error.value = `Invalid file type. Accepted: ${acceptedFormats.value}`
    return
  }

  // Validate file size
  if (file.size > props.maxSize * 1024) {
    error.value = `File too large. Max size: ${maxSizeMB.value}MB`
    return
  }

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Upload file
  uploadFile(file)
}

const uploadFile = async (file) => {
  isUploading.value = true
  uploadProgress.value = 0
  error.value = ''

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', props.folder)

  try {
    // Simulate progress (since we can't track actual progress with fetch easily)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    const response = await fetch('/admin/upload/image', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      }
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Upload failed')
    }

    const data = await response.json()

    emit('update:modelValue', data.url)
    emit('upload-success', data)

    setTimeout(() => {
      isUploading.value = false
      uploadProgress.value = 0
    }, 500)
  } catch (err) {
    error.value = err.message || 'Upload failed. Please try again.'
    emit('upload-error', err)
    previewUrl.value = ''
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const clearImage = () => {
  previewUrl.value = ''
  error.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
