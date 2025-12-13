<template>
    <div class="min-h-screen bg-black text-white overflow-x-hidden">
      <!-- HERO CINEMATIC BANNER WITH AUTO-PLAYING TRAILER -->
      <section
        ref="heroSection"
        class="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden"
        @mousemove="handleMouseMove"
      >
        <!-- VIDEO PLAYER HERO -->
        <div
          class="absolute inset-0 w-full h-full bg-black z-0"
        >
          <video
            v-if="resolvedTrailerUrl"
            ref="trailerVideo"
            class="w-full h-full object-cover relative z-10"
            playsinline
            :muted="isMuted"
            preload="metadata"
            @loadstart="onVideoLoadStart"
            @loadeddata="onVideoLoaded"
            @canplay="onVideoCanPlay"
            @ended="onTrailerEnded"
            @play="onVideoPlay"
            @pause="onVideoPause"
            @error="onVideoError"
            @contextmenu.prevent
          ></video>

          <!-- Loading Spinner -->
          <div
            v-if="resolvedTrailerUrl && videoLoading"
            class="absolute inset-0 flex items-center justify-center bg-black/80 z-20"
          >
            <div class="text-center">
              <div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-white text-sm">Loading trailer...</p>
            </div>
          </div>

          <!-- Fallback background if no video -->
          <div
            v-else
            class="pointer-events-none absolute inset-0 bg-cover bg-center will-change-transform"
            :style="heroBgStyle"
          />
        </div>

        <!-- Netflix-style Unmute Button - Fixed Position Outside Video Container -->
        <button
          v-if="resolvedTrailerUrl && !videoLoading"
          @click="toggleMute"
          class="fixed bottom-24 right-8 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-white/80 bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all hover:scale-105 shadow-2xl"
          style="pointer-events: auto !important;"
        >
          <svg v-if="isMuted" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
          <svg v-else class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <span class="text-white font-semibold text-sm">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
        </button>

        <!-- Small watermark deterrent -->
        <div
          v-if="resolvedTrailerUrl"
          class="absolute top-4 right-6 z-20 text-xs text-white/35 tracking-widest select-none pointer-events-none"
        >
          PROMISE LAND FILMS • PREVIEW
        </div>

        <!-- Cinema overlay gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-5"
          :style="{ opacity: showHeroContent ? 0.5 : 0.2, transition: 'opacity 1s ease-out' }"
        />

        <!-- Film grain overlay -->
        <div class="pointer-events-none absolute inset-0 opacity-10 mix-blend-soft-light grain z-30" />

        <!-- Hero content - FADES IN AFTER VIDEO PLAYS / ENDS -->
        <div
          class="relative z-40 max-w-5xl px-6 text-center transition-all duration-1000"
          :style="{
            opacity: showHeroContent ? 1 : 0,
            transform: showHeroContent ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: showHeroContent ? 'auto' : 'none'
          }"
        >
          <p class="text-xs uppercase tracking-[0.35em] text-red-400 mb-4 opacity-80">
            Promise Land Films Original
          </p>
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-xl leading-tight">
            {{ heroTitle }}
          </h1>

          <!-- Meta row -->
          <div class="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300 mb-4">
            <span class="px-2 py-0.5 border border-white/50 rounded text-xs font-semibold">
              {{ movieMeta.rating }}
            </span>
            <span>{{ movieMeta.year }}</span>
            <span>•</span>
            <span>{{ movieMeta.runtime }}</span>
            <span>•</span>
            <span class="flex flex-wrap gap-2">
              <span v-for="genre in movieMeta.genres" :key="genre" class="text-gray-300">
                {{ genre }}
              </span>
            </span>
          </div>

          <!-- Premiere countdown -->
          <div class="mb-6 text-sm">
            <div
              class="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs md:text-sm text-gray-100"
            >
              <span v-if="!countdown.isPast" class="flex items-center gap-2">
                ⏳
                <span class="font-semibold">Premieres in</span>
                <span>
                  {{ countdown.days }}d
                  {{ countdown.hours }}h
                  {{ countdown.minutes }}m
                  {{ countdown.seconds }}s
                </span>
              </span>
              <span v-else class="flex items-center gap-2 text-green-400">
                ✅ <span class="font-semibold">Now streaming exclusively on Promise Land Films</span>
              </span>
              <span class="hidden md:inline text-gray-300/80 ml-2">
                {{ premiereLabel }}
              </span>
            </div>
          </div>

          <p class="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            {{ heroMessage }}
          </p>

          <!-- CTAs change based on premiere -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <!-- BEFORE PREMIERE: Watch Trailer / Remind Me -->
            <button
              class="px-10 py-4 bg-red-600 hover:bg-red-700 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-3 hero-cta"
              @click="handlePrimaryCta"
            >
              <span class="inline-flex h-8 w-8 rounded-full bg-white/15 items-center justify-center">
                ▶
              </span>
              <span>{{ heroCtaLabel }}</span>
            </button>
            <button
              v-if="!countdown.isPast && !heroCtaUrl"
              @click="notifyPremiere"
              class="px-10 py-4 border border-white/30 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/60 transition-all flex items-center gap-2"
              :disabled="notifyState.loading"
            >
              <span>🔔</span>
              <span>
                {{ notifyState.success ? 'Reminded' : (notifyState.loading ? 'Please wait...' : 'Remind Me') }}
              </span>
            </button>
          </div>

          <!-- Notify email form for guests -->
          <div
            v-if="notifyState.showForm && !user && !countdown.isPast"
            class="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs md:text-sm"
          >
            <input
              v-model="notifyState.email"
              type="email"
              placeholder="Enter your email for a launch reminder"
              class="w-full sm:w-72 px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              @click="submitNotifyEmail"
              class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
              :disabled="notifyState.loading"
            >
              Save
            </button>
          </div>

          <p v-if="notifyState.error" class="mt-2 text-xs text-red-400">
            {{ notifyState.error }}
          </p>
          <p v-if="notifyState.success" class="mt-2 text-xs text-green-400">
            {{ notifyState.success }}
          </p>
        </div>
      </section>

      <!-- SPONSORS SECTION - Bottom of Banner Section -->
      <section
        v-if="sponsors && sponsors.length > 0"
        class="py-16 px-6 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800"
      >
        <div class="max-w-6xl mx-auto">
          <h2 class="text-xl md:text-2xl font-bold mb-10 text-center text-gray-300">
            Our Partners
          </h2>

          <!-- Sponsors Grid - Responsive -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center">
            <a
              v-for="(sponsor, index) in sponsors"
              :key="index"
              :href="sponsor.website_url || '#'"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative w-full aspect-video flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]"
            >
              <img
                :src="sponsor.logo_url"
                :alt="sponsor.name"
                class="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </section>

      <!-- FEATURED CONTENT (Trailer + Movie for authenticated users) -->
      <section v-if="user" class="py-16 px-6 bg-black">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            Featured Content
          </h2>

          <div class="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            <!-- Full Movie Card -->
            <div
              class="min-w-[280px] group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              @click="watchMovie"
            >
              <div class="relative rounded-xl overflow-hidden bg-gray-900">
                <img
                  :src="'/movie_poster_2.jpg'"
                  alt="Full Movie"
                  class="w-full h-[160px] object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <!-- Play button overlay -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-red-600/80 flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all">
                    <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                <div class="absolute bottom-3 left-3 right-3">
                  <span class="inline-block px-2 py-1 bg-red-600 text-xs font-semibold rounded mb-1">FULL MOVIE</span>
                  <p class="text-sm font-bold text-white">A Crazy Day in Accra</p>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-400">1h 42m • Action, Comedy, Thriller</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTINUE WATCHING -->
      <section v-if="continueWatching.length > 0" class="py-16 px-6 bg-black">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">
            Continue Watching
          </h2>

          <div class="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            <div
              v-for="item in continueWatching"
              :key="item.id"
              class="min-w-[220px] group cursor-pointer"
              @click="watchMovie"
            >
              <div class="relative rounded-xl overflow-hidden">
                <img
                  :src="item.poster"
                  :alt="item.title"
                  class="w-full h-[130px] object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <!-- dark gradient -->
                <div class="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                <!-- Progress bar -->
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div class="h-1 bg-red-500" :style="{ inlineSize: item.progress + '%' }" />
                </div>

                <!-- Time left -->
                <div class="absolute bottom-3 right-3 text-[10px] bg-black/70 px-2 py-0.5 rounded-full">
                  {{ item.timeLeft }}
                </div>
              </div>

              <p class="mt-2 text-sm font-semibold">
                {{ item.title }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- EPISODES / SCENES -->
      <section v-if="showEpisodes" class="py-16 px-6 bg-black">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl md:text-3xl font-bold">
              Episodes &amp; Extras
            </h2>
            <span class="text-sm text-gray-400">Season 1</span>
          </div>

          <div class="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            <div
              v-for="episode in episodes"
              :key="episode.id"
              class="min-w-[260px] bg-gray-900 rounded-xl overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div class="relative h-[140px]">
                <img
                  :src="episode.thumbnail"
                  :alt="episode.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-gray-200">
                  <span class="bg-black/60 px-2 py-0.5 rounded-full">
                    Episode {{ episode.number }}
                  </span>
                  <span class="bg-black/60 px-2 py-0.5 rounded-full">
                    {{ episode.duration }}
                  </span>
                </div>
              </div>
              <div class="p-3">
                <p class="font-semibold text-sm mb-1 truncate">
                  {{ episode.title }}
                </p>
                <p class="text-xs text-gray-400 line-clamp-2">
                  {{ episode.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TRAILER SECTION (secondary official trailer player) -->
      <section
        id="trailer"
        ref="trailerSection"
        class="relative py-24 px-6 max-w-6xl mx-auto transition-all duration-700 ease-out hidden"
        :class="trailerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-10 text-center">
          Official Trailer
        </h2>

        <div class="relative rounded-lg overflow-hidden shadow-2xl border border-gray-700 bg-black">
          <div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/50 pointer-events-none" />
          <video
            v-if="resolvedTrailerUrl"
            ref="trailerVideoSection"
            class="w-full h-[260px] md:h-[480px] bg-black"
            controls
            playsinline
            preload="auto"
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            @contextmenu.prevent
          ></video>
        </div>
      </section>

      <section
        ref="castSection"
        class="py-24 px-6 bg-black transition-all duration-700 ease-out"
        :class="castVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-14 text-center">
            Cast & Crew
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div
              v-for="member in castCrew"
              :key="member.id"
              class="group text-center transform transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="relative mb-4 aspect-[3/4] overflow-hidden rounded-lg">
                <div class="absolute inset-0 bg-red-500/25 blur-xl opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                <img
                  :src="member.image_url"
                  :alt="member.stage_name"
                  class="relative w-full h-full object-cover border border-white/20 group-hover:border-red-500/70 group-hover:shadow-[0_0_25px_rgba(248,113,113,0.55)] transition-all duration-300 rounded-lg"
                />
              </div>
              <p class="font-semibold text-base">{{ member.stage_name }}</p>
              <p class="text-sm text-gray-400">{{ member.job_title }}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        ref="reviewsSection"
        class="py-24 px-6 bg-black transition-all duration-700 ease-out"
        :class="reviewsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center">
            Reviews
          </h2>

        <div class="space-y-8">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="bg-linear-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-8 shadow-xl hover:shadow-[0_0_40px_rgba(0,0,0,0.7)] hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-4">
              <p class="font-bold text-lg">{{ review.author_name }}</p>
              <div class="text-yellow-400 text-lg tracking-widest drop-shadow">
                {{ '★'.repeat(review.rating) }}
              </div>
            </div>
            <p class="text-gray-300 leading-relaxed">
              "{{ review.content }}"
            </p>
          </div>

          <div v-if="reviews.length === 0" class="text-center text-gray-500 text-sm py-8">
            No reviews yet. Be the first to share your thoughts on the Details page.
          </div>
        </div>
      </div>
      </section>

    </div>
  </template>

<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue'
import { router } from '@inertiajs/vue3'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Hls from 'hls.js'

defineOptions({
  layout: PublicLayout,
})

const props = defineProps({
  heroBanner: {
    type: Object,
    default: null,
  },
  banners: {
    type: Array,
    default: () => [],
  },
  trailerUrl: {
    type: String,
    default: 'https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/playlist.m3u8',
  },
  premiereDate: {
    type: String,
    default: '2025-12-10T06:00:00Z',
  },
  castCrew: {
    type: Array,
    default: () => [],
  },
  reviews: {
    type: Array,
    default: () => [],
  },
  sponsors: {
    type: Array,
    default: () => [],
  },
  paid: Boolean,
  user: {
    type: Object,
    default: null,
  },
})

const activeBanner = computed(() => {
  if (props.heroBanner) return props.heroBanner
  return props.banners.find((banner) => banner.is_active) || null
})

const resolvedTrailerUrl = computed(() => activeBanner.value?.trailer_url || props.trailerUrl)
const heroTitle = computed(() => activeBanner.value?.title || 'A Crazy Day in Accra')
const heroMessage = computed(
  () =>
    activeBanner.value?.message ||
    'One city. One insane day. A high-energy Ghanaian thriller packed with chaos, humor, and heart.'
)
const heroFallbackImage = computed(() => activeBanner.value?.thumbnail_url || null)
const heroCtaUrl = computed(() => activeBanner.value?.cta_url || '')

// Hero video
const heroSection = ref(null)
const trailerVideo = ref(null)
const trailerVideoSection = ref(null)
const heroHlsInstance = ref(null)
const trailerHlsInstance = ref(null)
const showHeroContent = ref(true)
let mouseActivityTimeout = null
const heroBgStyle = computed(() => ({
  backgroundImage: heroFallbackImage.value
    ? `linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 35%, #0f0f0f 100%), url(${heroFallbackImage.value})`
    : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}))

// Movie metadata
const movieMeta = {
  rating: '16+',
  runtime: '1h 45m',
  year: '2025',
  genres: ['Thriller', 'Comedy', 'Drama'],
}

// Continue watching - fetched from database
const continueWatching = ref([])

// Episodes / Extras
const episodes = [
  {
    id: 1,
    number: 1,
    title: 'A Crazy Morning',
    duration: '22m',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22140%22%3E%3Crect fill=%22%231a1a1a%22 width=%22260%22 height=%22140%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23ff6b6b%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22%3EEpisode 1%3C/text%3E%3C/svg%3E',
    description: 'The day starts off normal… until Accra decides otherwise.',
  },
  {
    id: 2,
    number: 2,
    title: 'Traffic Trouble',
    duration: '24m',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22140%22%3E%3Crect fill=%22%231a1a1a%22 width=%22260%22 height=%22140%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23ff6b6b%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22%3EEpisode 2%3C/text%3E%3C/svg%3E',
    description: 'A simple ride across town turns into total chaos.',
  },
  {
    id: 3,
    number: 3,
    title: 'Market Madness',
    duration: '21m',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22140%22%3E%3Crect fill=%22%231a1a1a%22 width=%22260%22 height=%22140%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23ff6b6b%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22%3EEpisode 3%3C/text%3E%3C/svg%3E',
    description: 'Trotros, sellers, and one very wrong turn.',
  },
]

// Check if episodes should be shown (only if authenticated)
const showEpisodes = computed(() => props.user && episodes.length > 0)

// Section visibility
const trailerSection = ref(null)
const castSection = ref(null)
const reviewsSection = ref(null)

const trailerVisible = ref(false)
const castVisible = ref(false)
const reviewsVisible = ref(false)
const isMuted = ref(true)
const volume = ref(0.7)
const videoLoading = ref(true)
const videoError = ref(false)
let replayTimeout = null

let observer = null

// Premiere countdown
const premiereAt = new Date(props.premiereDate || '2025-12-10T06:00:00Z')
const now = ref(new Date())
let countdownTimer = null

const countdown = computed(() => {
  const diff = premiereAt.getTime() - now.value.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds, isPast: false }
})

const heroCtaLabel = computed(() =>
  activeBanner.value?.cta_text || (!countdown.value.isPast ? 'Watch Trailer' : 'Watch Now')
)

const premiereLabel = computed(() => {
  return premiereAt.toUTCString().replace('GMT', 'GMT')
})

// Notify Me state (same behavior as movie page)
const notifyState = ref({
  loading: false,
  success: '',
  error: '',
  showForm: false,
  email: '',
})

const user = computed(() => props.user)
const movieSlug = 'a-crazy-day-in-accra'

// Anti-capture key blocking (soft deterrent)
const blockKeys = (e) => {
  if (
    e.key === 'PrintScreen' ||
    (e.ctrlKey && ['S', 'U'].includes(e.key)) ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key))
  ) {
    e.preventDefault()
    return false
  }
}

