<script setup>
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

const isOpen = ref(false)
const activeTab = ref('contact') // 'contact' or 'review'

const contactForm = useForm({
  name: '',
  email: '',
  message: '',
})

const reviewForm = useForm({
  author_name: '',
  email: '',
  rating: 5,
  content: '',
})

const submitContact = () => {
  contactForm.post('/contact', {
    onSuccess: () => {
      contactForm.reset()
      isOpen.value = false
    },
  })
}

const submitReview = () => {
  reviewForm.post('/reviews', {
    onSuccess: () => {
      reviewForm.reset()
      reviewForm.rating = 5
      activeTab.value = 'contact'
      // Redirect to Details page after successful review submission
      window.location.href = '/details#reviews'
    },
  })
}

const toggleBubble = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 font-sans">
    <!-- Chat Bubble -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <div v-if="isOpen" class="absolute bottom-20 right-0 w-96 bg-black border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-red-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white">Contact & Reviews</h3>
          <p class="text-sm text-white/80">Get in touch or share your thoughts</p>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-700 bg-black/50">
          <button
            @click="activeTab = 'contact'"
            :class="activeTab === 'contact'
              ? 'border-b-2 border-red-600 text-white'
              : 'text-gray-400 hover:text-white'
            "
            class="flex-1 px-4 py-3 font-semibold transition-colors"
          >
            Contact
          </button>
          <button
            @click="activeTab = 'review'"
            :class="activeTab === 'review'
              ? 'border-b-2 border-red-600 text-white'
              : 'text-gray-400 hover:text-white'
            "
            class="flex-1 px-4 py-3 font-semibold transition-colors"
          >
            Review
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 max-h-[500px] overflow-y-auto">
          <!-- CONTACT TAB -->
          <form v-if="activeTab === 'contact'" @submit.prevent="submitContact" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-white mb-2">Name</label>
              <input
                v-model="contactForm.name"
                type="text"
                placeholder="Your name"
                class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <span v-if="contactForm.errors.name" class="text-red-500 text-xs mt-1">{{ contactForm.errors.name }}</span>
            </div>

            <div>
              <label class="block text-sm font-semibold text-white mb-2">Email</label>
              <input
                v-model="contactForm.email"
                type="email"
                placeholder="your@email.com"
                class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <span v-if="contactForm.errors.email" class="text-red-500 text-xs mt-1">{{ contactForm.errors.email }}</span>
            </div>

            <div>
              <label class="block text-sm font-semibold text-white mb-2">Message</label>
              <textarea
                v-model="contactForm.message"
                placeholder="Tell us what's on your mind..."
                rows="4"
                class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors resize-none"
              ></textarea>
              <span v-if="contactForm.errors.message" class="text-red-500 text-xs mt-1">{{ contactForm.errors.message }}</span>
            </div>

            <button
              type="submit"
              :disabled="contactForm.processing"
              class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              <span v-if="contactForm.processing">Sending...</span>
              <span v-else>Send Message</span>
            </button>
          </form>

          <!-- REVIEW TAB -->
          <form v-else-if="activeTab === 'review'" @submit.prevent="submitReview" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-white mb-2">Your Name</label>
              <input
                v-model="reviewForm.author_name"
                type="text"
                placeholder="Display name"
                class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <span v-if="reviewForm.errors.author_name" class="text-red-500 text-xs mt-1">{{ reviewForm.errors.author_name }}</span>
            </div>

            <div>
              <label class="block text-sm font-semibold text-white mb-2">Email</label>
              <input
                v-model="reviewForm.email"
                type="email"
                placeholder="your@email.com"
                class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <span v-if="reviewForm.errors.email" class="text-red-500 text-xs mt-1">{{ reviewForm.errors.email }}</span>
            </div>

            <div>
              <label class="block text-sm font-semibold text-white mb-2">Rating</label>
              <div class="flex gap-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="reviewForm.rating = star"
                  type="button"
                  class="text-2xl transition-colors"
                  :class="star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'"
                >
                  ★
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-white mb-2">Your Review</label>
              <textarea
                v-model="reviewForm.content"
                placeholder="What did you think about the film?"
                rows="4"
                class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors resize-none"
              ></textarea>
              <span v-if="reviewForm.errors.content" class="text-red-500 text-xs mt-1">{{ reviewForm.errors.content }}</span>
            </div>

            <button
              type="submit"
              :disabled="reviewForm.processing"
              class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              <span v-if="reviewForm.processing">Submitting...</span>
              <span v-else>Submit Review</span>
            </button>
          </form>
        </div>
      </div>
    </transition>

    <!-- Floating Button -->
    <button
      @click="toggleBubble"
      class="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
      :class="isOpen ? 'scale-75' : 'scale-100'"
    >
      <svg v-if="!isOpen" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-.606v-5.585c0-1.416-.507-2.368-1.86-2.368-.85 0-1.35.572-1.573 1.125-.081.197-.102.472-.102.748v5.08h-.606c0 0 .008-8.246 0-9.102h.606v1.29c-.009.014-.021.035-.035.047h.035v-.047c.537-.826 1.487-2.01 3.612-2.01 2.638 0 4.614 1.725 4.614 5.435v4.402zM5.337 5.432c-.762 0-1.263-.505-1.263-1.137C4.074 3.771 4.576 3.27 5.399 3.27c.76 0 1.263.501 1.29 1.125 0 .632-.53 1.137-1.352 1.137zm.766 15.02H4.57V11.35h1.533v9.102zM17.467 3.007c-3.134 0-5.148 1.623-5.148 5.159v.286h-1.054V17.85h1.509v-8.54c0-1.416.504-2.368 1.86-2.368.85 0 1.35.572 1.574 1.125.081.197.101.472.101.748v8.035h1.509v-8.612c0-2.26-1.202-3.433-3.351-3.433z"/>
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* Scrollbar styling */
::-webkit-scrollbar {
  inline-size: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.8);
}
</style>
