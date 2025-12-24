<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Banner Details</h1>
            <p class="text-muted-foreground">View banner information</p>
          </div>
          <div class="flex space-x-2">
            <Link
              :href="`/admin/banners/${banner.id}/edit`"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit class="h-4 w-4 mr-2" />
              Edit
            </Link>
            <Link
              href="/admin/banners"
              class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft class="h-4 w-4 mr-2" />
              Back to Banners
            </Link>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow overflow-hidden">
        <!-- Banner Image -->
        <div v-if="banner.thumbnail_url" class="w-full h-64 bg-muted">
          <img :src="banner.thumbnail_url" :alt="banner.title" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Title</dt>
                  <dd class="text-foreground">{{ banner.title }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Message</dt>
                  <dd class="text-foreground">{{ banner.message || 'No message' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd>
                    <span :class="['px-2 py-1 text-xs rounded-full', banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                      {{ banner.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Display Order</dt>
                  <dd class="text-foreground">{{ banner.display_order }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Target Date</dt>
                  <dd class="text-foreground">{{ banner.target_date || 'Not set' }}</dd>
                </div>
              </dl>
            </div>

            <!-- Call to Action -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Call to Action</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Button Text</dt>
                  <dd class="text-foreground">{{ banner.cta_text || 'No button text' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Button URL</dt>
                  <dd class="text-foreground">
                    <a
                      v-if="typeof banner.cta_url === 'string' && banner.cta_url.trim().length > 0"
                      :href="banner.cta_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 underline"
                    >
                      {{ banner.cta_url }}
                    </a>
                    <span v-else>No button URL</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Media Links -->
          <div class="mt-8 pt-6 border-t border-border">
            <h3 class="text-lg font-semibold text-foreground mb-4">Media Links</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Trailer HLS URL</dt>
                <dd class="text-foreground break-words">{{ banner.trailer_url || 'Not set' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Thumbnail URL</dt>
                <dd class="text-foreground break-words">{{ banner.thumbnail_url || 'Not set' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Video URL</dt>
                <dd class="text-foreground break-words">{{ banner.video_url || 'Not set' }}</dd>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div class="mt-8 pt-6 border-t border-border">
            <h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Created</dt>
                <dd class="text-foreground">{{ formatDate(banner.created_at) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd class="text-foreground">{{ formatDate(banner.updated_at) }}</dd>
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
  banner: Object
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>