const setupHls = (videoEl, hlsRef, { autoplay = false, muted = true } = {}) => {
  if (!videoEl || !resolvedTrailerUrl.value) return

  videoEl.muted = muted

  if (Hls.isSupported()) {
    hlsRef.value = new Hls({
      autoStartLoad: true,
      enableWorker: true,
      lowLatencyMode: false,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      backBufferLength: 0,
    })

    hlsRef.value.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS Error:', data)
      if (data.fatal) {
        videoError.value = true
        videoLoading.value = false
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          console.log('Attempting to recover from network error...')
          hlsRef.value.startLoad()
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          console.log('Attempting to recover from media error...')
          hlsRef.value.recoverMediaError()
        }
      }
    })

    hlsRef.value.loadSource(resolvedTrailerUrl.value)
    hlsRef.value.attachMedia(videoEl)

    hlsRef.value.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('HLS manifest parsed')
      videoLoading.value = false
      if (autoplay) {
        videoEl.play().catch((err) => {
          console.log('Autoplay blocked, trying muted:', err)
          // Browsers often block unmuted autoplay, so try muted first
          videoEl.muted = true
          isMuted.value = true
          videoEl.play().catch(() => {
            console.log('Autoplay failed even when muted')
          })
        })
      }
    })
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.src = resolvedTrailerUrl.value
    videoEl.addEventListener('loadedmetadata', () => {
      videoLoading.value = false
      if (autoplay) {
        videoEl.play().catch((err) => {
          console.log('Autoplay blocked, trying muted:', err)
          videoEl.muted = true
          isMuted.value = true
          videoEl.play().catch(() => {
            console.log('Autoplay failed even when muted')
          })
        })
      }
    })
  }
}

