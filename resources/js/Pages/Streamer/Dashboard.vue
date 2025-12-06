<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Welcome, {{ user.name }}!</h1>
            <p class="text-muted-foreground">Your streaming dashboard</p>
          </div>
          <Link href="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Profile Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <p class="text-sm text-muted-foreground mb-2">Account Status</p>
          <p class="text-2xl font-bold text-foreground">{{ user.email }}</p>
          <p class="text-xs text-muted-foreground mt-2">Member since {{ formatDate(user.created_at) }}</p>
        </div>

        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <p class="text-sm text-muted-foreground mb-2">Phone</p>
          <p class="text-2xl font-bold text-foreground">{{ user.phone_number || 'Not provided' }}</p>
          <p v-if="user.phone_number" class="text-xs text-green-600 mt-2">✓ Verified</p>
        </div>

        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <p class="text-sm text-muted-foreground mb-2">Access Level</p>
          <p class="text-2xl font-bold text-green-600">Active</p>
          <p class="text-xs text-muted-foreground mt-2">Full streaming access</p>
        </div>
      </div>

      <!-- Featured Content Section -->
      <div class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-foreground mb-1">Featured Content</h2>
            <p class="text-sm text-muted-foreground">Start watching or continue from where you left off</p>
          </div>
          <Link href="/" class="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            View All
          </Link>
        </div>

        <div v-if="featured.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in featured"
            :key="item.id"
            class="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div class="aspect-video bg-muted relative overflow-hidden group">
              <img
                v-if="item.image_url"
                :src="item.image_url"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  @click="watchItem(item)"
                  class="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </button>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-foreground mb-1">{{ item.title }}</h3>
              <p class="text-sm text-muted-foreground line-clamp-2">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-muted-foreground">No content available yet.</p>
        </div>
      </div>

      <!-- Profile Management -->
      <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
        <div class="space-y-4">
          <Link
            href="/profile"
            class="block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <p class="font-medium text-foreground">Edit Profile</p>
            <p class="text-sm text-muted-foreground">Update your personal information</p>
          </Link>
          <Link
            href="/profile/payments"
            class="block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <p class="font-medium text-foreground">Payment History</p>
            <p class="text-sm text-muted-foreground">View your transactions</p>
          </Link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      phone_number: '',
      created_at: new Date()
    })
  },
  featured: {
    type: Array,
    default: () => []
  }
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const watchItem = (item) => {
  // For now, redirect to home. In full implementation, this would check payment status
  window.location.href = `/?featured=${item.id}`
}
</script>
