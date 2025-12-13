<template>
  <div class="relative min-h-screen bg-black text-white overflow-hidden">

    <!-- CINEMA OVERLAY -->
    <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/40 to-black z-10"></div>

    <!-- VIDEO PLAYER -->
    <div
      class="relative w-full h-screen flex items-center justify-center bg-black"
      @contextmenu.prevent
    >
      <video
        ref="player"
        class="w-full h-full object-contain"
        playsinline
        autoplay
        muted
        preload="auto"
        controls
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
      />

      <!-- CINEMA TITLE OVERLAY -->
      <div class="absolute bottom-24 left-12 z-20 max-w-xl">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
          {{ videoTitle }}
        </h1>

        <div class="flex items-center gap-4 text-sm mb-4 text-gray-300">
          <span class="px-2 py-1 bg-red-600 rounded">18+</span>
          <span>1h 42m</span>
          <span>Action • Comedy • Thriller</span>
          <span class="text-green-400 font-semibold">{{ videoQuality }}</span>
        </div>

        <p class="text-gray-300 leading-relaxed">
          One wild day. One city. Infinite chaos. A fast-paced Accra adventure like never before.
        </p>
      </div>

      <!-- LOADING OVERLAY -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p class="text-white text-lg">Loading video...</p>
        </div>
      </div>

      <!-- ERROR OVERLAY -->
      <div v-if="errorMessage" class="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
        <div class="text-center max-w-md px-6">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-white text-lg mb-4">{{ errorMessage }}</p>
          <button
            @click="() => { errorMessage = ''; isLoading = true; window.location.reload() }"
            class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- WATERMARK (ANTI-RECORDING DETERRENT) -->
      <div class="absolute top-6 right-6 z-20 text-xs text-white/40 tracking-widest select-none">
        PROMISE LAND FILMS • {{ watermarkId }}
      </div>

      <!-- SUBSCRIPTION EXPIRY WARNING -->
      <div v-if="subscription && subscription.days_left <= 30" class="absolute top-6 left-6 z-20">
        <div class="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span>Access expires in {{ subscription.days_left }} {{ subscription.days_left === 1 ? 'day' : 'days' }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Hls from 'hls.js'
import PublicLayout from '@/Layouts/PublicLayout.vue'

defineOptions({
  layout: PublicLayout,
})

const props = defineProps({
  fallbackVideoUrl: {
    type: String,
    required: true,
  },
  videoTitle: {
    type: String,
    default: 'A Crazy Day in Accra',
  },
  banner: {
    type: Object,
    default: null,
  },
  user: {
    type: Object,
    default: null,
  },
  subscription: {
    type: Object,
    default: null,
  },
})

const player = ref(null)
const hls = ref(null)
const watermarkId = Math.random().toString(36).slice(2, 12).toUpperCase()
const isLoading = ref(true)
const errorMessage = ref('')
const videoQuality = ref('HD')
let progressInterval = null

/* ✅ ✅ HLS LOGIC (BULLETPROOF) */
onMounted(async () => {
  const video = player.value
  if (!video || !props.fallbackVideoUrl) {
    errorMessage.value = 'No video source available'
    isLoading.value = false
    return
  }

  // Load previous watch progress if user is authenticated
  const videoId = new URL(props.fallbackVideoUrl).pathname.split('/')[1]
  try {
    const response = await fetch(`/api/watch-progress/${videoId}`)
    const data = await response.json()
    if (data.current_time > 0) {
      video.currentTime = data.current_time
    }
  } catch (err) {
    console.log('No previous progress found')
  }

  // Disable keyboard shortcuts for capture tools
  window.addEventListener('keydown', blockKeys)

  if (Hls.isSupported()) {
    hls.value = new Hls({
      autoStartLoad: true,
      enableWorker: true,
      lowLatencyMode: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
    })

    hls.value.loadSource(props.fallbackVideoUrl)
    hls.value.attachMedia(video)

    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
      isLoading.value = false
      video.muted = false
      video.play().catch(err => {
        console.error('Playback failed:', err)
        errorMessage.value = 'Auto-play blocked. Please click play.'
      })
    })

    hls.value.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        isLoading.value = false
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            errorMessage.value = 'Network error. Check your connection.'
            setTimeout(() => hls.value?.startLoad(), 2000)
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            errorMessage.value = 'Media error. Recovering...'
            hls.value.recoverMediaError()
            break
          default:
            errorMessage.value = 'Playback error. Please refresh.'
            break
        }
      }
    })

    // Track quality changes
    hls.value.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
      const level = hls.value.levels[data.level]
      videoQuality.value = level.height >= 1080 ? 'Ultra HD' : level.height >= 720 ? 'HD' : 'SD'
    })
  }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = props.fallbackVideoUrl
    video.addEventListener('loadedmetadata', () => {
      isLoading.value = false
      video.muted = false
      video.play().catch(err => {
        console.error('Playback failed:', err)
        errorMessage.value = 'Auto-play blocked. Please click play.'
      })
    })
  } else {
    errorMessage.value = 'HLS not supported in this browser'
    isLoading.value = false
  }

  // 🔒 Disable native download hotkeys
  video.addEventListener('contextmenu', e => e.preventDefault())
  video.addEventListener('loadeddata', () => isLoading.value = false)
  video.addEventListener('error', () => {
    isLoading.value = false
    errorMessage.value = 'Failed to load video'
  })

  // 💾 Save progress every 10 seconds
  progressInterval = setInterval(async () => {
    if (!video.paused && video.duration > 0) {
      const videoId = new URL(props.fallbackVideoUrl).pathname.split('/')[1]
      try {
        await fetch(`/api/watch-progress/${videoId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_time: Math.floor(video.currentTime),
            total_duration: Math.floor(video.duration),
            video_title: props.videoTitle,
          }),
        })
      } catch (err) {
        console.error('Failed to save progress:', err)
      }
    }
  }, 10000)
})

onUnmounted(() => {
  if (hls.value) hls.value.destroy()
  if (progressInterval) clearInterval(progressInterval)
  window.removeEventListener('keydown', blockKeys)
})

/* ✅ ✅ BLOCK RECORDING HOTKEYS (DETERRENT) */
function blockKeys(e) {
  // Windows Snip, PrintScreen, DevTools
  if (
    e.key === 'PrintScreen' ||
    e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key) ||
    e.ctrlKey && ['U','S'].includes(e.key)
  ) {
    e.preventDefault()
    return false
  }
}
</script>

<style scoped>
/* ✅ Hide video download & pip buttons */
video::-webkit-media-controls-enclosure {
  overflow: hidden;
}

video::-webkit-media-controls-panel {
  width: calc(100% + 30px);
}

/* ✅ Block text/image selection */
* {
  user-select: none;
}

/* ✅ Anti-drag */
img, video {
  pointer-events: auto;
  -webkit-user-drag: none;
}
</style>