onMounted(async () => {
  // Hero Video (HLS, autoplay, background)
  if (resolvedTrailerUrl.value && trailerVideo.value) {
    const video = trailerVideo.value
    video.addEventListener('contextmenu', (e) => e.preventDefault())

    // Set initial volume
    video.volume = volume.value

    // Start muted for autoplay compatibility
    setupHls(video, heroHlsInstance, { autoplay: true, muted: true })

    window.addEventListener('keydown', blockKeys)
  }

  // Trailer section player (HLS with controls)
  if (resolvedTrailerUrl.value && trailerVideoSection.value) {
    const video = trailerVideoSection.value
    video.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback')
    video.setAttribute('disablePictureInPicture', true)
    video.addEventListener('contextmenu', (e) => e.preventDefault())
    setupHls(video, trailerHlsInstance, { autoplay: false, muted: false })
    window.addEventListener('keydown', blockKeys)
  }

  // Fetch continue watching data from database
  if (props.user) {
    try {
      const response = await fetch('/api/watch-progress')
      const data = await response.json()
      continueWatching.value = data
    } catch (err) {
      console.error('Failed to load continue watching:', err)
    }
  }

  // Intersection observer for trailer/cast/reviews
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          if (entry.target === trailerSection.value) {
            trailerVisible.value = true
          } else if (entry.target === castSection.value) {
            castVisible.value = true
          } else if (entry.target === reviewsSection.value) {
            reviewsVisible.value = true
          }

          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.2 }
    )

    if (trailerSection.value) observer.observe(trailerSection.value)
    if (castSection.value) observer.observe(castSection.value)
    if (reviewsSection.value) observer.observe(reviewsSection.value)
  } else {
    trailerVisible.value = true
    castVisible.value = true
    reviewsVisible.value = true
  }

  // Countdown timer
  countdownTimer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (heroHlsInstance.value) {
    heroHlsInstance.value.destroy()
  }
  if (trailerHlsInstance.value) {
    trailerHlsInstance.value.destroy()
  }
  if (observer) {
    observer.disconnect()
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  if (mouseActivityTimeout) {
    clearTimeout(mouseActivityTimeout)
  }
  if (replayTimeout) {
    clearTimeout(replayTimeout)
  }
  window.removeEventListener('keydown', blockKeys)
})

