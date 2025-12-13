<template>
  <div class="min-h-screen bg-background">
    <!-- Admin Navbar -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="text-xl font-bold text-foreground">Admin Dashboard</div>
          <nav class="flex items-center space-x-6">
            <Link href="/admin" class="text-muted-foreground hover:text-foreground font-semibold transition-colors">Dashboard</Link>
            <Link href="/admin/banners" class="text-muted-foreground hover:text-foreground transition-colors">Banners</Link>
            <Link href="/admin/cast-crew" class="text-muted-foreground hover:text-foreground transition-colors">Cast & Crew</Link>
            <Link href="/admin/gallery" class="text-muted-foreground hover:text-foreground transition-colors">Gallery</Link>
            <Link href="/admin/reviews" class="text-muted-foreground hover:text-foreground transition-colors">Reviews</Link>
            <Link href="/admin/page-content" class="text-muted-foreground hover:text-foreground transition-colors">Details</Link>
            <Link href="/admin/subscribers" class="text-muted-foreground hover:text-foreground transition-colors">Subscribers</Link>
            <Link href="/admin/settings" class="text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
            <Link href="/logout" method="post" as="button" class="text-red-500 hover:text-red-600 transition-colors">Logout</Link>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <slot />
  </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
</script>
