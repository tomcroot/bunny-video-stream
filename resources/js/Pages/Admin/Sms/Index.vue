<script setup>
import { ref } from 'vue'
import { Head, useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  usersWithPhones: { type: Array, default: () => [] },
  stats: { type: Object, default: () => ({ total_users_with_phones: 0 }) }
})

const selected = ref([])

const customForm = useForm({
  user_ids: [],
  message: ''
})

const paymentForm = useForm({
  movie_title: '',
  amount: ''
})

const renewalForm = useForm({
  movie_title: '',
  days_remaining: ''
})

const toggleAll = (checked) => {
  selected.value = checked ? props.usersWithPhones.map(u => u.id) : []
}

const toggleUser = (id, checked) => {
  if (checked) {
    if (!selected.value.includes(id)) selected.value.push(id)
  } else {
    selected.value = selected.value.filter(x => x !== id)
  }
}

const submitCustom = () => {
  customForm.user_ids = selected.value
  customForm.post(route('admin.sms.custom'), {
    onSuccess: () => {
      selected.value = []
      customForm.reset()
    }
  })
}

const submitPayment = () => {
  paymentForm.post(route('admin.sms.payment-notifications'), {
    onSuccess: () => paymentForm.reset()
  })
}

const submitRenewal = () => {
  renewalForm.post(route('admin.sms.renewal-reminders'), {
    onSuccess: () => renewalForm.reset()
  })
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-6xl mx-auto py-10 space-y-8">
      <Head title="SMS Management" />

      <header>
        <h1 class="text-3xl font-bold">SMS Management</h1>
        <p class="text-muted-foreground">Send bulk SMS notifications to your users.</p>
      </header>

    <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="bg-card border border-border rounded-lg p-4">
        <p class="text-sm text-muted-foreground">Users with phones</p>
        <p class="text-3xl font-bold">{{ stats.total_users_with_phones ?? 0 }}</p>
      </div>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <div class="bg-card border border-border rounded-lg p-6 space-y-4">
        <div>
          <h2 class="text-xl font-semibold">Send Custom SMS</h2>
          <p class="text-sm text-muted-foreground">Send a custom message to selected users</p>
        </div>

        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <input id="select-all" type="checkbox" :checked="selected.length === usersWithPhones.length && usersWithPhones.length > 0" @change="e => toggleAll(e.target.checked)" />
            <label for="select-all" class="text-sm">Select all ({{ usersWithPhones.length }})</label>
            <span class="text-xs text-muted-foreground">{{ selected.length }} selected</span>
          </div>
          <div class="max-h-48 overflow-y-auto border rounded p-2 space-y-2">
            <div v-for="user in usersWithPhones" :key="user.id" class="flex items-center space-x-2">
              <input
                :id="`user-${user.id}`"
                type="checkbox"
                :checked="selected.includes(user.id)"
                @change="e => toggleUser(user.id, e.target.checked)"
              />
              <label :for="`user-${user.id}`" class="text-sm">{{ user.name }} ({{ user.phone_number }})</label>
            </div>
            <p v-if="usersWithPhones.length === 0" class="text-sm text-muted-foreground">No users with phone numbers.</p>
          </div>
        </div>

        <form class="space-y-3" @submit.prevent="submitCustom">
          <div>
            <label class="text-sm font-medium" for="message">Message (max 160 chars)</label>
            <textarea id="message" v-model="customForm.message" rows="3" maxlength="160" class="w-full border rounded px-3 py-2" required />
            <p class="text-xs text-muted-foreground">{{ customForm.message.length }}/160</p>
          </div>
          <button type="submit" class="w-full bg-primary text-primary-foreground rounded px-4 py-2" :disabled="selected.length === 0 || customForm.processing">
            {{ customForm.processing ? 'Sending…' : 'Send SMS' }}
          </button>
        </form>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 space-y-6">
        <div>
          <h2 class="text-xl font-semibold">Payment Notifications</h2>
          <p class="text-sm text-muted-foreground">Send payment confirmation to all users with phones</p>
        </div>
        <form class="space-y-3" @submit.prevent="submitPayment">
          <div>
            <label class="text-sm font-medium" for="movie_title">Movie title</label>
            <input id="movie_title" v-model="paymentForm.movie_title" class="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label class="text-sm font-medium" for="amount">Amount</label>
            <input id="amount" v-model="paymentForm.amount" type="number" min="0" step="0.01" class="w-full border rounded px-3 py-2" required />
          </div>
          <button type="submit" class="w-full bg-primary text-primary-foreground rounded px-4 py-2" :disabled="paymentForm.processing">
            {{ paymentForm.processing ? 'Sending…' : 'Send Payment Notifications' }}
          </button>
        </form>

        <div class="border-t border-border pt-4 space-y-2">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold">Renewal Reminders</h3>
              <p class="text-sm text-muted-foreground">Placeholder until subscription logic exists</p>
            </div>
          </div>
          <form class="space-y-3" @submit.prevent="submitRenewal">
            <div>
              <label class="text-sm font-medium" for="renewal-movie-title">Movie title</label>
              <input id="renewal-movie-title" v-model="renewalForm.movie_title" class="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label class="text-sm font-medium" for="days_remaining">Days remaining</label>
              <input id="days_remaining" v-model="renewalForm.days_remaining" type="number" min="1" max="365" class="w-full border rounded px-3 py-2" required />
            </div>
            <button type="submit" class="w-full bg-muted text-foreground rounded px-4 py-2" :disabled="renewalForm.processing">
              {{ renewalForm.processing ? 'Submitting…' : 'Send Renewal Reminder' }}
            </button>
          </form>
        </div>
      </div>
    </section>
    </div>
  </AdminLayout>
</template>