// Mouse movement handler
const handleMouseMove = () => {
  // Show content on mouse movement
  showHeroContent.value = true

  // Clear existing timeout
  if (mouseActivityTimeout) {
    clearTimeout(mouseActivityTimeout)
  }

  // Hide content after 10 seconds of no mouse movement
  mouseActivityTimeout = setTimeout(() => {
    // Only hide if video is playing
    if (trailerVideo.value && !trailerVideo.value.paused) {
      showHeroContent.value = false
    }
  }, 10000)
}

// Video event handlers
const onVideoLoadStart = () => {
  videoLoading.value = true
  videoError.value = false
}

const onVideoLoaded = () => {
  console.log('Video data loaded')
  videoLoading.value = false
}

const onVideoCanPlay = () => {
  console.log('Video can play')
  videoLoading.value = false
}

const onVideoError = (e) => {
  console.error('Video error:', e)
  videoLoading.value = false
  videoError.value = true
}

const onVideoPlay = () => {
  videoLoading.value = false
  // Start the hide timer when video starts playing
  if (mouseActivityTimeout) {
    clearTimeout(mouseActivityTimeout)
  }
  mouseActivityTimeout = setTimeout(() => {
    showHeroContent.value = false
  }, 10000)
}

const onVideoPause = () => {
  showHeroContent.value = true
  if (mouseActivityTimeout) {
    clearTimeout(mouseActivityTimeout)
  }
}

