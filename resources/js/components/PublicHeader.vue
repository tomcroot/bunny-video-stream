<script setup>
// Navigation items (shared for desktop and mobile)
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/details', label: 'Details' },
  { href: '/gallery', label: 'Gallery' },
]
import { Link, usePage } from '@inertiajs/vue3'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const logo = '/plf_logo_light.png' // Using public folder

const page = usePage()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref(null)

const isActive = (path) => {
  if (typeof page.url !== 'string') return false
  return page.url === path || page.url.startsWith(path + '/')
}

// Check if user is admin
const user = computed(() => page.props.auth?.user)
const isAdmin = computed(() => {
  return Array.isArray(user.value?.roles)
    ? user.value.roles.some(role => role.name === 'admin')
    : false
})

// Close user menu when clicking outside
function handleClickOutside(event) {
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

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
    <nav class="container mx-auto px-6 lg:px-12">
      <div class="flex items-center justify-between h-20">

        <!-- Logo -->
        <Link href="/" class="flex items-center gap-3 group">
          <img :src="logo" alt="Promise Land Films" class="h-12 w-auto transition-opacity group-hover:opacity-80" />
          <span class="text-xl font-bold text-white group-hover:text-red-600 transition-colors hidden md:inline">
            A Crazy Day in Accra
          </span>
        </Link>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center space-x-8">
          <Link
            v-for="item in navItems"
            :key="item.href"
            :href="typeof item.href === 'string' ? item.href : '/'"
            :class="isActive(item.href) ? 'text-red-600' : 'text-white hover:text-red-600'"
            class="font-semibold transition-colors"
          >
            {{ item.label }}
          </Link>

          <!-- Auth - Logged In User Menu -->
          <div v-if="$page.props.auth?.user" class="relative ml-4 pl-4 border-l border-gray-700" ref="userMenuRef">
            <!-- User Menu Button -->
            <button
              @click.stop="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 text-white hover:text-red-500 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
            >
              <!-- User Avatar -->
              <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-sm">
                {{ ($page.props.auth.user.name || 'U').charAt(0).toUpperCase() }}
              </div>
              <!-- User Name -->
              <span class="font-medium max-w-[120px] truncate hidden xl:block">
                {{ $page.props.auth.user.name || 'User' }}
              </span>
              <!-- Dropdown Arrow -->
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': userMenuOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown Menu -->
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
                class="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-50"
              >
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-gray-700">
                  <p class="text-white font-semibold truncate">{{ $page.props.auth.user.name || 'User' }}</p>
                  <p class="text-gray-400 text-sm truncate">{{ $page.props.auth.user.email || '' }}</p>
                </div>

                <!-- Menu Items -->
                <div class="py-2">
                  <!-- Dashboard Link -->
                  <Link
                    :href="isAdmin ? '/admin' : '/dashboard'"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span>{{ isAdmin ? 'Admin Dashboard' : 'Dashboard' }}</span>
                  </Link>

                  <!-- Watch Movie (if paid user) -->
                  <Link
                    href="/watch"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Watch Movie</span>
                  </Link>

                  <!-- Profile/Settings (optional) -->
                  <Link
                    href="/profile"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span>Profile</span>
                  </Link>
                </div>

                <!-- Sign Out -->
                <div class="border-t border-gray-700 pt-2">
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-3 w-full px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span class="font-medium">Sign Out</span>
                  </Link>
                </div>
              </div>
            </Transition>
          </div>

          <div v-else class="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-700">
            <Link href="/register" class="text-white hover:text-red-600 font-semibold">Sign Up</Link>
            <Link href="/login" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold">
              Login
            </Link>
          </div>
        </div>

        <!-- Mobile Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden text-white p-2 hover:text-red-600"
          aria-label="Toggle menu"
          :aria-expanded="mobileMenuOpen"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="lg:hidden py-4 border-t border-gray-800">
        <div class="flex flex-col space-y-3">
          <Link
            v-for="item in navItems"
            :key="item.href"
            :href="typeof item.href === 'string' ? item.href : '/'"
            @click="mobileMenuOpen = false"
            :class="isActive(item.href) ? 'text-red-600' : 'text-white hover:text-red-600'"
            class="font-semibold py-2"
          >
            {{ item.label }}
          </Link>

          <!-- Mobile Auth - Logged In -->
          <div v-if="$page.props.auth?.user" class="pt-3 border-t border-gray-800 space-y-1">
            <!-- User Info -->
            <div class="px-2 py-3 mb-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
                  {{ ($page.props.auth.user.name || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-white font-semibold">{{ $page.props.auth.user.name || 'User' }}</p>
                  <p class="text-gray-400 text-sm">{{ $page.props.auth.user.email || '' }}</p>
                </div>
              </div>
            </div>

            <!-- Dashboard -->
            <Link
              :href="isAdmin ? '/admin' : '/dashboard'"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-2 py-3 text-white hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span class="font-medium">{{ isAdmin ? 'Admin Dashboard' : 'Dashboard' }}</span>
            </Link>

            <!-- Watch Movie -->
            <Link
              href="/watch"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-2 py-3 text-white hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-medium">Watch Movie</span>
            </Link>

            <!-- Profile -->
            <Link
              href="/profile"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-2 py-3 text-white hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span class="font-medium">Profile</span>
            </Link>

            <!-- Sign Out -->
            <Link
              href="/logout"
              method="post"
              as="button"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 w-full px-2 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-2 border-t border-gray-800 pt-4"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="font-semibold">Sign Out</span>
            </Link>
          </div>

          <div v-else class="pt-3 border-t border-gray-800 flex flex-col space-y-3">
            <Link href="/register" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold">
              Sign Up
            </Link>
            <Link href="/login" class="text-white hover:text-red-600 font-semibold">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
