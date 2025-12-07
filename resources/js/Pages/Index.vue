<template>
    <div class="min-h-screen bg-black text-white overflow-x-hidden">
      <!-- HERO CINEMATIC BANNER WITH AUTO-PLAYING TRAILER -->
      <section
        ref="heroSection"
        class="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      >
        <!-- VIDEO PLAYER HERO -->
        <div
          class="absolute inset-0 w-full h-full bg-black"
          :style="{ opacity: showHeroContent ? 0.3 : 1, transition: 'opacity 1s ease-out' }"
        >
          <video
            v-if="trailerUrl"
            ref="trailerVideo"
            class="w-full h-full object-cover"
            playsinline
            muted
            preload="auto"
            @ended="onTrailerEnded"
            @play="onVideoPlay"
            @pause="onVideoPause"
            @contextmenu.prevent
          ></video>

          <!-- Fallback background if no video -->
          <div
            v-else
            class="pointer-events-none absolute inset-0 bg-cover bg-center will-change-transform"
            :style="heroBgStyle"
          />
        </div>

        <!-- Small watermark deterrent -->
        <div
          v-if="trailerUrl"
          class="absolute top-4 right-6 z-20 text-xs text-white/35 tracking-widest select-none pointer-events-none"
        >
          PROMISE FILMS • PREVIEW
        </div>

        <!-- Cinema overlay gradient -->
        <div
          class="absolute inset-0 bg-linear-to-t from-black via-black/85 to-black/40"
          :style="{ opacity: showHeroContent ? 1 : 0.5, transition: 'opacity 1s ease-out' }"
        />

        <!-- Film grain overlay -->
        <div class="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light grain" />

        <!-- Hero content - FADES IN AFTER VIDEO PLAYS / ENDS -->
        <div
          class="relative z-10 max-w-5xl px-6 text-center transition-all duration-1000"
          :style="{
            opacity: showHeroContent ? 1 : 0,
            transform: showHeroContent ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: showHeroContent ? 'auto' : 'none'
          }"
        >
          <p class="text-xs uppercase tracking-[0.35em] text-red-400 mb-4 opacity-80">
            Promise Films Original
          </p>
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-xl leading-tight">
            A Crazy Day in Accra
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
                ✅ <span class="font-semibold">Now streaming exclusively on Promise Films</span>
              </span>
              <span class="hidden md:inline text-gray-300/80 ml-2">
                {{ premiereLabel }}
              </span>
            </div>
          </div>

          <p class="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            One city. One insane day. A high-energy Ghanaian thriller packed with chaos, humor, and heart.
          </p>

          <!-- CTAs change based on premiere -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <!-- BEFORE PREMIERE: Watch Trailer / Remind Me -->
            <button
              v-if="!countdown.isPast"
              class="px-10 py-4 bg-red-600 hover:bg-red-700 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-3 hero-cta"
              @click="playTrailerFromStart"
            >
              <span class="inline-flex h-8 w-8 rounded-full bg-white/15 items-center justify-center">
                ▶
              </span>
              <span>Watch Trailer</span>
            </button>
            <button
              v-if="!countdown.isPast"
              @click="notifyPremiere"
              class="px-10 py-4 border border-white/30 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/60 transition-all flex items-center gap-2"
              :disabled="notifyState.loading"
            >
              <span>🔔</span>
              <span>
                {{ notifyState.success ? 'Reminded' : (notifyState.loading ? 'Please wait...' : 'Remind Me') }}
              </span>
            </button>

            <!-- AFTER PREMIERE: Watch Now / Replay Trailer -->
            <button
              v-else-if="countdown.isPast"
              class="px-10 py-4 bg-red-600 hover:bg-red-700 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-3 hero-cta"
              @click="watchMovie"
            >
              <span class="inline-flex h-8 w-8 rounded-full bg-white/15 items-center justify-center">
                ▶
              </span>
              <span>Watch Now</span>
            </button>
            <button
              v-else
              @click="playTrailerFromStart"
              class="px-10 py-4 border border-white/30 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/60 transition-all flex items-center gap-2"
            >
              <span class="h-2 w-2 rounded-full bg-red-500 animate-ping-slow" />
              <span>Replay Trailer</span>
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
              @click="router.visit('/watch')"
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
            v-if="trailerUrl"
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
            Credits
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
            <div
              v-for="member in castCrew"
              :key="member.id"
              class="group text-center transform transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="relative mx-auto w-28 h-28 mb-4">
                <div class="absolute inset-0 rounded-full bg-red-500/25 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  :src="member.photo"
                  :alt="member.name"
                  class="relative rounded-full object-cover w-full h-full border border-white/20 group-hover:border-red-500/70 group-hover:shadow-[0_0_25px_rgba(248,113,113,0.55)] transition-all duration-300"
                />
              </div>
              <p class="font-semibold text-lg">{{ member.name }}</p>
              <p class="text-sm text-gray-400">{{ member.role }}</p>
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
  paid: Boolean,
  user: {
    type: Object,
    default: null,
  },
})

// Hero video
const heroSection = ref(null)
const trailerVideo = ref(null)
const trailerVideoSection = ref(null)
const heroHlsInstance = ref(null)
const trailerHlsInstance = ref(null)
const showHeroContent = ref(false)
const heroBgStyle = computed(() => ({
  backgroundImage: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
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
  if (!videoEl || !props.trailerUrl) return

  videoEl.muted = muted

  if (Hls.isSupported()) {
    hlsRef.value = new Hls({
      autoStartLoad: true,
      enableWorker: true,
      lowLatencyMode: true,
    })
    hlsRef.value.loadSource(props.trailerUrl)
    hlsRef.value.attachMedia(videoEl)

    hlsRef.value.on(Hls.Events.MANIFEST_PARSED, () => {
      if (autoplay) {
        videoEl.play().catch(() => {})
      }
    })
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.src = props.trailerUrl
    videoEl.addEventListener('loadedmetadata', () => {
      if (autoplay) {
        videoEl.play().catch(() => {})
      }
    })
  }
}

onMounted(async () => {
  // Hero Video (HLS, autoplay, background)
  if (props.trailerUrl && trailerVideo.value) {
    const video = trailerVideo.value
    video.addEventListener('contextmenu', (e) => e.preventDefault())
    setupHls(video, heroHlsInstance, { autoplay: true, muted: true })
    window.addEventListener('keydown', blockKeys)
  }

  // Trailer section player (HLS with controls)
  if (props.trailerUrl && trailerVideoSection.value) {
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
  window.removeEventListener('keydown', blockKeys)
})

// Video event handlers
const onVideoPlay = () => {
  // Content fades in after video starts playing
  setTimeout(() => {
    showHeroContent.value = false
  }, 100)
}

const onVideoPause = () => {
  showHeroContent.value = true
}

const onTrailerEnded = () => {
  // Show thumbnail/content when video ends
  showHeroContent.value = true
  if (trailerVideo.value) {
    trailerVideo.value.pause()
  }
}

const playTrailerFromStart = () => {
  if (trailerVideo.value) {
    trailerVideo.value.currentTime = 0
    trailerVideo.value.play().catch(() => {})
    showHeroContent.value = false
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