const onTrailerEnded = () => {
  // Show content briefly when video ends
  showHeroContent.value = true
  if (mouseActivityTimeout) {
    clearTimeout(mouseActivityTimeout)
  }

  // Wait 30 seconds before replaying
  if (replayTimeout) {
    clearTimeout(replayTimeout)
  }

  replayTimeout = setTimeout(() => {
    if (trailerVideo.value) {
      trailerVideo.value.currentTime = 0
      trailerVideo.value.play().catch(err => {
        console.log('Replay failed:', err)
      })
      // Hide content when video replays
      showHeroContent.value = false
    }
  }, 30000) // 30 seconds
}

const playTrailerFromStart = () => {
  if (trailerVideo.value) {
    trailerVideo.value.currentTime = 0
    trailerVideo.value.play().catch(() => {})
    showHeroContent.value = false
  }
}

const handlePrimaryCta = () => {
  if (heroCtaUrl.value) {
    router.visit(heroCtaUrl.value)
    return
  }

  if (!countdown.value.isPast) {
    playTrailerFromStart()
  } else {
    watchMovie()
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (trailerVideo.value) {
    trailerVideo.value.muted = isMuted.value
    if (!isMuted.value && trailerVideo.value.volume === 0) {
      trailerVideo.value.volume = 0.7
      volume.value = 0.7
    }
  }
}

const updateVolume = () => {
  if (trailerVideo.value) {
    trailerVideo.value.volume = volume.value
    // Auto-unmute if volume is increased from 0
    if (volume.value > 0 && isMuted.value) {
      isMuted.value = false
      trailerVideo.value.muted = false
    }
    // Auto-mute if volume is set to 0
    if (volume.value === 0 && !isMuted.value) {
      isMuted.value = true
      trailerVideo.value.muted = true
    }
  }
}

const watchMovie = () => {
  router.visit('/watch')
}

// Notify Me logic
const notifyPremiere = () => {
  notifyState.value.error = ''
  notifyState.value.success = ''

  if (user.value) {
    // Logged-in user: hit backend
    notifyState.value.loading = true
    router.post(
      '/premiere/notify',
      { movie: movieSlug },
      {
        onSuccess: () => {
          notifyState.value.success = 'You will be reminded when the premiere goes live.'
          notifyState.value.loading = false
        },
        onError: () => {
          notifyState.value.error = 'Could not save your reminder. Please try again.'
          notifyState.value.loading = false
        },
      }
    )
  } else {
    // Guest: show email form
    notifyState.value.showForm = true
  }
}

const submitNotifyEmail = () => {
  notifyState.value.error = ''
  notifyState.value.success = ''

  if (!notifyState.value.email || !notifyState.value.email.includes('@')) {
    notifyState.value.error = 'Please enter a valid email address.'
    return
  }

  notifyState.value.loading = true
  router.post(
    '/premiere/notify',
    {
      movie: movieSlug,
      email: notifyState.value.email,
    },
    {
      onSuccess: () => {
        notifyState.value.success = 'We will email you when the premiere begins.'
        notifyState.value.loading = false
      },
      onError: () => {
        notifyState.value.error = 'Could not save your reminder. Please try again.'
        notifyState.value.loading = false
      },
    }
  )
}
</script>

<style scoped>
/* Very subtle grain / noise overlay for the hero */
.grain {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='noStitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
  background-size: cover;
  mix-blend-mode: soft-light;
}

/* Pulsing glow for primary CTA */
.hero-cta {
  position: relative;
}

.hero-cta::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 1px solid rgba(248, 113, 113, 0.5);
  box-shadow: 0 0 25px rgba(248, 113, 113, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.hero-cta:hover::before {
  opacity: 1;
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.8);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Hide horizontal scrollbar for rails */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
