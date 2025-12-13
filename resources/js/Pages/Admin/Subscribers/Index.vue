<template>
  <AdminLayout>
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Users & Subscribers</h1>
            <p class="text-muted-foreground">All registered users and their payment status</p>
          </div>
          <a
            :href="route('admin.subscribers.export')"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Download class="h-4 w-4 mr-2" />
            Export CSV
          </a>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Total Users -->
        <div class="bg-card rounded-lg shadow border border-border p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Total Users</p>
              <p class="text-2xl font-bold text-foreground">{{ stats.total_users }}</p>
            </div>
          </div>
        </div>

        <!-- Paid Users -->
        <div class="bg-card rounded-lg shadow border border-border p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Paid Users</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.paid_users }}</p>
            </div>
          </div>
        </div>

        <!-- Unpaid Users -->
        <div class="bg-card rounded-lg shadow border border-border p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Waiting / Unpaid</p>
              <p class="text-2xl font-bold text-amber-600">{{ stats.unpaid_users }}</p>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-card rounded-lg shadow border border-border p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Total Revenue</p>
              <p class="text-2xl font-bold text-purple-600">₵{{ formatAmount(stats.total_revenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-card rounded-lg shadow border border-border p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email, or phone..."
                class="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                @keyup.enter="applyFilters"
              />
            </div>
          </div>

          <!-- Filter Buttons -->
          <div class="flex gap-2">
            <button
              @click="setFilter('all')"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                filters.filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              ]"
            >
              All Users
            </button>
            <button
              @click="setFilter('paid')"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                filters.filter === 'paid' ? 'bg-green-600 text-white' : 'bg-muted text-foreground hover:bg-muted/80'
              ]"
            >
              Paid
            </button>
            <button
              @click="setFilter('unpaid')"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                filters.filter === 'unpaid' ? 'bg-amber-600 text-white' : 'bg-muted text-foreground hover:bg-muted/80'
              ]"
            >
              Waiting / Unpaid
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-card rounded-lg shadow border border-border">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 class="text-lg font-semibold text-foreground">Registered Users</h2>
          <p class="text-sm text-muted-foreground">
            Showing {{ users.data.length }} of {{ users.total }} users
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-muted/50 border-b border-border">
              <tr>
                <th class="px-4 py-3 text-left font-semibold">User</th>
                <th class="px-4 py-3 text-left font-semibold">Phone</th>
                <th class="px-4 py-3 text-left font-semibold">Payment Status</th>
                <th class="px-4 py-3 text-left font-semibold">Latest Payment</th>
                <th class="px-4 py-3 text-left font-semibold">Subscription</th>
                <th class="px-4 py-3 text-left font-semibold">Registered</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="users.data.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-muted-foreground">
                  <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No users found matching your criteria.</p>
                </td>
              </tr>
              <tr
                v-for="user in users.data"
                :key="user.id"
                class="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <!-- User Info -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span class="text-sm font-medium text-primary">{{ getInitials(user.name) }}</span>
                    </div>
                    <div>
                      <p class="font-medium text-foreground">{{ user.name || 'No Name' }}</p>
                      <p class="text-xs text-muted-foreground">{{ user.email || 'No email' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Phone -->
                <td class="px-4 py-3">
                  <span v-if="user.phone_number" class="text-foreground">{{ user.phone_number }}</span>
                  <span v-else class="text-muted-foreground">—</span>
                </td>

                <!-- Payment Status -->
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                      user.has_paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    ]"
                  >
                    <CheckCircle v-if="user.has_paid" class="w-3 h-3" />
                    <Clock v-else class="w-3 h-3" />
                    {{ user.has_paid ? `Paid (${user.payment_count}x)` : 'Waiting' }}
                  </span>
                </td>

                <!-- Latest Payment -->
                <td class="px-4 py-3">
                  <div v-if="user.latest_payment">
                    <p class="font-medium text-foreground">₵{{ formatAmount(user.latest_payment.amount) }}</p>
                    <p class="text-xs text-muted-foreground">{{ user.latest_payment.reference }}</p>
                  </div>
                  <span v-else class="text-muted-foreground">—</span>
                </td>

                <!-- Subscription -->
                <td class="px-4 py-3">
                  <div v-if="user.subscription">
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        user.subscription.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      ]"
                    >
                      {{ user.subscription.is_active ? 'Active' : 'Expired' }}
                    </span>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ user.subscription.is_active ? 'Expires' : 'Expired' }}: {{ formatDate(user.subscription.expires_at) }}
                    </p>
                  </div>
                  <span v-else class="text-muted-foreground">—</span>
                </td>

                <!-- Registered -->
                <td class="px-4 py-3">
                  <p class="text-sm text-foreground">{{ formatDate(user.created_at) }}</p>
                  <p v-if="user.email_verified" class="text-xs text-green-600">✓ Verified</p>
                  <p v-else class="text-xs text-amber-600">⚠ Unverified</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-border" v-if="users.links?.length > 3">
          <div class="text-sm text-muted-foreground">
            Page {{ users.current_page }} of {{ users.last_page }}
          </div>
          <div class="flex items-center gap-2">
            <Link
              v-for="link in users.links"
              :key="link.label"
              :href="link.url || '#'"
              class="px-3 py-1 rounded border border-border text-sm"
              :class="{
                'bg-primary text-primary-foreground border-primary': link.active,
                'text-muted-foreground cursor-not-allowed opacity-50': !link.url,
                'hover:bg-muted': link.url && !link.active,
              }"
              v-html="link.label"
              :preserve-scroll="true"
            />
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import { Users, CheckCircle, Clock, DollarSign, Download, Search } from 'lucide-vue-next'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  users: { type: Object, required: true },
  stats: { type: Object, required: true },
  filters: { type: Object, default: () => ({ search: '', filter: 'all' }) },
})

const searchQuery = ref(props.filters.search || '')

const formatAmount = (amount) => {
  if (!amount) return '0.00'
  return (amount / 100).toFixed(2)
}

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const setFilter = (filter) => {
  router.get(route('admin.subscribers.index'), {
    filter,
    search: searchQuery.value,
  }, {
    preserveState: true,
    preserveScroll: true,
  })
}

const applyFilters = () => {
  router.get(route('admin.subscribers.index'), {
    filter: props.filters.filter,
    search: searchQuery.value,
  }, {
    preserveState: true,
    preserveScroll: true,
  })
}
</script>
