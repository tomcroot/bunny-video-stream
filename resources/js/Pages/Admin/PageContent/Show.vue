<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">{{ content.title }}</h1>
            <p class="text-muted-foreground">Movie details</p>
          </div>
          <div class="flex space-x-2">
            <Link
              :href="`/admin/page-content/${content.id}/edit`"
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
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <!-- Poster -->
          <div class="md:col-span-1">
            <h3 class="text-lg font-semibold text-foreground mb-4">Poster</h3>
            <img
              v-if="content.poster"
              :src="content.poster"
              :alt="content.title"
              class="w-full h-auto rounded-lg shadow-lg"
            />
            <div v-else class="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <p class="text-muted-foreground">No poster image</p>
            </div>
          </div>

          <!-- Basic Info -->
          <div class="md:col-span-2">
            <h3 class="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Title</dt>
                <dd class="text-foreground text-lg font-semibold">{{ content.title }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-muted-foreground">Page Identifier</dt>
                <dd class="text-foreground">{{ content.page || 'N/A' }}</dd>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Release Year</dt>
                  <dd class="text-foreground">{{ content.year || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Rating</dt>
                  <dd class="text-foreground">{{ content.rating || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Runtime</dt>
                  <dd class="text-foreground">{{ content.runtime || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd>
                    <span :class="['px-2 py-1 text-xs rounded-full', content.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                      {{ content.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </div>
                <div class="col-span-2">
                  <dt class="text-sm font-medium text-muted-foreground">Movie Stream URL</dt>
                  <dd class="text-foreground break-all">
                    <template v-if="content.movie_url">
                      <a :href="content.movie_url" target="_blank" rel="noopener" class="text-blue-500 hover:underline">{{ content.movie_url }}</a>
                    </template>
                    <template v-else>
                      Not set
                    </template>
                  </dd>
                </div>
              </div>

              <div v-if="content.genres && content.genres.length">
                <dt class="text-sm font-medium text-muted-foreground mb-2">Genres</dt>
                <dd class="flex flex-wrap gap-2">
                  <span
                    v-for="genre in content.genres"
                    :key="genre"
                    class="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                  >
                    {{ genre }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Backdrop -->
        <div v-if="content.backdrop" class="mb-8">
          <h3 class="text-lg font-semibold text-foreground mb-4">Backdrop</h3>
          <div class="rounded-lg overflow-hidden">
            <img :src="content.backdrop" :alt="content.title + ' backdrop'" class="w-full h-auto" />
          </div>
        </div>

        <!-- Logline -->
        <div v-if="content.logline" class="mb-8">
          <h3 class="text-lg font-semibold text-foreground mb-4">Logline</h3>
          <div class="bg-muted p-4 rounded-lg">
            <p class="text-foreground">{{ content.logline }}</p>
          </div>
        </div>

        <!-- Synopsis -->
        <div v-if="content.synopsis" class="mb-8">
          <h3 class="text-lg font-semibold text-foreground mb-4">Synopsis</h3>
          <div class="bg-muted p-4 rounded-lg">
            <p class="text-foreground whitespace-pre-wrap">{{ content.synopsis }}</p>
          </div>
        </div>

        <!-- Timestamps -->
        <div class="pt-6 border-t border-border">
          <h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-muted-foreground">Created</dt>
              <dd class="text-foreground">{{ formatDate(content.created_at) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-muted-foreground">Last Updated</dt>
              <dd class="text-foreground">{{ formatDate(content.updated_at) }}</dd>
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
  content: Object
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>
