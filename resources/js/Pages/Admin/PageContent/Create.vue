<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Add Movie Details</h1>
            <p class="text-muted-foreground">Add movie information that appears on the information page</p>
          </div>
          <Link
            href="/admin/page-content"
            class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back to Movie Details
          </Link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow p-6">
        <form @submit.prevent="submit">
          <div class="space-y-6">
            <!-- Page Key -->
            <div>
              <label for="page" class="block text-sm font-medium text-foreground mb-2">
                Page Identifier *
              </label>
              <input
                id="page"
                v-model="form.page"
                type="text"
                list="page-options"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="watch"
                required
              />
              <datalist id="page-options">
                <option value="watch"></option>
                <option value="home"></option>
                <option value="details"></option>
                <option value="information"></option>
              </datalist>
              <div v-if="form.errors.page" class="mt-1 text-sm text-red-600">
                {{ form.errors.page }}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                Use <strong>watch</strong> for the streaming page or specify another unique key.
              </p>
            </div>

            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-foreground mb-2">
                Movie Title *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., A Crazy Day in Accra"
                required
              />
              <div v-if="form.errors.title" class="mt-1 text-sm text-red-600">
                {{ form.errors.title }}
              </div>
            </div>

            <!-- Poster URL -->
            <div>
              <label for="poster" class="block text-sm font-medium text-foreground mb-2">
                Poster URL
              </label>
              <input
                id="poster"
                v-model="form.poster"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="/movie_poster.jpg"
              />
              <div v-if="form.errors.poster" class="mt-1 text-sm text-red-600">
                {{ form.errors.poster }}
              </div>
            </div>

            <!-- Backdrop URL -->
            <div>
              <label for="backdrop" class="block text-sm font-medium text-foreground mb-2">
                Backdrop URL
              </label>
              <input
                id="backdrop"
                v-model="form.backdrop"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="/movie_poster_2.jpg"
              />
              <div v-if="form.errors.backdrop" class="mt-1 text-sm text-red-600">
                {{ form.errors.backdrop }}
              </div>
            </div>

            <!-- Movie URL -->
            <div>
              <label for="movie_url" class="block text-sm font-medium text-foreground mb-2">
                Movie Stream URL
              </label>
              <input
                id="movie_url"
                v-model="form.movie_url"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://vz-.../playlist.m3u8"
              />
              <div v-if="form.errors.movie_url" class="mt-1 text-sm text-red-600">
                {{ form.errors.movie_url }}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                Provide the secure HLS playlist URL for the full feature. Required for the watch page.
              </p>
            </div>

            <!-- Logline -->
            <div>
              <label for="logline" class="block text-sm font-medium text-foreground mb-2">
                Logline
              </label>
              <textarea
                id="logline"
                v-model="form.logline"
                rows="2"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="A one-line summary of the film"
              ></textarea>
              <div v-if="form.errors.logline" class="mt-1 text-sm text-red-600">
                {{ form.errors.logline }}
              </div>
            </div>

            <!-- Synopsis -->
            <div>
              <label for="synopsis" class="block text-sm font-medium text-foreground mb-2">
                Synopsis
              </label>
              <textarea
                id="synopsis"
                v-model="form.synopsis"
                rows="5"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Full description of the film"
              ></textarea>
              <div v-if="form.errors.synopsis" class="mt-1 text-sm text-red-600">
                {{ form.errors.synopsis }}
              </div>
            </div>

            <!-- Rating -->
            <div>
              <label for="rating" class="block text-sm font-medium text-foreground mb-2">
                Rating
              </label>
              <select
                id="rating"
                v-model="form.rating"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select rating</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="16+">16+</option>
                <option value="18+">18+</option>
              </select>
              <div v-if="form.errors.rating" class="mt-1 text-sm text-red-600">
                {{ form.errors.rating }}
              </div>
            </div>

            <!-- Runtime -->
            <div>
              <label for="runtime" class="block text-sm font-medium text-foreground mb-2">
                Runtime
              </label>
              <input
                id="runtime"
                v-model="form.runtime"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 1h 45m"
              />
              <div v-if="form.errors.runtime" class="mt-1 text-sm text-red-600">
                {{ form.errors.runtime }}
              </div>
            </div>

            <!-- Year -->
            <div>
              <label for="year" class="block text-sm font-medium text-foreground mb-2">
                Release Year
              </label>
              <input
                id="year"
                v-model="form.year"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="2025"
              />
              <div v-if="form.errors.year" class="mt-1 text-sm text-red-600">
                {{ form.errors.year }}
              </div>
            </div>

            <!-- Genres -->
            <div>
              <label for="genres" class="block text-sm font-medium text-foreground mb-2">
                Genres (comma-separated)
              </label>
              <input
                id="genres"
                v-model="genresInput"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Thriller, Drama, Comedy"
              />
              <div v-if="form.errors.genres" class="mt-1 text-sm text-red-600">
                {{ form.errors.genres }}
              </div>
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
                Active (visible on the information page)
              </label>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <Link
                href="/admin/page-content"
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
                <span v-else>Add Movie Details</span>
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
import { ref, watch } from 'vue'

const genresInput = ref('')

const form = useForm({
  page: 'watch',
  title: '',
  poster: '',
  backdrop: '',
  synopsis: '',
  logline: '',
  rating: '',
  runtime: '',
  year: '',
  genres: [],
  movie_url: '',
  is_active: true
})

// Convert comma-separated string to array
watch(genresInput, (newVal) => {
  form.genres = newVal.split(',').map(g => g.trim()).filter(g => g)
})

const submit = () => {
  form.post('/admin/page-content', {
    onSuccess: () => {
      // Redirect handled by controller
    }
  })
}
</script>
