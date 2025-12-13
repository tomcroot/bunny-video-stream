<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Edit Banner</h1>
            <p class="text-muted-foreground">Update banner details</p>
          </div>
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

    <!-- Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow p-6">
        <form @submit.prevent="submit">
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <div v-if="form.errors.title" class="mt-1 text-sm text-red-600">
                {{ form.errors.title }}
              </div>
            </div>

            <!-- Message / Description -->
            <div>
              <label for="message" class="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="3"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Short copy shown on the hero"
              ></textarea>
              <div v-if="form.errors.message" class="mt-1 text-sm text-red-600">
                {{ form.errors.message }}
              </div>
            </div>

            <!-- Hero Trailer URL (HLS) -->
            <div>
              <label for="trailer_url" class="block text-sm font-medium text-foreground mb-2">
                Trailer HLS URL
              </label>
              <input
                id="trailer_url"
                v-model="form.trailer_url"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://.../playlist.m3u8"
              />
              <p class="mt-1 text-xs text-muted-foreground">Bunny CDN HLS playlist for the trailer video.</p>
              <div v-if="form.errors.trailer_url" class="mt-1 text-sm text-red-600">
                {{ form.errors.trailer_url }}
              </div>
            </div>

            <!-- Thumbnail URL -->
            <div>
              <label for="thumbnail_url" class="block text-sm font-medium text-foreground mb-2">
                Thumbnail Image URL
              </label>
              <input
                id="thumbnail_url"
                v-model="form.thumbnail_url"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://.../thumb.jpg"
              />
              <p class="mt-1 text-xs text-muted-foreground">Shown when trailer ends or as fallback.</p>
              <div v-if="form.errors.thumbnail_url" class="mt-1 text-sm text-red-600">
                {{ form.errors.thumbnail_url }}
              </div>
            </div>

            <!-- Button Text -->
            <div>
              <label for="cta_text" class="block text-sm font-medium text-foreground mb-2">
                Button Text
              </label>
              <input
                id="cta_text"
                v-model="form.cta_text"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Watch Now"
              />
              <div v-if="form.errors.cta_text" class="mt-1 text-sm text-red-600">
                {{ form.errors.cta_text }}
              </div>
            </div>

            <!-- Button URL -->
            <div>
              <label for="cta_url" class="block text-sm font-medium text-foreground mb-2">
                Button URL
              </label>
              <input
                id="cta_url"
                v-model="form.cta_url"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com"
              />
              <div v-if="form.errors.cta_url" class="mt-1 text-sm text-red-600">
                {{ form.errors.cta_url }}
              </div>
            </div>

            <!-- Target Date -->
            <div>
              <label for="target_date" class="block text-sm font-medium text-foreground mb-2">
                Target Date
              </label>
              <input
                id="target_date"
                v-model="form.target_date"
                type="datetime-local"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div v-if="form.errors.target_date" class="mt-1 text-sm text-red-600">
                {{ form.errors.target_date }}
              </div>
            </div>

            <!-- Display Order -->
            <div>
              <label for="display_order" class="block text-sm font-medium text-foreground mb-2">
                Display Order
              </label>
              <input
                id="display_order"
                v-model.number="form.display_order"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div v-if="form.errors.display_order" class="mt-1 text-sm text-red-600">
                {{ form.errors.display_order }}
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
                Active
              </label>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <Link
                href="/admin/banners"
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
                <span v-else>Update Banner</span>
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

const props = defineProps({
  banner: { type: Object, default: () => ({}) }
})

const form = useForm({
  title: props.banner.title || '',
  message: props.banner.message || '',
  trailer_url: props.banner.trailer_url || '',
  thumbnail_url: props.banner.thumbnail_url || '',
  cta_text: props.banner.cta_text || '',
  cta_url: props.banner.cta_url || '',
  target_date: props.banner.target_date ? props.banner.target_date.replace(' ', 'T') : '',
  display_order: props.banner.display_order || 0,
  is_active: props.banner.is_active ?? true
})

const submit = () => {
  if (!props.banner?.id) return

  form.put(`/admin/banners/${props.banner.id}`)
}
</script>
