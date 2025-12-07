<template>
  <div class="min-h-screen bg-black text-white">
    <!-- HERO BACKDROP + META -->
    <section
      class="relative min-h-[70vh] flex items-end"
      :style="{
        backgroundImage: `url(${pageContent?.backdrop || defaultBackdrop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-10 w-full">
        <!-- Poster -->
        <div class="hidden md:block">
          <div class="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
            <img
              :src="pageContent?.poster || defaultPoster"
              alt="Movie poster"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Meta -->
        <div class="md:col-span-2 space-y-6">
          <div class="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-red-400">
            <span>Promise Films Original</span>
            <span class="text-xs bg-purple-600/80 px-2 py-1 rounded-full font-semibold">
              Exclusive Premiere
            </span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold drop-shadow-xl">
            {{ pageContent?.title || 'A Crazy Day in Accra' }}
          </h1>

          <!-- Meta row -->
          <div class="flex flex-wrap gap-3 items-center text-sm text-gray-300">
            <span class="px-2 py-1 border border-white/60 rounded text-xs font-semibold">
              {{ movieMeta.rating }}
            </span>
            <span>{{ movieMeta.year }}</span>
            <span>•</span>
            <span>{{ movieMeta.runtime }}</span>
            <span>•</span>
            <span>Thriller • Drama • Comedy</span>
            <span class="text-yellow-400 font-semibold flex items-center gap-1">
              ★ 8.7
              <span class="text-xs text-gray-400">pre-release</span>
            </span>
          </div>

          <!-- Logline -->
          <p class="text-gray-200 leading-relaxed max-w-2xl">
            Jason arrives at a high-stakes pitch meeting in Accra and walks straight into a setup—
            framed for murder, hunted across the city, and forced to uncover a conspiracy before the day ends.
          </p>

          <!-- Premiere countdown + Notify Me -->
          <div class="space-y-3">
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

              <span class="hidden md:inline text-gray-300/80 ml-3">
                {{ premiereLabel }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                v-if="!countdown.isPast"
                @click="notifyPremiere"
                class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-full text-sm font-semibold"
                :disabled="notifyState.loading"
              >
                <span>🔔</span>
                <span>
                  {{ notifyState.success ? 'Reminded' : (notifyState.loading ? 'Please wait...' : 'Remind Me') }}
                </span>
              </button>

              <button
                v-else
                @click="$inertia.visit('/watch')"
                class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-sm font-semibold"
              >
                ▶ Watch Now
              </button>

              <button
                v-if="trailerUrl"
                @click="openTrailer"
                class="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 px-5 py-2.5 rounded-full text-sm"
              >
                🎬 Watch Trailer
              </button>
            </div>

            <!-- Notify form when guest -->
            <div
              v-if="notifyState.showForm && !user && !countdown.isPast"
              class="mt-2 flex flex-wrap items-center gap-3 text-xs md:text-sm"
            >
              <input
                v-model="notifyState.email"
                type="email"
                placeholder="Enter your email for a launch reminder"
                class="w-full md:w-72 px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                @click="submitNotifyEmail"
                class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                :disabled="notifyState.loading"
              >
                Save
              </button>
            </div>

            <p v-if="notifyState.error" class="text-xs text-red-400">
              {{ notifyState.error }}
            </p>
            <p v-if="notifyState.success" class="text-xs text-green-400">
              {{ notifyState.success }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TABS NAV -->
    <div class="bg-zinc-950 sticky top-16 z-30 border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="py-4 text-sm font-medium border-b-2 transition whitespace-nowrap"
          :class="activeTab === tab
            ? 'border-red-500 text-white'
            : 'border-transparent text-gray-400 hover:text-white'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- TAB CONTENT -->
    <section class="max-w-7xl mx-auto px-6 py-10 space-y-12">

      <!-- OVERVIEW -->
      <div v-if="activeTab === 'Overview'" class="space-y-8">
        <!-- Storyline & quick facts -->
        <div class="grid md:grid-cols-3 gap-8">
          <div class="md:col-span-2 bg-zinc-900/80 p-6 rounded-xl border border-white/10">
            <h3 class="text-xl font-bold mb-3">Storyline</h3>
            <p class="text-gray-200 leading-relaxed">
              Armed with a game-changing project, Jason arrives at an investor meeting only to walk into a trap.
              In minutes, he’s framed for murder and forced into a 24-hour race across Accra to clear his name,
              outrun hired killers, and expose a web of betrayal and corruption.
            </p>
          </div>

          <div class="space-y-3 text-sm">
            <div class="bg-zinc-900/80 p-4 rounded-xl border border-white/10">
              <p class="text-gray-400 text-xs uppercase tracking-wide mb-1">Country of origin</p>
              <p class="text-gray-100 font-semibold">Ghana</p>
            </div>
            <div class="bg-zinc-900/80 p-4 rounded-xl border border-white/10">
              <p class="text-gray-400 text-xs uppercase tracking-wide mb-1">Original language</p>
              <p class="text-gray-100 font-semibold">English • Twi</p>
            </div>
            <div class="bg-zinc-900/80 p-4 rounded-xl border border-white/10">
              <p class="text-gray-400 text-xs uppercase tracking-wide mb-1">Production</p>
              <p class="text-gray-100 font-semibold">Promise Land Films</p>
            </div>
          </div>
        </div>

        <!-- Themes & style -->
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10">
            <h4 class="text-lg font-semibold mb-3">Themes</h4>
            <ul class="space-y-2 text-gray-200 text-sm">
              <li>• Trust and betrayal in fast-moving relationships</li>
              <li>• Corruption, justice, and power in modern Accra</li>
              <li>• Survival under pressure in a city that never slows down</li>
              <li>• Cultural identity vs. global opportunity</li>
            </ul>
          </div>

          <div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10">
            <h4 class="text-lg font-semibold mb-3">Cinematic Style</h4>
            <ul class="space-y-2 text-gray-200 text-sm">
              <li>• High-energy handheld and drone shots through Accra</li>
              <li>• Nighttime neon palettes and gritty street realism</li>
              <li>• Fast-paced thriller editing with emotional pauses</li>
              <li>• Ghanaian soundtrack influences layered over modern scoring</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CAST & CREW -->
      <div v-if="activeTab === 'Cast & Crew'" class="space-y-6">
        <h3 class="text-xl font-bold">Cast</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          <div
            v-for="member in castList"
            :key="member.id"
            class="text-center"
          >
            <div class="w-24 h-24 mx-auto rounded-full overflow-hidden border border-white/10 mb-3">
              <img :src="member.photo" :alt="member.name" class="w-full h-full object-cover" />
            </div>
            <p class="font-semibold text-sm">{{ member.name }}</p>
            <p class="text-xs text-gray-400">{{ member.role }}</p>
          </div>
        </div>
      </div>

      <!-- REVIEWS -->
      <div v-if="activeTab === 'Reviews'" class="space-y-10">
        <!-- Form -->
        <div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10">
          <h3 class="text-xl font-bold mb-4">Share your thoughts</h3>
          <form @submit.prevent="submitComment" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <input
                v-model="newComment.name"
                type="text"
                placeholder="Your name"
                class="input"
                required
              />
              <input
                v-model="newComment.email"
                type="email"
                placeholder="Email (optional)"
                class="input"
              />
            </div>

            <textarea
              v-model="newComment.content"
              rows="4"
              class="input"
              placeholder="What did you think of the film?"
              required
            ></textarea>

            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-200">Rating:</span>
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="newComment.rating = star"
                  class="text-lg focus:outline-none"
                  :class="star <= newComment.rating ? 'text-yellow-400' : 'text-gray-600'"
                >
                  ★
                </button>
              </div>

              <button
                type="submit"
                class="ml-auto bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm font-semibold"
                :disabled="submitting"
              >
                {{ submitting ? 'Posting...' : 'Post Review' }}
              </button>
            </div>
          </form>
        </div>

        <!-- List -->
        <div class="space-y-6">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="bg-zinc-900/80 p-6 rounded-xl border border-white/10"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold">{{ comment.name }}</p>
              <div class="text-yellow-400 text-sm">
                {{ '★'.repeat(comment.rating) }}
              </div>
            </div>
            <p class="text-gray-200 text-sm leading-relaxed">
              {{ comment.content }}
            </p>
            <p class="text-xs text-gray-500 mt-2">
              {{ formatDate(comment.created_at) }}
            </p>
          </div>

          <div v-if="comments.length === 0" class="text-center text-gray-500 py-8 text-sm">
            No reviews yet. Be the first to review this film after launch.
          </div>
        </div>
      </div>

      <!-- PRODUCTION -->
      <div v-if="activeTab === 'Production'" class="grid md:grid-cols-2 gap-8">
        <div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10">
          <h4 class="text-lg font-semibold mb-3">Production Company</h4>
          <p class="text-gray-200">Promise Land Films</p>
          <p class="text-gray-400 text-sm mt-2">
            An independent Ghanaian production company focused on bold stories and authentic African perspectives.
          </p>
        </div>

        <div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10">
          <h4 class="text-lg font-semibold mb-3">Filming Locations</h4>
          <p class="text-gray-200">Accra, Ghana</p>
          <p class="text-gray-400 text-sm mt-2">
            Shot entirely on location in Accra, capturing the city’s energy, tension and everyday beauty.
          </p>
        </div>

        <div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10">
          <h4 class="text-lg font-semibold mb-3">Technical Specs</h4>
          <ul class="text-gray-200 text-sm space-y-1">
            <li>• Aspect Ratio: 2.35:1 (Cinemascope)</li>
            <li>• Resolution: 4K Digital</li>
            <li>• Sound: Dolby Digital 5.1</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- TRAILER CINEMA MODAL -->
    <div
      v-if="showTrailerModal"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      @click.self="closeTrailer"
    >
      <div class="relative w-full max-w-5xl mx-auto aspect-video bg-black border border-white/10 rounded-xl overflow-hidden">
        <video
          ref="trailerPlayer"
          class="w-full h-full object-contain"
          playsinline
          autoplay
          controls
          muted
          preload="auto"
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          @contextmenu.prevent
        ></video>

        <div class="absolute top-3 right-4 text-xs text-white/40 tracking-widest select-none">
          PROMISE FILMS • TRAILER
        </div>

        <button
          class="absolute top-3 left-3 text-white/70 hover:text-white"
          @click="closeTrailer"
        >
          ✕ Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import PublicLayout from '@/Layouts/PublicLayout.vue'
import { router } from '@inertiajs/vue3'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import Hls from 'hls.js'

defineOptions({ layout: PublicLayout })

const props = defineProps({
  pageContent: Object,
  reviews: {
    type: Array,
    default: () => [],
  },
  trailerUrl: {
    type: String,
    default: null,
  },
  castCrew: {
    type: Array,
    default: () => [],
  },
  user: {
    type: Object,
    default: null,
  },
})

// Static fallback assets
const defaultPoster = '/images/movie-poster.jpg'
const defaultBackdrop = '/images/movie-backdrop.jpg'

// Movie meta
const movieMeta = {
  rating: '16+',
  runtime: '1h 45m',
  year: '2025',
}

// Tabs
const tabs = ['Overview', 'Cast & Crew', 'Reviews', 'Production']
const activeTab = ref('Overview')

// Cast list
const castList = computed(() => {
  if (props.castCrew && props.castCrew.length) return props.castCrew
  return [
    { id: 1, name: 'Jason Kofi', role: 'Jason', photo: '/images/cast1.jpg' },
    { id: 2, name: 'Ama Mensah', role: 'Nadia', photo: '/images/cast2.jpg' },
    { id: 3, name: 'Kwesi Boateng', role: 'Inspector Ado', photo: '/images/cast3.jpg' },
  ]
})

// Reviews
const comments = ref([])
const newComment = ref({
  name: '',
  email: '',
  content: '',
  rating: 0,
})
const submitting = ref(false)

// Countdown to premiere
const premiereAt = new Date('2025-12-10T06:00:00Z')
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

// Notify Me state
const notifyState = ref({
  loading: false,
  success: '',
  error: '',
  showForm: false,
  email: '',
})

const user = computed(() => props.user)

// Trailer modal / HLS
const showTrailerModal = ref(false)
const trailerPlayer = ref(null)
const hlsInstance = ref(null)

const setupTrailerHls = () => {
  const video = trailerPlayer.value
  if (!video || !props.trailerUrl) return

  if (Hls.isSupported()) {
    hlsInstance.value = new Hls({
      autoStartLoad: true,
      enableWorker: true,
      lowLatencyMode: true,
    })

    hlsInstance.value.loadSource(props.trailerUrl)
    hlsInstance.value.attachMedia(video)

    hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
      video.muted = false
      video.play().catch(() => {})
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = props.trailerUrl
    video.addEventListener('loadedmetadata', () => {
      video.muted = false
      video.play().catch(() => {})
    })
  }

  // Basic deterrent key block (cannot truly stop screen recorders)
  window.addEventListener('keydown', blockKeys)
}

const destroyTrailerHls = () => {
  if (hlsInstance.value) {
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }
  window.removeEventListener('keydown', blockKeys)
}

function blockKeys(e) {
  if (
    e.key === 'PrintScreen' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
    (e.ctrlKey && ['U', 'S'].includes(e.key))
  ) {
    e.preventDefault()
    return false
  }
}

const openTrailer = async () => {
  showTrailerModal.value = true
  await nextTick()
  setupTrailerHls()
}

const closeTrailer = () => {
  showTrailerModal.value = false
  destroyTrailerHls()
}

// Notify Me
const notifyPremiere = () => {
  notifyState.value.error = ''
  notifyState.value.success = ''

  if (user.value) {
    // Logged-in user: hit backend with user profile
    notifyState.value.loading = true
    router.post(
      '/premiere/notify',
      {
        movie: pageContentSlug.value,
      },
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
      movie: pageContentSlug.value,
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

const pageContentSlug = computed(() => {
  return props.pageContent?.slug || 'a-crazy-day-in-accra'
})

// Reviews methods
const submitComment = async () => {
  if (!newComment.value.name.trim() || !newComment.value.content.trim() || newComment.value.rating === 0) {
    alert('Please fill in all fields and select a rating.')
    return
  }

  submitting.value = true

  await router.post('/reviews', newComment.value, {
    onSuccess: () => {
      newComment.value = { name: '', email: '', content: '', rating: 0 }
      submitting.value = false
      // Optionally reload comments via Inertia or keep optimistic
    },
    onError: () => {
      submitting.value = false
    },
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Lifecycle
onMounted(() => {
  // Seed comments from props
  if (props.reviews && props.reviews.length > 0) {
    comments.value = props.reviews
  } else {
    comments.value = []
  }

  // Countdown timer
  countdownTimer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  destroyTrailerHls()
})
</script>

<style scoped>
.input {
  width: 100%;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: white;
  padding: 0.75rem 1rem;
  background-color: rgb(24 24 27);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.input:focus {
  outline: none;
  ring: 2px rgb(220 38 38);
  ring-offset-color: rgb(24 24 27);
}
</style>
