<template>
  <div class="min-h-screen bg-background">
    <!-- Admin Navbar -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="text-xl font-bold text-foreground">Admin Dashboard</div>
          <nav class="flex items-center space-x-6">
            <a href="/admin" class="text-muted-foreground hover:text-foreground font-semibold transition-colors">Dashboard</a>
            <a href="/admin/banners" class="text-muted-foreground hover:text-foreground transition-colors">Banners</a>
            <a href="/admin/cast-crew" class="text-muted-foreground hover:text-foreground transition-colors">Cast & Crew</a>
            <a href="/admin/gallery" class="text-muted-foreground hover:text-foreground transition-colors">Gallery</a>
            <a href="/admin/reviews" class="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            <a href="/admin/page-content" class="text-muted-foreground hover:text-foreground transition-colors">Content</a>
            <form method="POST" action="/logout" class="inline">
              <button type="submit" class="text-red-500 hover:text-red-600 transition-colors">Logout</button>
            </form>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p class="text-muted-foreground">Overview of key metrics and analytics</p>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-card border border-border rounded-lg p-6 shadow-lg">
          <p class="text-sm text-muted-foreground mb-2">Total Users</p>
          <p class="text-3xl font-bold text-foreground">{{ metrics.totalUsers }}</p>
        </div>
        <div class="bg-card border border-border rounded-lg p-6 shadow-lg">
          <p class="text-sm text-muted-foreground mb-2">Total Revenue</p>
          <p class="text-3xl font-bold text-foreground">₵{{ metrics.totalRevenue }}</p>
        </div>
        <div class="bg-card border border-border rounded-lg p-6 shadow-lg">
          <p class="text-sm text-muted-foreground mb-2">Completed Payments</p>
          <p class="text-3xl font-bold text-green-500">{{ metrics.completedPayments }}</p>
        </div>
        <div class="bg-card border border-border rounded-lg p-6 shadow-lg">
          <p class="text-sm text-muted-foreground mb-2">Pending Payments</p>
          <p class="text-3xl font-bold text-yellow-500">{{ metrics.pendingPayments }}</p>
        </div>
      </div>

      <!-- Revenue Chart & Status -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-lg">
          <h2 class="text-xl font-semibold text-foreground mb-6">Recent Transactions</h2>
          <div v-if="recentPayments.length === 0" class="py-8 text-center text-muted-foreground">
            <p>No transactions yet.</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="border-b border-border">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">User</th>
                  <th class="px-4 py-3 text-left font-semibold">Amount</th>
                  <th class="px-4 py-3 text-left font-semibold">Status</th>
                  <th class="px-4 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in recentPayments.slice(0, 5)" :key="payment.id" class="border-b border-border hover:bg-muted/50 transition-colors">
                  <td class="px-4 py-3">{{ payment.user?.name || 'User #' + payment.user_id }}</td>
                  <td class="px-4 py-3 font-semibold">₵{{ (payment.amount / 100).toFixed(2) }}</td>
                  <td class="px-4 py-3">
                    <span :class="getStatusClass(payment.status)" class="px-2 py-1 rounded text-xs font-medium">
                      {{ payment.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs text-muted-foreground">{{ formatDate(payment.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-card border border-border rounded-lg p-6 shadow-lg">
          <h2 class="text-lg font-semibold text-foreground mb-4">Payment Status</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-border">
              <span class="text-sm text-muted-foreground">Completed</span>
              <span class="font-semibold text-green-500">{{ metrics.completedPayments }}</span>
            </div>
            <div class="flex items-center justify-between pb-3 border-b border-border">
              <span class="text-sm text-muted-foreground">Pending</span>
              <span class="font-semibold text-yellow-500">{{ metrics.pendingPayments }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Failed</span>
              <span class="font-semibold text-red-500">{{ metrics.failedPayments }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Banners Card -->
        <a href="/admin/banners" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-semibold text-foreground mb-2">Banners</h2>
          <p class="text-muted-foreground">Manage hero banners and promotional content</p>
        </a>

        <!-- Cast & Crew Card -->
        <a href="/admin/cast-crew" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-semibold text-foreground mb-2">Cast & Crew</h2>
          <p class="text-muted-foreground">Manage cast members and crew information</p>
        </a>

        <!-- Gallery Card -->
        <a href="/admin/gallery" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-semibold text-foreground mb-2">Gallery</h2>
          <p class="text-muted-foreground">Upload and manage gallery images</p>
        </a>

        <!-- Reviews Card -->
        <a href="/admin/reviews" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-semibold text-foreground mb-2">Reviews</h2>
          <p class="text-muted-foreground">Moderate and approve user reviews</p>
        </a>

        <!-- Page Content Card -->
        <a href="/admin/page-content" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-semibold text-foreground mb-2">Page Content</h2>
          <p class="text-muted-foreground">Edit page sections and content</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({
      totalUsers: 0,
      totalRevenue: '0',
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0
    })
  },
  recentPayments: {
    type: Array,
    default: () => []
  }
})

const metrics = computed(() => props.metrics ?? {
  totalUsers: 0,
  totalRevenue: '0',
  completedPayments: 0,
  pendingPayments: 0,
  failedPayments: 0
})

const recentPayments = computed(() => props.recentPayments ?? [])

const getStatusClass = (status) => {
  const classes = {
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    'initialized': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  }
  return classes[status] || classes['initialized']
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
