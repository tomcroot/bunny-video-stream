<template>
  <div
    ref="playerContainer"
    class="relative w-full h-screen bg-black overflow-hidden"
    :class="{ 'cursor-none': !controlsVisible && isPlaying }"
    @mousemove="showControls"
    @mouseleave="hideControlsDelayed"
    @contextmenu.prevent
  >
    <!-- VIDEO ELEMENT -->
    <video
      ref="player"
      class="w-full h-full object-contain"
      playsinline
      preload="auto"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @play="onPlay"
      @pause="onPause"
      @waiting="onWaiting"
      @playing="onPlaying"
      @ended="onEnded"
      @volumechange="onVolumeChange"
      @error="onError"
      @click="togglePlayPause"
      @dblclick="toggleFullscreen"
    />

    <!-- GRADIENT OVERLAYS -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500"
        :class="controlsVisible ? 'opacity-100' : 'opacity-0'"
      ></div>
      <div
        class="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-500"
        :class="controlsVisible ? 'opacity-100' : 'opacity-0'"
      ></div>
    </div>

    <!-- TOP BAR -->
    <div
      class="absolute top-0 left-0 right-0 px-4 md:px-8 py-4 flex items-center justify-between z-40 transition-all duration-500"
      :class="controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'"
    >
      <!-- Back Button -->
      <button @click.stop="goBack" class="flex items-center gap-3 text-white hover:text-gray-300 transition-colors group">
        <svg class="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        <span class="hidden md:inline font-medium">Back to Browse</span>
      </button>

      <!-- Watermark -->
      <div class="text-xs text-white/20 tracking-[0.2em] select-none font-light">
        PROMISE LAND FILMS
      </div>
    </div>

    <!-- MOVIE INFO (visible on pause) -->
    <div
      class="absolute bottom-36 md:bottom-40 left-4 md:left-8 z-30 max-w-md md:max-w-lg transition-all duration-700 ease-out"
      :class="showMovieInfo ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'"
    >
      <h1 class="text-2xl md:text-4xl font-bold mb-2 md:mb-3 drop-shadow-2xl leading-tight">
        {{ videoTitle }}
      </h1>
      <div class="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-300 mb-2 md:mb-3">
        <span class="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">18+</span>
        <span class="text-white/80">{{ formattedDuration }}</span>
        <span class="hidden md:inline text-white/50">•</span>
        <span class="hidden md:inline text-white/80">2024</span>
        <span class="text-green-500 font-semibold">{{ videoQuality }}</span>
      </div>
      <p class="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
        {{ pageContent?.description || 'One wild day. One city. Infinite chaos. A fast-paced Accra adventure like never before.' }}
      </p>
    </div>

    <!-- CUSTOM CONTROLS BAR -->
    <div
      class="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-4 md:pb-6 z-40 transition-all duration-500"
      :class="controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'"
      @click.stop
    >
      <!-- Progress Bar -->
      <div class="mb-3 md:mb-4 group">
        <div
          ref="progressBar"
          class="relative h-1 group-hover:h-2 bg-white/20 rounded-full cursor-pointer transition-all duration-200"
          @click="seekTo"
          @mousedown="startDragging"
          @mousemove="updateHoverTime"
          @mouseleave="hoverTime = null"
          @touchstart="handleTouchSeek"
        >
          <!-- Buffered -->
          <div
            class="absolute h-full bg-white/30 rounded-full transition-all"
            :style="{ width: bufferedPercent + '%' }"
          ></div>
          <!-- Progress -->
          <div
            class="absolute h-full bg-red-600 rounded-full"
            :style="{ width: progressPercent + '%' }"
          ></div>
          <!-- Scrubber Handle -->
          <div
            class="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200"
            :style="{ left: `calc(${progressPercent}% - 6px)` }"
          ></div>
          <!-- Hover Preview Time -->
          <div
            v-if="hoverTime !== null"
            class="absolute -top-10 px-2 py-1 bg-black/95 text-white text-xs rounded-md transform -translate-x-1/2 shadow-lg"
            :style="{ left: hoverPercent + '%' }"
          >
            {{ formatTime(hoverTime) }}
          </div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex items-center justify-between">
        <!-- Left Controls -->
        <div class="flex items-center gap-2 md:gap-5">
          <!-- Play/Pause -->
          <button @click.stop="togglePlayPause" class="text-white hover:text-white/80 transition-all hover:scale-110 active:scale-95">
            <svg v-if="isPlaying" class="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
            <svg v-else class="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <!-- Rewind 10s -->
          <button @click.stop="skip(-10)" class="text-white hover:text-white/80 transition-all hover:scale-110 active:scale-95 relative">
            <svg class="w-7 h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
              <path d="M5.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0012 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
            </svg>
            <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold">10</span>
          </button>

          <!-- Forward 10s -->
          <button @click.stop="skip(10)" class="text-white hover:text-white/80 transition-all hover:scale-110 active:scale-95 relative">
            <svg class="w-7 h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path d="M11.934 12.8a1 1 0 010-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4z"/>
              <path d="M18.934 12.8a1 1 0 010-1.6l-5.334-4A1 1 0 0012 8v8a1 1 0 001.6.8l5.334-4z"/>
            </svg>
            <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold">10</span>
          </button>

          <!-- Volume (desktop only) -->
          <div class="hidden md:flex items-center gap-2 group/vol">
            <button @click.stop="toggleMute" class="text-white hover:text-white/80 transition-all">
              <svg v-if="isMuted || volume === 0" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
              <svg v-else-if="volume < 0.5" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
              </svg>
              <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </button>
            <div class="w-0 group-hover/vol:w-24 overflow-hidden transition-all duration-300">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                :value="volume"
                @input="setVolume"
                @click.stop
                class="w-full h-1 appearance-none bg-white/30 rounded-full cursor-pointer accent-red-600"
              />
            </div>
          </div>

          <!-- Time Display -->
          <div class="text-white text-xs md:text-sm font-medium tabular-nums ml-1 md:ml-0">
            <span class="text-white">{{ formatTime(currentTime) }}</span>
            <span class="text-white/50 mx-1">/</span>
            <span class="text-white/70">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-3 md:gap-4">
          <!-- Quality Badge -->
          <div class="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs font-semibold text-white/90">
            {{ videoQuality }}
          </div>

          <!-- Fullscreen -->
          <button @click.stop="toggleFullscreen" class="text-white hover:text-white/80 transition-all hover:scale-110 active:scale-95">
            <svg v-if="!isFullscreen" class="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            <svg v-else class="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- CENTER PLAY BUTTON (initial or paused state) -->
    <Transition name="fade-scale">
      <div
        v-if="showCenterPlay && !isLoading"
        class="absolute inset-0 flex items-center justify-center z-30"
        @click.stop="togglePlayPause"
      >
        <button class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 group">
          <svg class="w-10 h-10 md:w-12 md:h-12 text-white ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- BUFFERING INDICATOR -->
    <Transition name="fade">
      <div v-if="isBuffering && !isLoading" class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <div class="w-14 h-14 md:w-16 md:h-16 border-4 border-white/10 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    </Transition>

    <!-- LOADING OVERLAY (initial load) -->
    <Transition name="fade">
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black z-50">
        <div class="text-center">
          <div class="w-14 h-14 md:w-16 md:h-16 border-4 border-white/10 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-white text-base md:text-lg font-medium">Loading...</p>
          <p v-if="resumeTime > 0" class="text-gray-500 text-sm mt-2">
            Resuming from {{ formatTime(resumeTime) }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- ERROR OVERLAY -->
    <Transition name="fade">
      <div v-if="errorMessage" class="absolute inset-0 flex items-center justify-center bg-black/95 z-50">
        <div class="text-center max-w-md px-6">
          <svg class="w-14 h-14 md:w-16 md:h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-white text-lg mb-4">{{ errorMessage }}</p>
          <button @click.stop="retryPlayback" class="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-colors">
            Try Again
          </button>
        </div>
      </div>
    </Transition>

    <!-- SKIP INDICATORS -->
    <Transition name="skip-left">
      <div v-if="skipIndicator === 'back'" class="absolute left-8 md:left-20 top-1/2 -translate-y-1/2 text-white z-30 pointer-events-none">
        <div class="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-3">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
          </svg>
          <span class="font-semibold">10s</span>
        </div>
      </div>
    </Transition>
    <Transition name="skip-right">
      <div v-if="skipIndicator === 'forward'" class="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 text-white z-30 pointer-events-none">
        <div class="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-3">
          <span class="font-semibold">10s</span>
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
          </svg>
        </div>
      </div>
    </Transition>

    <!-- DOUBLE TAP ZONES (mobile) -->
    <div class="absolute inset-0 flex md:hidden pointer-events-none z-20">
      <div class="w-1/3 h-full pointer-events-auto" @dblclick.stop="skip(-10)"></div>
      <div class="w-1/3 h-full"></div>
      <div class="w-1/3 h-full pointer-events-auto" @dblclick.stop="skip(10)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePage, router } from '@inertiajs/vue3'
import Hls from 'hls.js'

// No layout for immersive experience
defineOptions({ layout: null })

const page = usePage()
const csrfToken = computed(() => page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content || '')

const props = defineProps({
  fallbackVideoUrl: { type: String, required: true },
  videoTitle: { type: String, default: 'A Crazy Day in Accra' },
  pageContent: { type: Object, default: null },
  user: { type: Object, default: null },
  subscription: { type: Object, default: null },
})

// DOM Refs
const playerContainer = ref(null)
const player = ref(null)
const progressBar = ref(null)

// Video State
const isLoading = ref(true)
const isPlaying = ref(false)
const isBuffering = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const buffered = ref(0)
const volume = ref(1)
const videoQuality = ref('HD')
const errorMessage = ref('')
const resumeTime = ref(0)

// UI State
const controlsVisible = ref(true)
const showCenterPlay = ref(true)
const hoverTime = ref(null)
const hoverPercent = ref(0)
const skipIndicator = ref(null)

// Internal
let controlsTimeout = null
let hls = null
let progressInterval = null
let isDragging = false

// Computed
const progressPercent = computed(() => duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0)
const bufferedPercent = computed(() => duration.value > 0 ? (buffered.value / duration.value) * 100 : 0)
const showMovieInfo = computed(() => controlsVisible.value && !isPlaying.value)
const formattedDuration = computed(() => {
  const mins = Math.floor(duration.value / 60)
  if (mins === 0) return '--'
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`
})

// Format time (HH:MM:SS or MM:SS)
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Controls visibility
function showControls() {
  controlsVisible.value = true
  clearTimeout(controlsTimeout)
  if (isPlaying.value) {
    controlsTimeout = setTimeout(() => {
      if (isPlaying.value && !isDragging) {
        controlsVisible.value = false
      }
    }, 3000)
  }
}

function hideControlsDelayed() {
  if (isPlaying.value && !isDragging) {
    controlsTimeout = setTimeout(() => {
      controlsVisible.value = false
    }, 1500)
  }
}

// Playback Controls
function togglePlayPause() {
  if (!player.value || isLoading.value) return
  if (player.value.paused) {
    player.value.play().catch(console.error)
  } else {
    player.value.pause()
  }
}

function skip(seconds) {
  if (!player.value) return
  const newTime = Math.max(0, Math.min(duration.value, player.value.currentTime + seconds))
  player.value.currentTime = newTime
  skipIndicator.value = seconds < 0 ? 'back' : 'forward'
  setTimeout(() => skipIndicator.value = null, 600)
  showControls()
}

function toggleMute() {
  if (!player.value) return
  player.value.muted = !player.value.muted
  isMuted.value = player.value.muted
}

function setVolume(e) {
  if (!player.value) return
  const val = parseFloat(e.target.value)
  player.value.volume = val
  volume.value = val
  if (val > 0 && player.value.muted) {
    player.value.muted = false
    isMuted.value = false
  }
}

function toggleFullscreen() {
  if (!playerContainer.value) return
  if (!document.fullscreenElement) {
    playerContainer.value.requestFullscreen?.() || playerContainer.value.webkitRequestFullscreen?.()
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.()
  }
}

// Seek
function seekTo(e) {
  if (!player.value || !progressBar.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  player.value.currentTime = percent * duration.value
}

function startDragging(e) {
  isDragging = true
  seekTo(e)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDragging)
}

function onDrag(e) {
  if (isDragging && progressBar.value) {
    const rect = progressBar.value.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    if (player.value) player.value.currentTime = percent * duration.value
  }
}

function stopDragging() {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDragging)
}

function updateHoverTime(e) {
  if (!progressBar.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  hoverPercent.value = percent * 100
  hoverTime.value = percent * duration.value
}

function handleTouchSeek(e) {
  if (!progressBar.value || !player.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const touch = e.touches[0]
  const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width))
  player.value.currentTime = percent * duration.value
}

// Video Events
function onTimeUpdate() {
  if (!player.value) return
  currentTime.value = player.value.currentTime
  if (player.value.buffered.length > 0) {
    buffered.value = player.value.buffered.end(player.value.buffered.length - 1)
  }
}

function onLoadedMetadata() {
  if (!player.value) return
  duration.value = player.value.duration
  // Apply resume position after metadata loaded
  if (resumeTime.value > 0 && resumeTime.value < duration.value - 30) {
    player.value.currentTime = resumeTime.value
  }
}

function onPlay() {
  isPlaying.value = true
  showCenterPlay.value = false
  showControls()
}

function onPause() {
  isPlaying.value = false
  controlsVisible.value = true
}

function onWaiting() {
  isBuffering.value = true
}

function onPlaying() {
  isBuffering.value = false
  isLoading.value = false
}

function onEnded() {
  isPlaying.value = false
  showCenterPlay.value = true
  controlsVisible.value = true
  saveProgress(true)
}

function onVolumeChange() {
  if (!player.value) return
  volume.value = player.value.volume
  isMuted.value = player.value.muted
}

function onError(e) {
  console.error('Video error:', e)
  isLoading.value = false
  if (!errorMessage.value) {
    errorMessage.value = 'Failed to load video. Please try again.'
  }
}

// Navigation
function goBack() {
  saveProgress()
  router.visit('/')
}

function retryPlayback() {
  errorMessage.value = ''
  isLoading.value = true
  window.location.reload()
}

// Progress Persistence
function extractVideoId() {
  try {
    const url = new URL(props.fallbackVideoUrl)
    const parts = url.pathname.split('/')
    return parts[1] || 'movie-default'
  } catch {
    return 'movie-default'
  }
}

async function saveProgress(completed = false) {
  if (!player.value || !props.user) return

  const time = Math.floor(player.value.currentTime)
  const dur = Math.floor(player.value.duration) || 0
  if (time <= 5) return // Don't save if just started

  try {
    const videoId = extractVideoId()
    await fetch(`/api/watch-progress/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken.value,
      },
      body: JSON.stringify({
        current_time: completed ? 0 : time,
        total_duration: dur,
        video_title: props.videoTitle,
      }),
    })
  } catch (err) {
    console.error('Failed to save progress:', err)
  }
}

