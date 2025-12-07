<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <footer class="bg-black border-t border-gray-800 text-white py-12">
    <div class="container mx-auto px-6 lg:px-12">

      <div class="grid md:grid-cols-4 gap-8 mb-8">

        <div>
          <h3 class="text-2xl font-black mb-4">A CRAZY DAY<br>IN ACCRA</h3>
          <p class="text-gray-400 text-sm">
            Experience the ultimate thriller set in the heart of Accra.
          </p>
        </div>

        <div>
          <h4 class="font-bold mb-4">Quick Links</h4>
          <div class="space-y-2">
            <Link href="/" class="block text-gray-400 hover:text-red-600">Home</Link>
            <Link href="/details" class="block text-gray-400 hover:text-red-600">Details</Link>
            <Link href="/credits" class="block text-gray-400 hover:text-red-600">Credits</Link>
            <Link href="/gallery" class="block text-gray-400 hover:text-red-600">Gallery</Link>
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-4">Legal</h4>
          <div class="space-y-2">
            <Link href="/privacy" class="block text-gray-400 hover:text-red-600">Privacy Policy</Link>
            <Link href="/terms" class="block text-gray-400 hover:text-red-600">Terms of Service</Link>
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-4">Follow Us</h4>
          <div class="flex space-x-4">
            <a href="#" aria-label="Facebook" class="text-gray-400 hover:text-red-600">FB</a>
            <a href="#" aria-label="Twitter" class="text-gray-400 hover:text-red-600">X</a>
            <a href="#" aria-label="Instagram" class="text-gray-400 hover:text-red-600">IG</a>
          </div>
        </div>

      </div>

      <div class="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
        © {{ new Date().getFullYear() }} A Crazy Day In Accra. All rights reserved.
      </div>

    </div>
  </footer>
</template>
