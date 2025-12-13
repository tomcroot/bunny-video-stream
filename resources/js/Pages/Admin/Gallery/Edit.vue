<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Edit Gallery Image</h1>
            <p class="text-muted-foreground">Update gallery image details</p>
          </div>
          <Link
            href="/admin/gallery"
            class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back to Gallery
          </Link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow p-6">
        <form @submit.prevent="submit">
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <div v-if="form.errors.title" class="mt-1 text-sm text-red-600">
                {{ form.errors.title }}
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
              <div v-if="form.errors.description" class="mt-1 text-sm text-red-600">
                {{ form.errors.description }}
              </div>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Gallery Image *
              </label>
              <ImageUpload
                v-model="form.image_url"
                folder="gallery"
                alt="Gallery image preview"
                @upload-success="handleUploadSuccess"
                @upload-error="handleUploadError"
              />
              <div v-if="form.errors.image_url" class="mt-1 text-sm text-red-600">
                {{ form.errors.image_url }}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                Upload an image or enter URL manually below.
              </p>
              <!-- Manual URL Input -->
              <input
                v-model="form.image_url"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                placeholder="Or paste image URL..."
              />
            </div>

            <!-- Display Order -->
            <div>
              <label for="display_order" class="block text-sm font-medium text-foreground mb-2">
                Display Order
              </label>
              <input
                id="display_order"
                v-model.number="form.display_order"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div v-if="form.errors.display_order" class="mt-1 text-sm text-red-600">
                {{ form.errors.display_order }}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                Lower numbers appear first.
              </p>
            </div>

            <!-- Is Active -->
            <div class="flex items-center">
              <input
                id="is_active"
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <label for="is_active" class="ml-2 block text-sm text-foreground">
                Active (visible on the website)
              </label>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <Link
                href="/admin/gallery"
                class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                :disabled="form.processing"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span v-if="form.processing">Updating...</span>
                <span v-else>Update Image</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link, useForm } from '@inertiajs/vue3'
import { ArrowLeft } from 'lucide-vue-next'
import ImageUpload from '@/components/ImageUpload.vue'

const props = defineProps({
  image: { type: Object, required: true }
})

const form = useForm({
  title: props.image.title ?? '',
  description: props.image.description ?? '',
  image_url: props.image.image_url ?? '',
  display_order: props.image.display_order ?? 0,
  is_active: props.image.is_active ?? false
})

const handleUploadSuccess = (data) => {
  // URL already updated via v-model
}

const handleUploadError = (error) => {
  console.error('Upload failed:', error)
}

const submit = () => {
  form.put(`/admin/gallery/${props.image.id}`, {
    onSuccess: () => {
      // Redirect handled by controller
    }
  })
}
</script>
