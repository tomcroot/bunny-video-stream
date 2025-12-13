<template>
  <AdminLayout>
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Manage Gallery</h1>
            <p class="text-muted-foreground">Behind the scenes photos</p>
          </div>
          <Link
            href="/admin/gallery/create"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus class="h-4 w-4 mr-2" />
            Add Image
          </Link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow">
        <div class="px-6 py-4 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">Gallery Images</h2>
        </div>

        <div class="p-6">
          <div v-if="galleryItems.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">No gallery images found. Add your first image to get started.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="image in galleryItems"
              :key="image.id"
              class="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
            >
              <div class="aspect-video bg-muted">
                <img
                  :src="image.image_url"
                  :alt="image.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="p-4">
                <h3 class="font-medium text-foreground mb-2">{{ image.title }}</h3>
                <p class="text-sm text-muted-foreground mb-3">{{ image.description }}</p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span :class="['px-2 py-1 text-xs rounded-full', image.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                      {{ image.is_active ? 'Active' : 'Inactive' }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                      Order: {{ image.display_order }}
                    </span>
                  </div>

                  <div class="flex space-x-2">
                    <Link
                      :href="`/admin/gallery/${image.id}`"
                      class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      :href="`/admin/gallery/${image.id}/edit`"
                      class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>

                <div class="mt-3">
                  <button
                    @click="deleteImage(image.id)"
                    class="w-full px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import { Plus } from 'lucide-vue-next'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  gallery: { type: Array, default: () => [] }
})

const galleryItems = computed(() => props.gallery ?? [])

const deleteImage = (id) => {
  if (confirm('Are you sure you want to delete this gallery image?')) {
    router.delete(`/admin/gallery/${id}`)
  }
}
</script>
