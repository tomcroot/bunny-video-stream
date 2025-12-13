<template>
  <Head title="Edit Cast/Crew Member" />
  <AdminLayout>
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Edit Cast/Crew Member</h1>
            <p class="text-muted-foreground">Update member details</p>
          </div>
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

    <!-- Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow p-6">
        <form @submit.prevent="submit">
          <div class="space-y-6">
            <!-- Stage Name -->
            <div>
              <label for="stage_name" class="block text-sm font-medium text-foreground mb-2">
                Stage Name *
              </label>
              <input
                id="stage_name"
                v-model="form.stage_name"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
                <div v-if="form.errors.stage_name" class="mt-1 text-sm text-red-600">
                  {{ form.errors.stage_name }}
              </div>
            </div>

            <!-- Real Name -->
            <div>
              <label for="real_name" class="block text-sm font-medium text-foreground mb-2">
                Real Name
              </label>
              <input
                id="real_name"
                v-model="form.real_name"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Optional - defaults to stage name"
              />
                <div v-if="form.errors.real_name" class="mt-1 text-sm text-red-600">
                  {{ form.errors.real_name }}
              </div>
            </div>

            <!-- Role Type -->
            <div>
              <label for="role_type" class="block text-sm font-medium text-foreground mb-2">
                Role Type *
              </label>
              <select
                id="role_type"
                v-model="form.role_type"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select role type</option>
                <option value="cast">Cast</option>
                <option value="crew">Crew</option>
              </select>
                <div v-if="form.errors.role_type" class="mt-1 text-sm text-red-600">
                  {{ form.errors.role_type }}
              </div>
            </div>

            <!-- Job Title -->
            <div>
              <label for="job_title" class="block text-sm font-medium text-foreground mb-2">
                Job Title/Role *
              </label>
              <input
                id="job_title"
                v-model="form.job_title"
                type="text"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Lead Actor, Director, Producer"
                required
              />
                <div v-if="form.errors.job_title" class="mt-1 text-sm text-red-600">
                  {{ form.errors.job_title }}
              </div>
            </div>

            <!-- Bio -->
            <div>
              <label for="bio" class="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                v-model="form.bio"
                rows="4"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Brief biography or description"
              ></textarea>
                <div v-if="form.errors.bio" class="mt-1 text-sm text-red-600">
                  {{ form.errors.bio }}
              </div>
            </div>

            <!-- Image URL -->
            <div>
              <label for="image_url" class="block text-sm font-medium text-foreground mb-2">
                Image URL
              </label>
              <input
                id="image_url"
                v-model="form.image_url"
                type="url"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/photo.jpg"
              />
                <div v-if="form.errors.image_url" class="mt-1 text-sm text-red-600">
                  {{ form.errors.image_url }}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                Enter the URL of the member's photo. If left empty, a placeholder will be used.
              </p>
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
              <p class="mt-1 text-sm text-muted-foreground">
                Lower numbers appear first.
              </p>
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
                href="/admin/cast-crew"
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
                  <span v-else>Update Member</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ArrowLeft } from 'lucide-vue-next'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  member: { type: Object, default: () => ({}) }
})

const form = useForm({
  stage_name: props.member.stage_name || '',
  real_name: props.member.real_name || '',
  role_type: props.member.role_type || '',
  job_title: props.member.job_title || '',
  bio: props.member.bio || '',
  image_url: props.member.image_url || '',
  referral_code: props.member.referral_code || '',
  display_order: props.member.display_order || 0,
  is_active: props.member.is_active ?? true
})

const submit = () => {
  if (!props.member?.id) return
  form.put(`/admin/cast-crew/${props.member.id}`)
}
</script>
