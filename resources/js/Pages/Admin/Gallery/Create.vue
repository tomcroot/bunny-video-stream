<template>
  <Head title="Add Gallery Image" />
  <AdminLayout>
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Add Gallery Image</h1>
            <p class="text-muted-foreground">Add a new image to the gallery</p>
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
                Image *
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
            </div>

            <!-- Manual URL Input (Optional) -->
            <div>
              <label for="image_url" class="block text-sm font-medium text-foreground mb-2">
                Or Enter Image URL
              </label>
              <input
                id="image_url"
                v-model="form.image_url"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/image.jpg"
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
                Lower numbers appear first. Leave empty for auto-ordering.
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
                <span v-if="form.processing">Adding...</span>
                <span v-else>Add Image</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ArrowLeft } from 'lucide-vue-next'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import ImageUpload from '@/components/ImageUpload.vue'

const form = useForm({
  title: '',
  description: '',
  image_url: '',
  category: 'behind-the-scenes',
  display_order: 0,
  is_active: true
})

const handleUploadSuccess = (data) => {
  // Image URL already set via v-model
  console.log('Upload successful:', data)
}

const handleUploadError = (error) => {
  console.error('Upload failed:', error)
}

const submit = () => {
  form.post('/admin/gallery', {
    onSuccess: () => {
      // Redirect handled by controller
    }
  })
}
</script>
