<template>
  <PublicLayout>
    <div class="min-h-screen bg-background py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">Payment History</h1>
          <p class="text-muted-foreground">View your transaction history and download receipts</p>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-card border border-border rounded-lg p-6 shadow">
            <p class="text-sm text-muted-foreground mb-2">Total Spent</p>
            <p class="text-3xl font-bold text-foreground">₵{{ totalSpent }}</p>
          </div>
          <div class="bg-card border border-border rounded-lg p-6 shadow">
            <p class="text-sm text-muted-foreground mb-2">Successful Payments</p>
            <p class="text-3xl font-bold text-green-500">{{ successfulCount }}</p>
          </div>
          <div class="bg-card border border-border rounded-lg p-6 shadow">
            <p class="text-sm text-muted-foreground mb-2">Access Status</p>
            <p class="text-3xl font-bold" :class="hasAccess ? 'text-green-500' : 'text-muted-foreground'">{{ hasAccess ? 'Active' : 'Inactive' }}</p>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          <div v-if="payments.length === 0" class="p-8 text-center text-muted-foreground">
            <p>No payment history yet.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-muted/50 border-b border-border">
                <tr>
                  <th class="px-6 py-4 text-left font-semibold">Date</th>
                  <th class="px-6 py-4 text-left font-semibold">Reference</th>
                  <th class="px-6 py-4 text-left font-semibold">Amount</th>
                  <th class="px-6 py-4 text-left font-semibold">Status</th>
                  <th class="px-6 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in payments" :key="payment.id" class="border-b border-border hover:bg-muted/50 transition-colors">
                  <td class="px-6 py-4">{{ formatDate(payment.created_at) }}</td>
                  <td class="px-6 py-4 font-mono text-xs">{{ payment.reference }}</td>
                  <td class="px-6 py-4 font-semibold">₵{{ (payment.amount / 100).toFixed(2) }}</td>
                  <td class="px-6 py-4">
                    <span :class="getStatusClass(payment.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                      {{ capitalizeStatus(payment.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button v-if="payment.status === 'completed'" @click="downloadReceipt(payment)" class="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                      Download Receipt
                    </button>
                    <span v-else class="text-muted-foreground text-sm">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Back to Profile -->
        <div class="mt-8">
          <a href="/profile" class="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
            ← Back to Profile
          </a>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { computed } from 'vue'
import PublicLayout from '@/Layouts/PublicLayout.vue'

const props = defineProps({
  payments: {
    type: Array,
    required: true
  },
  hasAccess: {
    type: Boolean,
    default: false
  }
})

const totalSpent = computed(() => {
  return (props.payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)
})

const successfulCount = computed(() => {
  return props.payments.filter(p => p.status === 'completed').length
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    'initialized': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  }
  return classes[status] || classes['initialized']
}

const capitalizeStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const downloadReceipt = (payment) => {
  // TODO: Implement receipt download
  alert('Receipt download for payment #' + payment.reference)
}
</script>
