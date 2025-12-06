<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Gallery Image Details</h1>
            <p class="text-muted-foreground">View gallery image information</p>
          </div>
          <div class="flex space-x-2">
            <Link
              :href="`/admin/gallery/${gallery.id}/edit`"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit class="h-4 w-4 mr-2" />
              Edit
            </Link>
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
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow overflow-hidden">
        <!-- Gallery Image -->
        <div class="w-full h-96 bg-muted">
          <img :src="gallery.image_url" :alt="gallery.title" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Image Information</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Title</dt>
                  <dd class="text-foreground">{{ gallery.title }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Description</dt>
                  <dd class="text-foreground">{{ gallery.description || 'No description' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd>
                    <span :class="['px-2 py-1 text-xs rounded-full', gallery.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                      {{ gallery.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Display Order</dt>
                  <dd class="text-foreground">{{ gallery.display_order }}</dd>
                </div>
              </dl>
            </div>

            <!-- Image Details -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Image Details</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Image URL</dt>
                  <dd class="text-foreground break-all">
                    <a
                      :href="gallery.image_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 underline"
                    >
                      {{ gallery.image_url }}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="mt-8 pt-6 border-t border-border">
            <h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Created</dt>
                <dd class="text-foreground">{{ formatDate(gallery.created_at) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd class="text-foreground">{{ formatDate(gallery.updated_at) }}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
import { ArrowLeft, Edit } from 'lucide-vue-next'

defineProps({
  gallery: Object
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>