async function loadProgress() {
  if (!props.user) return 0

  try {
    const videoId = extractVideoId()
    const response = await fetch(`/api/watch-progress/${videoId}`, {
      headers: { 'Accept': 'application/json' },
    })
    if (!response.ok) return 0
    const data = await response.json()
    return data.current_time || 0
  } catch {
    return 0
  }
}

// Keyboard Shortcuts
function handleKeydown(e) {
  if (!player.value) return

  const actions = {
    ' ': () => togglePlayPause(),
    'k': () => togglePlayPause(),
    'ArrowLeft': () => skip(-10),
    'j': () => skip(-10),
    'ArrowRight': () => skip(10),
    'l': () => skip(10),
    'ArrowUp': () => { player.value.volume = Math.min(1, player.value.volume + 0.1) },
    'ArrowDown': () => { player.value.volume = Math.max(0, player.value.volume - 0.1) },
    'm': () => toggleMute(),
    'f': () => toggleFullscreen(),
    'Escape': () => { if (isFullscreen.value) toggleFullscreen() },
  }

  if (actions[e.key]) {
    e.preventDefault()
    actions[e.key]()
    showControls()
  }
}

// Initialize Player
async function initializePlayer() {
  const video = player.value
  if (!video || !props.fallbackVideoUrl) {
    errorMessage.value = 'Video source not available'
    isLoading.value = false
    return
  }

  // Load saved progress first
  resumeTime.value = await loadProgress()

  if (Hls.isSupported()) {
    hls = new Hls({
      autoStartLoad: true,
      enableWorker: true,
      lowLatencyMode: false,
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      startLevel: -1,
    })

    hls.loadSource(props.fallbackVideoUrl)
    hls.attachMedia(video)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      isLoading.value = false
    })

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        isLoading.value = false
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            errorMessage.value = 'Network error. Please check your connection.'
            setTimeout(() => hls?.startLoad(), 3000)
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError()
            break
          default:
            errorMessage.value = 'Playback error. Please refresh the page.'
            break
        }
      }
    })

    hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
      const level = hls.levels[data.level]
      if (level) {
        videoQuality.value = level.height >= 1080 ? '4K' : level.height >= 720 ? 'HD' : 'SD'
      }
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari native HLS
    video.src = props.fallbackVideoUrl
    video.addEventListener('canplay', () => {
      isLoading.value = false
    })
  } else {
    errorMessage.value = 'Your browser does not support video playback.'
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  initializePlayer()

  // Save progress periodically
  progressInterval = setInterval(() => {
    if (isPlaying.value && !isDragging) saveProgress()
  }, 10000)

  // Event listeners
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveProgress()
  })
  window.addEventListener('beforeunload', () => saveProgress())
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  if (hls) hls.destroy()
  if (progressInterval) clearInterval(progressInterval)
  if (controlsTimeout) clearTimeout(controlsTimeout)
  window.removeEventListener('keydown', handleKeydown)
  saveProgress()
})
</script>

<style scoped>
/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.skip-left-enter-active, .skip-left-leave-active,
.skip-right-enter-active, .skip-right-leave-active {
  transition: all 0.4s ease;
}
.skip-left-enter-from, .skip-left-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-30px) scale(0.8);
}
.skip-right-enter-from, .skip-right-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(30px) scale(0.8);
}

/* Hide native video controls completely */
video::-webkit-media-controls {
  display: none !important;
}
video::-webkit-media-controls-enclosure {
  display: none !important;
}
video::-webkit-media-controls-panel {
  display: none !important;
}

/* Custom range input styling */
input[type="range"] {
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #dc2626;
  margin-top: -5px;
}
input[type="range"]::-moz-range-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}
input[type="range"]::-moz-range-thumb {
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #dc2626;
  border: none;
}

/* Prevent selection */
* {
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

/* Custom cursor hide */
.cursor-none {
  cursor: none;
}
</style>
