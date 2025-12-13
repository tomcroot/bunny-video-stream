<template>
  <AdminLayout>
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Movie Details</h1>
            <p class="text-muted-foreground">Manage movie information for the information page</p>
          </div>
          <Link
            href="/admin/page-content/create"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus class="h-4 w-4 mr-2" />
            Add Movie
          </Link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="movies.length === 0" class="text-center py-8">
        <p class="text-muted-foreground">No movie details found. Add your first movie to get started.</p>
      </div>

      <div v-else class="grid gap-6">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="bg-card rounded-lg shadow border border-border overflow-hidden"
        >
          <div class="grid md:grid-cols-4 gap-4 p-6">
            <!-- Poster -->
            <div class="md:col-span-1">
              <img
                v-if="movie.poster"
                :src="movie.poster"
                :alt="movie.title"
                class="w-full h-auto rounded object-cover"
              />
              <div v-else class="w-full h-40 bg-muted rounded flex items-center justify-center">
                <p class="text-muted-foreground text-sm">No poster</p>
              </div>
            </div>

            <!-- Details -->
            <div class="md:col-span-2">
              <h3 class="font-bold text-lg text-foreground mb-2">{{ movie.title }}</h3>

              <div class="flex flex-wrap gap-2 mb-3">
                <span :class="['px-2 py-1 text-xs rounded-full', movie.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                  {{ movie.is_active ? 'Active' : 'Inactive' }}
                </span>
                <span v-if="movie.rating" class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {{ movie.rating }}
                </span>
                <span v-if="movie.year" class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  {{ movie.year }}
                </span>
              </div>

              <p v-if="movie.logline" class="text-sm text-muted-foreground mb-3">
                {{ truncate(movie.logline, 120) }}
              </p>

              <div v-if="movie.genres && movie.genres.length" class="text-xs text-muted-foreground">
                <strong>Genres:</strong> {{ movie.genres.join(', ') }}
              </div>

              <div class="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                <span v-if="movie.runtime">⏱ {{ movie.runtime }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="md:col-span-1 flex flex-col items-end justify-center space-y-2">
              <Link
                :href="`/admin/page-content/${movie.id}`"
                class="w-full px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors text-center"
              >
                View
              </Link>
              <Link
                :href="`/admin/page-content/${movie.id}/edit`"
                class="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
              >
                Edit
              </Link>
              <button
                @click="deleteMovie(movie.id)"
                class="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { Link, router } from '@inertiajs/vue3'
import { Plus } from 'lucide-vue-next'
import { computed } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  content: { type: Array, default: () => [] }
})

const movies = computed(() => props.content ?? [])

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const deleteMovie = (id) => {
  if (confirm('Are you sure you want to delete this movie?')) {
    router.delete(`/admin/page-content/${id}`)
  }
}
</script>
