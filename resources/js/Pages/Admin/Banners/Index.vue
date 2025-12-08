<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p class="text-muted-foreground">Manage Banners</p>
          </div>
          <Link
            href="/admin/banners/create"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus class="h-4 w-4 mr-2" />
            Add Banner
          </Link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow">
        <div class="px-6 py-4 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">All Banners</h2>
        </div>

        <div class="p-6">
          <div v-if="banners.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">No banners found. Create your first banner to get started.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="banner in banners"
              :key="banner.id"
              class="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div v-if="banner.image_url" class="w-16 h-16 bg-muted rounded overflow-hidden">
                  <img :src="banner.image_url" :alt="banner.title" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 class="font-medium text-foreground">{{ banner.title }}</h3>
                  <p class="text-sm text-muted-foreground">{{ banner.message }}</p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span :class="['px-2 py-1 text-xs rounded-full', banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                      {{ banner.is_active ? 'Active' : 'Inactive' }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                      Order: {{ banner.display_order }}
                    </span>
                    <span v-if="banner.trailer_url" class="text-xs text-blue-600">Trailer set</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <Link
                  :href="`/admin/banners/${banner.id}`"
                  class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                >
                  View
                </Link>
                <Link
                  :href="`/admin/banners/${banner.id}/edit`"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </Link>
                <button
                  @click="deleteBanner(banner.id)"
                  class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
</template>

<script setup>
import { Link, router } from '@inertiajs/vue3'
import { Plus } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  banners: { type: Array, default: () => [] }
})

const banners = computed(() => props.banners ?? [])

const deleteBanner = (id) => {
  if (confirm('Are you sure you want to delete this banner?')) {
    router.delete(`/admin/banners/${id}`)
  }
}
</script>
