<template>
  <div class="flex items-center gap-3">
    <button
      @click="shareTwitter"
      class="p-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
      title="Share on Twitter"
      aria-label="Share on Twitter"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 2 11.12.5.985-.624 1.956-1.674 2.573-2.88z" />
      </svg>
    </button>

    <button
      @click="shareFacebook"
      class="p-2 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 transition-colors"
      title="Share on Facebook"
      aria-label="Share on Facebook"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
      </svg>
    </button>

    <button
      @click="shareLinkedIn"
      class="p-2 rounded-full bg-blue-700/10 text-blue-700 hover:bg-blue-700/20 transition-colors"
      title="Share on LinkedIn"
      aria-label="Share on LinkedIn"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    </button>

    <button
      @click="copyLink"
      class="p-2 rounded-full bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 transition-colors"
      title="Copy link"
      aria-label="Copy link"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'A Crazy Day in Accra - Official Film'
  },
   description: {
     type: String,
     default: 'Stream A Crazy Day in Accra on A Crazy Day in Accra'
   },
  url: {
    type: String,
    default: () => window.location.href
  },
   hashtags: {
     type: Array,
     default: () => ['ACrazydayinAccra', 'ACrazyDayInAccra', 'ShortFilm']
   }
})

const copyFeedback = ref('')

const shareTwitter = () => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(props.url)}&hashtags=${props.hashtags.join(',')}`
  window.open(twitterUrl, 'twitter-share', 'width=550,height=420')
}

const shareFacebook = () => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`
  window.open(facebookUrl, 'facebook-share', 'width=550,height=420')
}

const shareLinkedIn = () => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`
  window.open(linkedInUrl, 'linkedin-share', 'width=550,height=420')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    copyFeedback.value = 'Copied!'
    setTimeout(() => {
      copyFeedback.value = ''
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
