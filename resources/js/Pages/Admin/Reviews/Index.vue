<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p class="text-muted-foreground">Manage Reviews</p>
          </div>
          <Link
            href="/admin/reviews/create"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus class="h-4 w-4 mr-2" />
            Add Review
          </Link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow">
        <div class="px-6 py-4 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">All Reviews</h2>
        </div>

        <div class="p-6">
          <div v-if="reviewItems.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">No reviews found. Add your first review to get started.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="review in reviewItems"
              :key="review.id"
              class="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div>
                  <h3 class="font-medium text-foreground">{{ review.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ review.content.substring(0, 100) }}...</p>
                  <div class="flex items-center space-x-2 mt-1">
                    <div class="flex items-center">
                      <span v-for="i in 5" :key="i" class="text-yellow-400">
                        <Star :class="i <= review.rating ? 'fill-current' : ''" class="h-4 w-4" />
                      </span>
                    </div>
                    <span :class="['px-2 py-1 text-xs rounded-full', review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                      {{ review.is_approved ? 'Approved' : 'Pending' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <Link
                  :href="`/admin/reviews/${review.id}`"
                  class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                >
                  View
                </Link>
                <Link
                  :href="`/admin/reviews/${review.id}/edit`"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </Link>
                <button
                  v-if="!review.is_approved"
                  @click="approveReview(review.id)"
                  class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  @click="deleteReview(review.id)"
                  class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import { Plus, Star } from 'lucide-vue-next'

const props = defineProps({
  reviews: { type: Array, default: () => [] }
})

const reviewItems = computed(() => props.reviews ?? [])

const approveReview = (id) => {
  if (confirm('Are you sure you want to approve this review?')) {
    router.patch(`/admin/reviews/${id}/approve`)
  }
}

const deleteReview = (id) => {
  if (confirm('Are you sure you want to delete this review?')) {
    router.delete(`/admin/reviews/${id}`)
  }
}
</script>
