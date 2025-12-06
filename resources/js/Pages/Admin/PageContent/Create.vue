<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Add Page Content</h1>
            <p class="text-muted-foreground">Add new content to a page</p>
          </div>
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

            <!-- Page -->
            <div>
              <label for="page" class="block text-sm font-medium text-foreground mb-2">
                Page *
              </label>
              <select
                id="page"
                v-model="form.page"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select page</option>
                <option value="home">Home</option>
                <option value="about">About</option>
                <option value="contact">Contact</option>
                <option value="gallery">Gallery</option>
                <option value="credits">Credits</option>
              </select>
              <div v-if="form.errors.page" class="mt-1 text-sm text-red-600">
                {{ form.errors.page }}
              </div>
            </div>

            <!-- Section -->
            <div>
              <label for="section" class="block text-sm font-medium text-foreground mb-2">
                Section *
              </label>
              <input
                id="section"
                v-model="form.section"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., hero, about, footer"
                required
              />
              <div v-if="form.errors.section" class="mt-1 text-sm text-red-600">
                {{ form.errors.section }}
              </div>
            </div>

            <!-- Content -->
            <div>
              <label for="content" class="block text-sm font-medium text-foreground mb-2">
                Content *
              </label>
              <textarea
                id="content"
                v-model="form.content"
                rows="6"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter the content for this section"
                required
              ></textarea>
              <div v-if="form.errors.content" class="mt-1 text-sm text-red-600">
                {{ form.errors.content }}
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
                Active (visible on the website)
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
                <span v-else>Add Content</span>
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

const form = useForm({
  title: '',
  page: '',
  section: '',
  content: '',
  display_order: 0,
  is_active: true
})

const submit = () => {
  form.post('/admin/page-content', {
    onSuccess: () => {
      // Redirect handled by controller
    }
  })
}
</script>
