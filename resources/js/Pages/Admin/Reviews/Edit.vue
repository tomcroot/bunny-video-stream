<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Edit Review</h1>
            <p class="text-muted-foreground">Update review details</p>
          </div>
          <Link
            href="/admin/reviews"
            class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back to Reviews
          </Link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow p-6">
        <form @submit.prevent="submit">
          <div class="space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-foreground mb-2">
                Name *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <div v-if="form.errors.name" class="mt-1 text-sm text-red-600">
                {{ form.errors.name }}
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div v-if="form.errors.email" class="mt-1 text-sm text-red-600">
                {{ form.errors.email }}
              </div>
            </div>

            <!-- Content -->
            <div>
              <label for="content" class="block text-sm font-medium text-foreground mb-2">
                Review Content *
              </label>
              <textarea
                id="content"
                v-model="form.content"
                rows="4"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter the review content"
                required
              ></textarea>
              <div v-if="form.errors.content" class="mt-1 text-sm text-red-600">
                {{ form.errors.content }}
              </div>
            </div>

            <!-- Rating -->
            <div>
              <label for="rating" class="block text-sm font-medium text-foreground mb-2">
                Rating *
              </label>
              <select
                id="rating"
                v-model.number="form.rating"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select rating</option>
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Very Good</option>
                <option value="3">3 Stars - Good</option>
                <option value="2">2 Stars - Fair</option>
                <option value="1">1 Star - Poor</option>
              </select>
              <div v-if="form.errors.rating" class="mt-1 text-sm text-red-600">
                {{ form.errors.rating }}
              </div>
            </div>

            <!-- Is Approved -->
            <div class="flex items-center">
              <input
                id="is_approved"
                v-model="form.is_approved"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <label for="is_approved" class="ml-2 block text-sm text-foreground">
                Approved (visible on the website)
              </label>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4">
              <Link
                href="/admin/reviews"
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
                <span v-else>Update Review</span>
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
  review: { type: Object, default: () => ({}) }
})

const form = useForm({
  name: props.review?.name ?? '',
  email: props.review?.email ?? '',
  content: props.review?.content ?? '',
  rating: props.review?.rating ?? '',
  is_approved: props.review?.is_approved ?? false
})

const submit = () => {
  form.put(`/admin/reviews/${props.review?.id ?? ''}`, {
    onSuccess: () => {
      // Redirect handled by controller
    }
  })
}
</script>
