<template>
  <AdminLayout>
    <Head title="Referral Codes" />

    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">Referral Codes</h1>
            <p class="text-muted-foreground">User referral codes are global. Admin-created referral codes are bound to a specific movie.</p>
          </div>
          <Link
            href="/admin/page-content"
            class="inline-flex items-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            Back to Movie Details
          </Link>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div v-if="$page.props.flash?.success" class="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        {{ $page.props.flash.success }}
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p class="text-sm text-muted-foreground">Movies Available</p>
          <p class="mt-2 text-2xl font-bold text-foreground">{{ movies.length }}</p>
          <p class="mt-1 text-xs text-muted-foreground">Admin codes target these DB movie records</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p class="text-sm text-muted-foreground">Total Codes</p>
          <p class="mt-2 text-2xl font-bold text-foreground">{{ summary.total_codes }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p class="text-sm text-muted-foreground">Active Codes</p>
          <p class="mt-2 text-2xl font-bold text-foreground">{{ summary.active_codes }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p class="text-sm text-muted-foreground">Referral Uses</p>
          <p class="mt-2 text-2xl font-bold text-foreground">{{ summary.total_uses }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p class="text-sm text-muted-foreground">Revenue From Referrals</p>
          <p class="mt-2 text-2xl font-bold text-foreground">GHS {{ formatAmount(summary.total_revenue) }}</p>
          <p class="mt-1 text-xs text-muted-foreground">Discounts given: GHS {{ formatAmount(summary.total_discount_given) }}</p>
        </div>
      </div>

      <div class="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-foreground">Create Code</h2>
          <p class="mt-1 text-sm text-muted-foreground">Pick a movie for this admin referral code.</p>

          <form class="mt-6 space-y-4" @submit.prevent="createCode">
            <div>
              <label for="movie_id" class="mb-2 block text-sm font-medium text-foreground">Target Movie</label>
              <select
                id="movie_id"
                v-model.number="form.movie_id"
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option :value="null" disabled>Select movie...</option>
                <option v-for="movie in movies" :key="movie.id" :value="movie.id">
                  {{ movie.title }} (ID {{ movie.id }})
                </option>
              </select>
            </div>

            <div>
              <label for="code" class="mb-2 block text-sm font-medium text-foreground">Code</label>
              <input
                id="code"
                v-model="form.code"
                type="text"
                maxlength="50"
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ACCRA2026"
              />
            </div>

            <div>
              <label for="discount_percentage" class="mb-2 block text-sm font-medium text-foreground">Discount %</label>
              <input
                id="discount_percentage"
                v-model.number="form.discount_percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label for="description" class="mb-2 block text-sm font-medium text-foreground">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Creator promo for selected movie"
              />
            </div>

            <button
              type="submit"
              class="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Create Referral Code
            </button>
          </form>
        </div>

        <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-foreground">Existing Codes</h2>
              <p class="text-sm text-muted-foreground">Each code metrics are scoped to its bound movie.</p>
            </div>
          </div>

          <div v-if="codes.length === 0" class="mt-6 rounded-md border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            No referral codes created yet.
          </div>

          <div v-else class="mt-6 space-y-4">
            <div
              v-for="code in codes"
              :key="code.id"
              class="rounded-lg border border-border bg-background/40 p-5"
            >
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-3">
                    <h3 class="text-lg font-semibold text-foreground">{{ code.code }}</h3>
                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-medium"
                      :class="code.is_active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'"
                    >
                      {{ code.is_active ? 'Active' : 'Inactive' }}
                    </span>
                    <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {{ code.discount_percentage }}% off
                    </span>
                  </div>

                  <p v-if="code.description" class="text-sm text-muted-foreground">{{ code.description }}</p>
                  <p class="text-xs text-muted-foreground">
                    Applies to:
                    <span class="font-medium text-foreground">{{ code.movie?.title || code.stats.movie?.title || 'Global' }}</span>
                    <span v-if="code.movie?.id || code.stats.movie?.id">(ID {{ code.movie?.id || code.stats.movie?.id }})</span>
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Created by {{ code.creator?.name || 'Unknown' }}
                    <span v-if="code.creator?.email">({{ code.creator.email }})</span>
                  </p>

                  <div class="flex flex-col gap-2 pt-2 lg:flex-row lg:items-center">
                    <input
                      :value="code.link"
                      readonly
                      class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                    <button
                      type="button"
                      class="rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                      @click="copyLink(code.link)"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                <div class="flex shrink-0 gap-3">
                  <button
                    v-if="!code.is_active"
                    type="button"
                    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    @click="toggleCode(code, true)"
                  >
                    Activate
                  </button>
                  <button
                    v-else
                    type="button"
                    class="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                    @click="toggleCode(code, false)"
                  >
                    Deactivate
                  </button>
                </div>
              </div>

              <div class="mt-5 grid gap-4 md:grid-cols-4">
                <div class="rounded-md border border-border bg-card p-4">
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Uses</p>
                  <p class="mt-2 text-2xl font-semibold text-foreground">{{ code.stats.total_uses }}</p>
                </div>
                <div class="rounded-md border border-border bg-card p-4">
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Unique Users</p>
                  <p class="mt-2 text-2xl font-semibold text-foreground">{{ code.stats.unique_users }}</p>
                </div>
                <div class="rounded-md border border-border bg-card p-4">
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p>
                  <p class="mt-2 text-2xl font-semibold text-foreground">GHS {{ formatAmount(code.stats.total_revenue) }}</p>
                </div>
                <div class="rounded-md border border-border bg-card p-4">
                  <p class="text-xs uppercase tracking-wide text-muted-foreground">Discount Given</p>
                  <p class="mt-2 text-2xl font-semibold text-foreground">GHS {{ formatAmount(code.stats.total_discount_given) }}</p>
                </div>
              </div>

              <div class="mt-5">
                <h4 class="text-sm font-medium text-foreground">Recent Uses</h4>
                <div v-if="code.stats.recent_uses.length === 0" class="mt-2 text-sm text-muted-foreground">
                  No successful referrals recorded for this movie yet.
                </div>
                <div v-else class="mt-3 overflow-x-auto">
                  <table class="w-full min-w-[640px]">
                    <thead>
                      <tr class="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th class="py-2 pr-4">User</th>
                        <th class="py-2 pr-4">Payment</th>
                        <th class="py-2 pr-4">Discount</th>
                        <th class="py-2 pr-4">Movie</th>
                        <th class="py-2">Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="usage in code.stats.recent_uses"
                        :key="usage.id"
                        class="border-b border-border/60 text-sm text-foreground"
                      >
                        <td class="py-3 pr-4">
                          <div>{{ usage.user_name || 'Unknown' }}</div>
                          <div class="text-xs text-muted-foreground">{{ usage.user_email || 'No email' }}</div>
                        </td>
                        <td class="py-3 pr-4">GHS {{ formatAmount(usage.payment_amount) }}</td>
                        <td class="py-3 pr-4">GHS {{ formatAmount(usage.discount_applied) }}</td>
                        <td class="py-3 pr-4">{{ usage.movie_id || code.movie?.id || code.stats.movie?.id || 'N/A' }}</td>
                        <td class="py-3">{{ formatDate(usage.used_at) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { Head, Link, router } from '@inertiajs/vue3'
import { reactive } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  movies: {
    type: Array,
    default: () => [],
  },
  summary: {
    type: Object,
    required: true,
  },
  codes: {
    type: Array,
    default: () => [],
  },
})

const form = reactive({
  movie_id: props.movies[0]?.id ?? null,
  code: '',
  discount_percentage: 5,
  description: '',
})

const createCode = () => {
  router.post('/admin/referral-codes', form, {
    preserveScroll: true,
    onSuccess: () => {
      form.movie_id = props.movies[0]?.id ?? null
      form.code = ''
      form.discount_percentage = 5
      form.description = ''
    },
  })
}

const toggleCode = (code, shouldActivate) => {
  router.patch(`/admin/referral-codes/${code.code}/${shouldActivate ? 'activate' : 'deactivate'}`, {}, {
    preserveScroll: true,
  })
}

const copyLink = async (value) => {
  await navigator.clipboard.writeText(value)
}

const formatAmount = (value) => Number(value || 0).toFixed(2)

const formatDate = (value) => {
  if (!value) {
    return 'N/A'
  }

  return new Date(value).toLocaleString()
}
</script>
