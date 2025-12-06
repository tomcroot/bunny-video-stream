<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Navbar -->
    <header class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="text-xl font-bold">A Crazy Day in Accra</div>
          <nav class="flex items-center space-x-6">
            <a href="/" class="text-muted-foreground hover:text-foreground font-semibold transition-colors">Home</a>
            <a href="/information" class="text-muted-foreground hover:text-foreground transition-colors">Information</a>
            <a href="/credits" class="text-muted-foreground hover:text-foreground transition-colors">Credits</a>
            <a href="/contact" class="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            <a href="/gallery" class="text-muted-foreground hover:text-foreground transition-colors">Gallery</a>
            <template v-if="$page.props.auth?.user">
              <a href="/dashboard" class="text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
              <form method="POST" action="/logout" class="inline">
                <input type="hidden" name="_token" :value="csrfToken" />
                <button type="submit" class="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Logout
                </button>
              </form>
            </template>
            <a v-else href="/login" class="text-muted-foreground hover:text-foreground transition-colors">Login</a>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 mb-4 md:mb-0">© 2025 A Crazy Day in Accra. All rights reserved.</p>
          <div class="flex space-x-6">
            <a href="/terms" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import ModeToggle from '@/components/ModeToggle.vue'
import { computed } from 'vue'

// Get CSRF token from meta tag
const csrfToken = computed(() => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
})
</script>
