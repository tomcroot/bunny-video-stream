<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Cast/Crew Member Details</h1>
            <p class="text-muted-foreground">View member information</p>
          </div>
          <div class="flex space-x-2">
            <Link
              :href="`/admin/cast-crew/${castCrew.id}/edit`"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit class="h-4 w-4 mr-2" />
              Edit
            </Link>
            <Link
              href="/admin/cast-crew"
              class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft class="h-4 w-4 mr-2" />
              Back to Cast & Crew
            </Link>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow overflow-hidden">
        <!-- Member Photo -->
        <div class="w-full h-96 bg-muted">
          <img :src="castCrew.photo_url || '/placeholder-avatar.jpg'" :alt="castCrew.name" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Member Information</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd class="text-foreground">{{ castCrew.name }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Role Type</dt>
                  <dd>
                    <span :class="['px-2 py-1 text-xs rounded-full', castCrew.role_type === 'cast' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800']">
                      {{ castCrew.role_type === 'cast' ? 'Cast' : 'Crew' }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Role/Position</dt>
                  <dd class="text-foreground">{{ castCrew.role }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Bio</dt>
                  <dd class="text-foreground">{{ castCrew.bio || 'No bio available' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd>
                    <span :class="['px-2 py-1 text-xs rounded-full', castCrew.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                      {{ castCrew.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Display Order</dt>
                  <dd class="text-foreground">{{ castCrew.display_order }}</dd>
                </div>
              </dl>
            </div>

            <!-- Photo Details -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">Photo Details</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Photo URL</dt>
                  <dd class="text-foreground break-all">
                    <a
                      v-if="castCrew.photo_url"
                      :href="castCrew.photo_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 underline"
                    >
                      {{ castCrew.photo_url }}
                    </a>
                    <span v-else class="text-muted-foreground">No photo URL</span>
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
                <dd class="text-foreground">{{ formatDate(castCrew.created_at) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd class="text-foreground">{{ formatDate(castCrew.updated_at) }}</dd>
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
  castCrew: Object
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>
