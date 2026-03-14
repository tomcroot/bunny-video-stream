<template>
  <div class="min-h-screen bg-background">
    <!-- Admin Navbar -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="text-xl font-bold text-foreground">Dashboard</div>
          <div class="flex items-center gap-6">
            <nav class="flex items-center space-x-6">
            <Link href="/admin" class="text-muted-foreground hover:text-foreground font-semibold transition-colors">Dashboard</Link>
            <Link href="/admin/banners" class="text-muted-foreground hover:text-foreground transition-colors">Banners</Link>
            <Link href="/admin/cast-crew" class="text-muted-foreground hover:text-foreground transition-colors">Cast & Crew</Link>
            <Link href="/admin/gallery" class="text-muted-foreground hover:text-foreground transition-colors">Gallery</Link>
            <Link href="/admin/reviews" class="text-muted-foreground hover:text-foreground transition-colors">Reviews</Link>
            <Link href="/admin/referral-codes" class="text-muted-foreground hover:text-foreground transition-colors">Referrals</Link>
            </nav>

            <div ref="userMenuRef" class="relative">
              <button
                type="button"
                class="flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground transition hover:bg-accent"
                @click.stop="userMenuOpen = !userMenuOpen"
              >
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {{ userInitials }}
                </span>
                <span class="max-w-[130px] truncate text-sm font-medium text-foreground">
                  {{ userName }}
                </span>
                <svg
                  class="h-4 w-4 text-muted-foreground transition-transform duration-200"
                  :class="{ 'rotate-180': userMenuOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-border bg-card py-2 shadow-xl"
                >
                  <div class="border-b border-border px-4 py-3">
                    <p class="truncate text-sm font-semibold text-foreground">{{ userName }}</p>
                    <p class="truncate text-xs text-muted-foreground">{{ userEmail }}</p>
                  </div>

                  <div class="py-2">
                    <p class="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Manage</p>
                    <Link
                      href="/admin/page-content"
                      class="block px-4 py-2 text-sm text-foreground transition hover:bg-accent"
                      @click="userMenuOpen = false"
                    >
                      Movie Details
                    </Link>
                    <Link
                      href="/admin/subscribers"
                      class="block px-4 py-2 text-sm text-foreground transition hover:bg-accent"
                      @click="userMenuOpen = false"
                    >
                      Subscribers
                    </Link>
                  </div>

                  <div class="border-t border-border py-2">
                    <p class="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Configuration</p>
                    <Link
                      href="/admin/settings"
                      class="block px-4 py-2 text-sm text-foreground transition hover:bg-accent"
                      @click="userMenuOpen = false"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/admin/env-settings"
                      class="block px-4 py-2 text-sm text-foreground transition hover:bg-accent"
                      @click="userMenuOpen = false"
                    >
                      Environment Config
                    </Link>
                  </div>

                  <div class="border-t border-border pt-2">
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      class="block w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                      @click="userMenuOpen = false"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <slot />
  </div>
</template>

<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const page = usePage()
const userMenuOpen = ref(false)
const userMenuRef = ref(null)

const user = computed(() => page.props.auth?.user || {})
const userName = computed(() => user.value.name || 'Admin User')
const userEmail = computed(() => user.value.email || '')
const userInitials = computed(() => {
  const name = userName.value.trim()

  if (!name) {
    return 'AU'
  }

  const parts = name.split(' ').filter(Boolean)
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('')
})

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
