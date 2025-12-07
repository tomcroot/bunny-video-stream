<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { ref } from 'vue'

const page = usePage()
const mobileMenuOpen = ref(false)

const isActive = (path) => {
  return page.url === path || page.url.startsWith(path + '/')
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
    <nav class="container mx-auto px-6 lg:px-12">
      <div class="flex items-center justify-between h-20">

        <!-- Logo -->
        <Link href="/" class="text-2xl font-black text-white hover:text-red-600 transition-colors">
          A CRAZY DAY IN ACCRA
        </Link>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center space-x-8">
          <Link v-for="item in [
            ['/', 'Home'],
            ['/details', 'Details'],
            ['/credits', 'Credits'],
            ['/gallery', 'Gallery']
          ]"
            :key="item[0]"
            :href="item[0]"
            :class="isActive(item[0]) ? 'text-red-600' : 'text-white hover:text-red-600'"
            class="font-semibold transition-colors"
          >
            {{ item[1] }}
          </Link>

          <!-- Auth -->
          <div v-if="$page.props.auth?.user" class="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-700">
            <Link href="/dashboard" class="text-white hover:text-red-600 font-semibold">Dashboard</Link>

            <button class="flex items-center gap-2 text-white hover:text-red-600">
              <svg class="w-6 h-6 rounded-full bg-red-600 p-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
            </button>

            <Link href="/logout" method="post" as="button"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold">
              Logout
            </Link>
          </div>

          <div v-else class="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-700">
            <Link href="/login" class="text-white hover:text-red-600 font-semibold">Login</Link>
            <Link href="/register" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold">
              Sign Up
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
          <Link v-for="item in [
            ['/', 'Home'],
            ['/details', 'Details'],
            ['/credits', 'Credits'],
            ['/gallery', 'Gallery']
          ]"
            :key="item[0]"
            :href="item[0]"
            @click="mobileMenuOpen = false"
            :class="isActive(item[0]) ? 'text-red-600' : 'text-white hover:text-red-600'"
            class="font-semibold py-2"
          >
            {{ item[1] }}
          </Link>

          <div v-if="$page.props.auth?.user" class="pt-3 border-t border-gray-800 flex flex-col space-y-3">
            <Link href="/dashboard" class="text-white hover:text-red-600 font-semibold">Dashboard</Link>
            <Link href="/logout" method="post" as="button"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold">
              Logout
            </Link>
          </div>

          <div v-else class="pt-3 border-t border-gray-800 flex flex-col space-y-3">
            <Link href="/login" class="text-white hover:text-red-600 font-semibold">Login</Link>
            <Link href="/register" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
