<script setup>
import { ref, computed } from 'vue'
import { Head, useForm } from '@inertiajs/vue3'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  recipients: { type: Array, default: () => [] },
  stats: { type: Object, default: () => ({ total_recipients: 0 }) }
})

const selected = ref([])

const bulkForm = useForm({
  user_ids: [],
  subject: '',
  html_content: '',
  text_content: ''
})

const promoForm = useForm({
  subject: '',
  html_content: '',
  text_content: ''
})

const testForm = useForm({
  email: '',
  subject: '',
  html_content: '',
  text_content: ''
})

const allSelected = computed(() => props.recipients.length > 0 && selected.value.length === props.recipients.length)

const toggleAll = (checked) => {
  selected.value = checked ? props.recipients.map(r => r.id) : []
}

const toggleRecipient = (id, checked) => {
  if (checked) {
    if (!selected.value.includes(id)) selected.value.push(id)
  } else {
    selected.value = selected.value.filter(x => x !== id)
  }
}

const submitBulk = () => {
  bulkForm.user_ids = selected.value
  bulkForm.post(route('admin.email.bulk'), {
    onSuccess: () => {
      selected.value = []
      bulkForm.reset()
    }
  })
}

const submitPromo = () => {
  promoForm.post(route('admin.email.promotional-campaign'), {
    onSuccess: () => promoForm.reset()
  })
}

const submitTest = () => {
  testForm.post(route('admin.email.test'), {
    onSuccess: () => testForm.reset()
  })
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-6xl mx-auto py-10 space-y-8">
      <Head title="Email Management" />

      <header>
        <h1 class="text-3xl font-bold">Email Management</h1>
        <p class="text-muted-foreground">Send bulk, campaign, and test emails.</p>
      </header>

    <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div class="bg-card border border-border rounded-lg p-4">
        <p class="text-sm text-muted-foreground">Total recipients</p>
        <p class="text-3xl font-bold">{{ stats.total_recipients ?? 0 }}</p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="bg-card border border-border rounded-lg p-6 space-y-4">
        <div>
          <h2 class="text-xl font-semibold">Bulk Email</h2>
          <p class="text-muted-foreground text-sm">Send to selected users</p>
        </div>

        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <input id="select-all" type="checkbox" :checked="allSelected" @change="e => toggleAll(e.target.checked)" />
            <label for="select-all" class="text-sm">Select all ({{ recipients.length }})</label>
            <span class="text-xs text-muted-foreground">{{ selected.length }} selected</span>
          </div>
          <div class="max-h-48 overflow-y-auto border rounded p-2 space-y-2">
            <div v-for="user in recipients" :key="user.id" class="flex items-center space-x-2">
              <input
                :id="`user-${user.id}`"
                type="checkbox"
                :checked="selected.includes(user.id)"
                @change="e => toggleRecipient(user.id, e.target.checked)"
              />
              <label :for="`user-${user.id}`" class="text-sm">{{ user.name }} ({{ user.email }})</label>
            </div>
            <p v-if="recipients.length === 0" class="text-sm text-muted-foreground">No recipients available.</p>
          </div>
        </div>

        <form class="space-y-3" @submit.prevent="submitBulk">
          <div>
            <label class="text-sm font-medium" for="bulk-subject">Subject</label>
            <input id="bulk-subject" v-model="bulkForm.subject" class="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label class="text-sm font-medium" for="bulk-html">HTML Content</label>
            <textarea id="bulk-html" v-model="bulkForm.html_content" rows="4" class="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label class="text-sm font-medium" for="bulk-text">Plain Text (optional)</label>
            <textarea id="bulk-text" v-model="bulkForm.text_content" rows="3" class="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" class="w-full bg-primary text-primary-foreground rounded px-4 py-2" :disabled="selected.length === 0 || bulkForm.processing">
            {{ bulkForm.processing ? 'Sending…' : 'Send Bulk Email' }}
          </button>
        </form>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 space-y-4">
        <div>
          <h2 class="text-xl font-semibold">Promotional Campaign</h2>
          <p class="text-muted-foreground text-sm">Send to all recipients</p>
        </div>

        <form class="space-y-3" @submit.prevent="submitPromo">
          <div>
            <label class="text-sm font-medium" for="promo-subject">Subject</label>
            <input id="promo-subject" v-model="promoForm.subject" class="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label class="text-sm font-medium" for="promo-html">HTML Content</label>
            <textarea id="promo-html" v-model="promoForm.html_content" rows="5" class="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label class="text-sm font-medium" for="promo-text">Plain Text (optional)</label>
            <textarea id="promo-text" v-model="promoForm.text_content" rows="3" class="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" class="w-full bg-primary text-primary-foreground rounded px-4 py-2" :disabled="promoForm.processing">
            {{ promoForm.processing ? 'Sending…' : 'Send Campaign to All' }}
          </button>
        </form>
      </div>
    </section>

    <section class="bg-card border border-border rounded-lg p-6 space-y-4">
      <div>
        <h2 class="text-xl font-semibold">Send Test Email</h2>
        <p class="text-muted-foreground text-sm">Send a single test to verify delivery</p>
      </div>

      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="submitTest">
        <div class="space-y-2">
          <label class="text-sm font-medium" for="test-email">Email</label>
          <input id="test-email" type="email" v-model="testForm.email" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium" for="test-subject">Subject</label>
          <input id="test-subject" v-model="testForm.subject" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium" for="test-html">HTML Content</label>
          <textarea id="test-html" v-model="testForm.html_content" rows="4" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium" for="test-text">Plain Text (optional)</label>
          <textarea id="test-text" v-model="testForm.text_content" rows="3" class="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" class="bg-primary text-primary-foreground rounded px-4 py-2 md:col-span-2" :disabled="testForm.processing">
          {{ testForm.processing ? 'Sending…' : 'Send Test Email' }}
        </button>
      </form>
    </section>
    </div>
  </AdminLayout>
</template>
