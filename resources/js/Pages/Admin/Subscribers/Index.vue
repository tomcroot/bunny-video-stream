<template>
  <div class="min-h-screen bg-background">
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Subscribers</h1>
            <p class="text-muted-foreground">All active and past subscriptions</p>
          </div>
          <Link
            :href="route('admin.subscribers.export')"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Export CSV
          </Link>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow border border-border">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 class="text-lg font-semibold text-foreground">Subscriptions</h2>
          <p class="text-sm text-muted-foreground">Showing {{ subscriptions.data.length }} of {{ subscriptions.total }} records</p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-muted/50 border-b border-border">
              <tr>
                <th class="px-4 py-3 text-left font-semibold">Subscriber</th>
                <th class="px-4 py-3 text-left font-semibold">Email</th>
                <th class="px-4 py-3 text-left font-semibold">Payment Ref</th>
                <th class="px-4 py-3 text-left font-semibold">Status</th>
                <th class="px-4 py-3 text-left font-semibold">Amount</th>
                <th class="px-4 py-3 text-left font-semibold">Active</th>
                <th class="px-4 py-3 text-left font-semibold">Expires</th>
                <th class="px-4 py-3 text-left font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="subscriptions.data.length === 0">
                <td colspan="8" class="px-4 py-6 text-center text-muted-foreground">No subscribers found.</td>
              </tr>
              <tr
                v-for="sub in subscriptions.data"
                :key="sub.id"
                class="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td class="px-4 py-3">{{ sub.user_name || 'User #' + sub.id }}</td>
                <td class="px-4 py-3">{{ sub.user_email || '—' }}</td>
                <td class="px-4 py-3">{{ sub.payment_reference || '—' }}</td>
                <td class="px-4 py-3">
                  <span :class="statusClass(sub.payment_status)" class="px-2 py-1 rounded text-xs font-medium">
                    {{ sub.payment_status || 'n/a' }}
                  </span>
                </td>
                <td class="px-4 py-3 font-semibold">{{ formatAmount(sub.amount) }}</td>
                <td class="px-4 py-3">
                  <span :class="sub.is_active ? 'text-green-600' : 'text-red-600'">{{ sub.is_active ? 'Yes' : 'No' }}</span>
                </td>
                <td class="px-4 py-3 text-xs text-muted-foreground">{{ formatDate(sub.expires_at) }}</td>
                <td class="px-4 py-3 text-xs text-muted-foreground">{{ formatDate(sub.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between px-6 py-4 border-t border-border" v-if="subscriptions.links?.length">
          <div class="text-sm text-muted-foreground">Page {{ subscriptions.current_page }} of {{ subscriptions.last_page }}</div>
          <div class="flex items-center gap-2">
            <Link
              v-for="link in subscriptions.links"
              :key="link.url || link.label"
              :href="link.url || '#'"
              class="px-3 py-1 rounded border border-border text-sm"
              :class="{
                'bg-primary text-primary-foreground border-primary': link.active,
                'text-muted-foreground cursor-not-allowed opacity-50': !link.url,
              }"
              v-html="link.label"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  subscriptions: { type: Object, required: true },
})

const formatAmount = (amount) => {
  if (!amount) return '—'
  return `₵${(amount / 100).toFixed(2)}`
}

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

const statusClass = (status) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'failed':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-muted text-foreground'
  }
}
</script>
