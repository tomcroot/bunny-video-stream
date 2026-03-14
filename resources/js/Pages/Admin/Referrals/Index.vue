<template>
  <AdminLayout>
    <Head title="Referral Codes" />

    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">Referral Codes</h1>
            <p class="text-muted-foreground">User referral codes are global. Admin-created referral codes are bound to a specific movie.</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              @click="createDialogOpen = true"
            >
              Create Referral Code
            </button>
            <Link
              href="/admin/page-content"
              class="inline-flex items-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              Back to Movie Details
            </Link>
          </div>
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

      <div class="rounded-lg border border-border bg-card shadow-sm">
        <div class="flex flex-col gap-2 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-xl font-semibold text-foreground">Referral Codes Table</h2>
            <p class="text-sm text-muted-foreground">High-level performance stays visible. Expand a row when you need creator, link, and recent-use details.</p>
          </div>
          <p class="text-sm text-muted-foreground">{{ filteredCodes.length }} of {{ codes.length }} code{{ codes.length === 1 ? '' : 's' }}</p>
        </div>

        <div class="grid gap-3 border-b border-border px-6 py-4 md:grid-cols-6">
          <div>
            <label for="filter_search" class="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Search</label>
            <input
              id="filter_search"
              v-model="filters.search"
              type="text"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Code, description, creator"
            />
          </div>

          <div>
            <label for="filter_status" class="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</label>
            <select
              id="filter_status"
              v-model="filters.status"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label for="filter_type" class="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Type</label>
            <select
              id="filter_type"
              v-model="filters.type"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All types</option>
              <option value="movie">Movie</option>
              <option value="global">Global</option>
            </select>
          </div>

          <div>
            <label for="filter_movie" class="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Movie Scope</label>
            <div class="flex items-center gap-2">
              <select
                id="filter_movie"
                v-model="filters.movieId"
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All movies</option>
                <option value="global">Global only</option>
                <option v-for="movie in movies" :key="movie.id" :value="String(movie.id)">
                  {{ movie.title }}
                </option>
              </select>
              <button
                type="button"
                class="shrink-0 rounded-md bg-muted px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent"
                @click="resetFilters"
              >
                Reset
              </button>
            </div>
          </div>

          <div>
            <label for="filter_start_date" class="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Activity From</label>
            <input
              id="filter_start_date"
              v-model="filters.startDate"
              type="date"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label for="filter_sort" class="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Sort</label>
            <select
              id="filter_sort"
              v-model="filters.sort"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most_uses">Most Uses</option>
              <option value="most_revenue">Most Revenue</option>
              <option value="code_az">Code A-Z</option>
              <option value="code_za">Code Z-A</option>
            </select>
          </div>
        </div>

        <div v-if="codes.length === 0" class="px-6 py-10 text-center text-sm text-muted-foreground">
          No referral codes created yet.
        </div>

        <div v-else-if="filteredCodes.length === 0" class="px-6 py-10 text-center text-sm text-muted-foreground">
          No referral codes match your current filters.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-border">
            <thead class="bg-muted/40">
              <tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th class="px-6 py-3 font-medium">Code</th>
                <th class="px-6 py-3 font-medium">Type</th>
                <th class="px-6 py-3 font-medium">Scope</th>
                <th class="px-6 py-3 font-medium">Performance</th>
                <th class="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <template v-for="code in sortedFilteredCodes" :key="code.id">
                <tr class="align-top text-sm text-foreground">
                  <td class="px-6 py-4">
                    <div class="space-y-2">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="font-semibold text-foreground">{{ code.code }}</span>
                        <span
                          class="rounded-full px-2.5 py-1 text-[11px] font-medium"
                          :class="code.is_active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'"
                        >
                          {{ code.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </div>
                      <p v-if="code.description" class="max-w-xs text-xs text-muted-foreground">{{ code.description }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="space-y-1">
                      <p class="font-medium text-foreground">{{ getCodeType(code) }}</p>
                      <p class="text-xs text-muted-foreground">{{ code.discount_percentage }}% discount</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="space-y-1">
                      <p class="font-medium text-foreground">{{ getScopeLabel(code) }}</p>
                      <p class="text-xs text-muted-foreground">{{ getScopeMeta(code) }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex max-w-xs flex-wrap gap-2 text-xs">
                      <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
                        U: {{ code.stats.total_uses }}
                      </span>
                      <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
                        S: {{ code.stats.unique_users }}
                      </span>
                      <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                        R: GHS {{ formatAmount(code.stats.total_revenue) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition hover:bg-accent"
                        @click="toggleExpanded(code.id)"
                        :title="isExpanded(code.id) ? 'Hide details' : 'View details'"
                        :aria-label="isExpanded(code.id) ? 'Hide details' : 'View details'"
                      >
                        <EyeOff v-if="isExpanded(code.id)" class="h-4 w-4" />
                        <Eye v-else class="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-foreground transition hover:bg-accent"
                        @click="copyLink(code.link)"
                        title="Copy referral link"
                        aria-label="Copy referral link"
                      >
                        <Copy class="h-4 w-4" />
                      </button>
                      <button
                        v-if="!code.is_active"
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:opacity-90"
                        @click="toggleCode(code, true)"
                        title="Activate code"
                        aria-label="Activate code"
                      >
                        <CheckCircle class="h-4 w-4" />
                      </button>
                      <button
                        v-else
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-600 text-white transition hover:bg-amber-700"
                        @click="toggleCode(code, false)"
                        title="Deactivate code"
                        aria-label="Deactivate code"
                      >
                        <CircleOff class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="isExpanded(code.id)" class="bg-muted/20">
                  <td colspan="5" class="px-6 py-5">
                    <div class="grid gap-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
                      <div class="space-y-4">
                        <div class="rounded-lg border border-border bg-background p-4">
                          <p class="text-xs uppercase tracking-wide text-muted-foreground">Referral Link</p>
                          <input
                            :value="code.link"
                            readonly
                            class="mt-3 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
                          />
                        </div>
                        <div class="rounded-lg border border-border bg-background p-4 text-sm">
                          <p class="text-xs uppercase tracking-wide text-muted-foreground">Owner</p>
                          <p class="mt-2 font-medium text-foreground">{{ code.creator?.name || 'Unknown' }}</p>
                          <p class="text-muted-foreground">{{ code.creator?.email || 'No email available' }}</p>
                        </div>
                        <div class="rounded-lg border border-border bg-background p-4 text-sm">
                          <p class="text-xs uppercase tracking-wide text-muted-foreground">Discount Given</p>
                          <p class="mt-2 font-semibold text-foreground">GHS {{ formatAmount(code.stats.total_discount_given) }}</p>
                        </div>
                      </div>

                      <div class="rounded-lg border border-border bg-background p-4">
                        <div class="flex items-center justify-between gap-3">
                          <h3 class="text-sm font-medium text-foreground">Recent Uses</h3>
                          <p class="text-xs text-muted-foreground">Last {{ code.stats.recent_uses.length }} record{{ code.stats.recent_uses.length === 1 ? '' : 's' }}</p>
                        </div>
                        <div v-if="code.stats.recent_uses.length === 0" class="mt-3 text-sm text-muted-foreground">
                          No successful referrals recorded for this code yet.
                        </div>
                        <div v-else class="mt-4 overflow-x-auto">
                          <table class="w-full min-w-[540px]">
                            <thead>
                              <tr class="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                                <th class="py-2 pr-4">User</th>
                                <th class="py-2 pr-4">Payment</th>
                                <th class="py-2 pr-4">Discount</th>
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
                                <td class="py-3">{{ formatDate(usage.used_at) }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Dialog v-model:open="createDialogOpen">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Referral Code</DialogTitle>
          <DialogDescription>Pick a movie for this admin referral code and save it without leaving the table view.</DialogDescription>
        </DialogHeader>

        <form class="space-y-4" @submit.prevent="createCode">
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
            <div v-if="$page.props.errors?.movie_id" class="mt-1 text-sm text-red-600">
              {{ $page.props.errors.movie_id }}
            </div>
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
            <div v-if="$page.props.errors?.code" class="mt-1 text-sm text-red-600">
              {{ $page.props.errors.code }}
            </div>
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
            <div v-if="$page.props.errors?.discount_percentage" class="mt-1 text-sm text-red-600">
              {{ $page.props.errors.discount_percentage }}
            </div>
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
            <div v-if="$page.props.errors?.description" class="mt-1 text-sm text-red-600">
              {{ $page.props.errors.description }}
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
              @click="createDialogOpen = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Create Referral Code
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </AdminLayout>
</template>

<script setup>
import { Head, Link, router } from '@inertiajs/vue3'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AdminLayout from '@/Layouts/AdminLayout.vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, CircleOff, Copy, Eye, EyeOff } from 'lucide-vue-next'

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

const createDialogOpen = ref(false)
const expandedRows = ref({})
const filters = reactive({
  search: '',
  status: 'all',
  type: 'all',
  movieId: 'all',
  startDate: '',
  sort: 'newest',
})

const getActivityTimestamp = (code) => {
  const latestUsage = code.stats?.recent_uses?.[0]?.used_at
  const fallbackCreated = code.created_at
  const source = latestUsage || fallbackCreated

  if (!source) {
    return null
  }

  const parsed = new Date(source).getTime()
  return Number.isNaN(parsed) ? null : parsed
}

const filteredCodes = computed(() => props.codes.filter((code) => {
  const movieId = code.movie?.id || code.stats.movie?.id
  const codeType = movieId ? 'movie' : 'global'
  const activityTimestamp = getActivityTimestamp(code)
  const searchTarget = [
    code.code,
    code.description,
    code.creator?.name,
    code.creator?.email,
    code.movie?.title,
    code.stats.movie?.title,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (filters.search && !searchTarget.includes(filters.search.toLowerCase())) {
    return false
  }

  if (filters.status === 'active' && !code.is_active) {
    return false
  }

  if (filters.status === 'inactive' && code.is_active) {
    return false
  }

  if (filters.type !== 'all' && codeType !== filters.type) {
    return false
  }

  if (filters.movieId === 'global' && movieId) {
    return false
  }

  if (filters.movieId !== 'all' && filters.movieId !== 'global' && String(movieId || '') !== filters.movieId) {
    return false
  }

  if (filters.startDate) {
    const startDate = new Date(`${filters.startDate}T00:00:00`).getTime()

    if (!activityTimestamp || activityTimestamp < startDate) {
      return false
    }
  }

  return true
}))

const sortedFilteredCodes = computed(() => {
  const rows = [...filteredCodes.value]

  const byCode = (a, b) => (a.code || '').localeCompare(b.code || '')
  const byActivity = (a, b) => (getActivityTimestamp(a) || 0) - (getActivityTimestamp(b) || 0)
  const byUses = (a, b) => (a.stats?.total_uses || 0) - (b.stats?.total_uses || 0)
  const byRevenue = (a, b) => (Number(a.stats?.total_revenue || 0) - Number(b.stats?.total_revenue || 0))

  switch (filters.sort) {
    case 'oldest':
      return rows.sort(byActivity)
    case 'most_uses':
      return rows.sort((a, b) => byUses(b, a))
    case 'most_revenue':
      return rows.sort((a, b) => byRevenue(b, a))
    case 'code_az':
      return rows.sort(byCode)
    case 'code_za':
      return rows.sort((a, b) => byCode(b, a))
    case 'newest':
    default:
      return rows.sort((a, b) => byActivity(b, a))
  }
})

const isExpanded = (codeId) => Boolean(expandedRows.value[codeId])

const toggleExpanded = (codeId) => {
  expandedRows.value = {
    ...expandedRows.value,
    [codeId]: !expandedRows.value[codeId],
  }
}

const resetFilters = () => {
  filters.search = ''
  filters.status = 'all'
  filters.type = 'all'
  filters.movieId = 'all'
  filters.startDate = ''
  filters.sort = 'newest'
}

const loadFiltersFromUrl = () => {
  if (typeof window === 'undefined') {
    return
  }

  const params = new URLSearchParams(window.location.search)
  filters.search = params.get('search') || ''
  filters.status = params.get('status') || 'all'
  filters.type = params.get('type') || 'all'
  filters.movieId = params.get('movieId') || 'all'
  filters.startDate = params.get('startDate') || ''
  filters.sort = params.get('sort') || 'newest'
}

const syncFiltersToUrl = () => {
  if (typeof window === 'undefined') {
    return
  }

  const params = new URLSearchParams()

  if (filters.search) params.set('search', filters.search)
  if (filters.status !== 'all') params.set('status', filters.status)
  if (filters.type !== 'all') params.set('type', filters.type)
  if (filters.movieId !== 'all') params.set('movieId', filters.movieId)
  if (filters.startDate) params.set('startDate', filters.startDate)
  if (filters.sort !== 'newest') params.set('sort', filters.sort)

  const query = params.toString()
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
  window.history.replaceState({}, '', nextUrl)
}

onMounted(() => {
  loadFiltersFromUrl()
})

watch(
  () => ({ ...filters }),
  () => {
    syncFiltersToUrl()
  },
  { deep: true }
)

const resetForm = () => {
  form.movie_id = props.movies[0]?.id ?? null
  form.code = ''
  form.discount_percentage = 5
  form.description = ''
}

const createCode = () => {
  router.post('/admin/referral-codes', form, {
    preserveScroll: true,
    onSuccess: () => {
      resetForm()
      createDialogOpen.value = false
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

const getCodeType = (code) => ((code.movie?.id || code.stats.movie?.id) ? 'Movie' : 'Global')

const getScopeLabel = (code) => code.movie?.title || code.stats.movie?.title || 'Entire system'

const getScopeMeta = (code) => {
  const movieId = code.movie?.id || code.stats.movie?.id

  if (movieId) {
    return `Movie ID ${movieId}`
  }

  return 'Applies to every checkout'
}

const formatAmount = (value) => Number(value || 0).toFixed(2)

const formatDate = (value) => {
  if (!value) {
    return 'N/A'
  }

  return new Date(value).toLocaleString()
}
</script>
