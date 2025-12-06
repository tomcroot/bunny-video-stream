<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Page Content Details</h1>
            <p class="text-muted-foreground">View content information</p>
          </div>
          <div class="flex space-x-2">
            <Link
              :href="`/admin/page-content/${pageContent.id}/edit`"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit class="h-4 w-4 mr-2" />
              Edit
            </Link>
            <Link
              href="/admin/page-content"
              class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft class="h-4 w-4 mr-2" />
              Back to Page Content
            </Link>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-lg font-semibold text-foreground mb-4">Content Information</h3>
            <dl class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Title</dt>
                <dd class="text-foreground">{{ pageContent.title }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Page</dt>
                <dd class="text-foreground capitalize">{{ pageContent.page }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Section</dt>
                <dd class="text-foreground">{{ pageContent.section }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Status</dt>
                <dd>
                  <span :class="['px-2 py-1 text-xs rounded-full', pageContent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ pageContent.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Display Order</dt>
                <dd class="text-foreground">{{ pageContent.display_order }}</dd>
              </div>
            </dl>
          </div>

          <!-- Content -->
          <div>
            <h3 class="text-lg font-semibold text-foreground mb-4">Content</h3>
            <div class="bg-muted p-4 rounded-md">
              <div class="prose prose-sm max-w-none text-foreground" v-html="pageContent.content"></div>
            </div>
          </div>
        </div>

        <!-- Timestamps -->
        <div class="mt-8 pt-6 border-t border-border">
          <h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-muted-foreground">Created</dt>
              <dd class="text-foreground">{{ formatDate(pageContent.created_at) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-muted-foreground">Last Updated</dt>
              <dd class="text-foreground">{{ formatDate(pageContent.updated_at) }}</dd>
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
  pageContent: Object
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>
