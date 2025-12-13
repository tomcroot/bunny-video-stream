<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Edit Movie Details</h1>
            <p class="text-muted-foreground">Update movie information</p>
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
                This key must stay unique and should be <strong>watch</strong> for the streaming page content.
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

            <!-- Poster Upload -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Poster Image
              </label>
              <ImageUpload
                v-model="form.poster"
                folder="posters"
                alt="Movie poster"
                @upload-success="(data) => handleUploadSuccess('poster', data.url)"
                @upload-error="handleUploadError"
              />
              <div v-if="form.errors.poster" class="mt-1 text-sm text-red-600">
                {{ form.errors.poster }}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                Upload a poster image or enter URL manually below.
              </p>
              <!-- Manual URL Input -->
              <input
                v-model="form.poster"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                placeholder="Or paste image URL..."
              />
            </div>

            <!-- Backdrop Upload -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                Backdrop Image
              </label>
              <ImageUpload
                v-model="form.backdrop"
                folder="posters"
                alt="Movie backdrop"
                @upload-success="(data) => handleUploadSuccess('backdrop', data.url)"
                @upload-error="handleUploadError"
              />
              <div v-if="form.errors.backdrop" class="mt-1 text-sm text-red-600">
                {{ form.errors.backdrop }}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                Upload a backdrop image or enter URL manually below.
              </p>
              <!-- Manual URL Input -->
              <input
                v-model="form.backdrop"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                placeholder="Or paste image URL..."
              />
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
                Provide the secure HLS playlist URL for playback. Required for the watch page to stream the film.
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

            <!-- Sponsors Section -->
            <div class="border-t border-border pt-6">
              <h3 class="text-lg font-semibold text-foreground mb-4">Sponsors</h3>
              <div class="space-y-4">
                <div v-for="(sponsor, index) in form.sponsors" :key="index" class="p-4 border border-border rounded-md bg-muted/20">
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-foreground">Sponsor {{ index + 1 }}</span>
                    <button
                      type="button"
                      @click="removeSponsor(index)"
                      class="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="space-y-3">
                    <!-- Sponsor Name -->
                    <div>
                      <label class="block text-sm font-medium text-foreground mb-1">
                        Sponsor Name *
                      </label>
                      <input
                        v-model="sponsor.name"
                        type="text"
                        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., ABC Company"
                        required
                      />
                    </div>

                    <!-- Sponsor Logo -->
                    <div>
                      <label class="block text-sm font-medium text-foreground mb-1">
                        Logo
                      </label>
                      <ImageUpload
                        v-model="sponsor.logo_url"
                        folder="sponsors"
                        alt="Sponsor logo"
                        @upload-success="(data) => sponsor.logo_url = data.url"
                        @upload-error="handleUploadError"
                      />
                      <!-- Manual URL Input -->
                      <input
                        v-model="sponsor.logo_url"
                        type="url"
                        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                        placeholder="Or paste logo URL..."
                      />
                    </div>

                    <!-- Website URL -->
                    <div>
                      <label class="block text-sm font-medium text-foreground mb-1">
                        Website URL
                      </label>
                      <input
                        v-model="sponsor.website_url"
                        type="url"
                        class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                <!-- Add Sponsor Button -->
                <button
                  type="button"
                  @click="addSponsor"
                  class="w-full px-4 py-2 border-2 border-dashed border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  + Add Sponsor
                </button>
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
                <span v-if="form.processing">Updating...</span>
                <span v-else>Update Movie Details</span>
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
import ImageUpload from '@/components/ImageUpload.vue'

const props = defineProps({
  content: { type: Object, default: () => ({}) }
})

const genresInput = ref((props.content.genres || []).join(', '))

const form = useForm({
  page: props.content.page || 'watch',
  title: props.content.title || '',
  poster: props.content.poster || '',
  backdrop: props.content.backdrop || '',
  synopsis: props.content.synopsis || '',
  logline: props.content.logline || '',
  rating: props.content.rating || '',
  runtime: props.content.runtime || '',
  year: props.content.year || '',
  genres: props.content.genres || [],
  movie_url: props.content.movie_url || '',
  sponsors: props.content.sponsors || [],
  is_active: props.content.is_active ?? true
})

// Convert comma-separated string to array
watch(genresInput, (newVal) => {
  form.genres = newVal.split(',').map(g => g.trim()).filter(g => g)
})

const addSponsor = () => {
  form.sponsors.push({
    name: '',
    logo_url: '',
    website_url: ''
  })
}

const removeSponsor = (index) => {
  form.sponsors.splice(index, 1)
}

const handleUploadSuccess = (field, url) => {
  form[field] = url
}

const handleUploadError = (error) => {
  console.error('Upload failed:', error)
}

const submit = () => {
  if (!props.content?.id) return
  form.put(`/admin/page-content/${props.content.id}`)
}
</script>
