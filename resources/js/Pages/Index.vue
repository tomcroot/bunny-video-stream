<template>
  <div class="min-h-screen bg-background">

    <!-- Hero Section -->
    <div class="hero-section relative h-screen overflow-hidden">
      <!-- Background Image (shown when no trailer or after end) -->
      <div
        v-if="!showTrailer"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: heroBanner ? `url(${heroBanner.image_url})` : 'url(https://images.unsplash.com/photo-1489599735734-79b4d4c4b3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }"
      >
        <div class="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/30" />
      </div>
      <!-- Video Overlay -->
      <div
        v-if="heroBanner?.video_url && showTrailer"
        class="absolute inset-0 z-10 video-overlay"
        @contextmenu.prevent="handleRightClick"
        @keydown="handleKeyDown"
        @copy.prevent
        @paste.prevent
        @cut.prevent
        @mouseenter="showBannerContent = true"
        @mouseleave="showBannerContent = false"
      >
        <video
          ref="trailerVideo"
          class="w-full h-full object-cover video-player"
          autoplay
          :muted="isMuted"
          playsinline
          controls="false"
          disablepictureinpicture
          disableremoteplayback
          @ended="handleTrailerEnd"
          @contextmenu.prevent="handleRightClick"
          @keydown="handleKeyDown"
          @dragstart.prevent
          @selectstart.prevent
        ></video>

        <!-- Cinematic Gradient Overlay -->
        <div class="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent z-15"></div>

        <!-- Volume Control -->
        <button
          @click="toggleMute"
          class="absolute bottom-6 right-6 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-30 volume-control"
        >
          <svg v-if="isMuted" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
          </svg>
          <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
          </svg>
        </button>

        <!-- Skip Button -->
        <button
          @click="skipTrailer"
          class="absolute top-6 right-6 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 z-20"
        >
          Skip Trailer
        </button>

        <!-- Banner Content Overlay (visible during trailer hover) -->
        <div
          class="absolute inset-0 z-20 flex items-center transition-opacity duration-500"
          :class="showBannerContent ? 'opacity-100' : 'opacity-0'"
        >
          <div class="container mx-auto px-4">
            <div class="max-w-2xl space-y-6">
              <h1 class="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg">
                {{ heroBanner?.title || 'A Crazy Day in Accra' }}
              </h1>

              <p class="text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md">
                {{ heroContent || 'Armed with a game-changing project, Jason arrives at an investor meeting only to walk into a trap. Within minutes, he\'s the prime suspect in a brutal murder, thrust into a 24-hour manhunt across Accra—evading authorities and assassins sent by his closest confidantes.' }}
              </p>

              <div class="flex flex-wrap gap-4 pt-4">
                <PurchaseButton v-if="!paid" :amount="1500" :movie-id="heroBanner?.id" />
                <button v-else @click="goToWatch" class="bg-green-600 text-white text-lg h-14 px-8 gap-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center drop-shadow-lg">
                  <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Continue Watching
                </button>

                <!-- Social Share Buttons -->
                <ShareButton
                  title="A Crazy Day in Accra - Official Film"
                  description="Stream A Crazy Day in Accra on Promise Land Films"
                  :url="$page.url"
                  :hashtags="['ACrazydayinAccra', 'PromiseLandFilms', 'ShortFilm']"
                />
                  <button class="bg-red-600 text-white h-14 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center drop-shadow-lg">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.75.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-12.014C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <p class="text-sm text-white/70 drop-shadow-md">
                One-time payment • Unlimited streaming • HD Quality
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Content (shown when no trailer or after trailer ends) -->
      <div v-if="!showTrailer" class="absolute inset-0 flex items-center z-10">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl space-y-6 animate-fade-in">
          <h1 class="text-5xl md:text-7xl font-bold leading-tight text-white">
            {{ heroBanner?.title || 'A Crazy Day in Accra' }}
          </h1>

          <p class="text-xl md:text-2xl text-white/90 leading-relaxed">
            {{ heroContent || 'Armed with a game-changing project, Jason arrives at an investor meeting only to walk into a trap. Within minutes, he\'s the prime suspect in a brutal murder, thrust into a 24-hour manhunt across Accra—evading authorities and assassins sent by his closest confidantes.' }}
          </p>

          <div class="flex flex-wrap gap-4 pt-4 relative z-20">
            <button
              v-if="!showTrailer"
              @click="playTrailer"
              class="bg-secondary text-secondary-foreground text-lg h-14 px-8 gap-2 cursor-pointer rounded-lg font-semibold hover:bg-secondary/80 transition-colors flex items-center"
            >
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Watch Trailer
            </button>
            <PurchaseButton v-if="!paid" :amount="1500" :movie-id="heroBanner?.id" />
            <button v-else @click="goToWatch" class="bg-green-600 text-white text-lg h-14 px-8 gap-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Continue Watching
            </button>

            <!-- Social Share Buttons -->
            <ShareButton
              title="A Crazy Day in Accra - Official Film"
              description="Stream A Crazy Day in Accra on Promise Land Films"
              :url="$page.url"
              :hashtags="['ACrazydayinAccra', 'PromiseLandFilms', 'ShortFilm']"
            />
          </div>

          <p class="text-sm text-white/70">
            One-time payment • Unlimited streaming • HD Quality
          </p>
        </div>
      </div>

      <!-- Subtle Animated Logo Cloud -->
      <div v-if="!showTrailer" class="pointer-events-none absolute inset-0 z-5">
        <div class="logo-cloud">
          <div class="logo-item" v-for="n in 12" :key="n" :style="cloudStyle(n)">A CRAZY DAY IN ACCRA</div>
        </div>
      </div>
    </div>
    <div class="py-20 bg-card/30">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12">Synopsis</h2>
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <img
              src="https://images.unsplash.com/photo-1489599735734-79b4d4c4b3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Film Production"
              class="rounded-lg shadow-2xl w-full"
            />
          </div>
          <div class="space-y-4 flex flex-col justify-center">
            <p class="text-lg text-muted-foreground leading-relaxed">
              This was meant to be the day that changed Jason's life. Armed with a game-changing project, he arrives at the investor meeting certain of success, only to walk directly into a meticulously constructed trap. Within minutes, the dream shatters: he is the prime suspect in a brutal, high-profile murder.
            </p>
            <p class="text-lg text-muted-foreground leading-relaxed">
              Thrust into a relentless, 24-hour manhunt across the frantic heart of Accra, Jason must evade both the authorities and the unseen assassins determined to silence him. The true horror, however, lies in the motive. Every call, every near-miss, and every piece of evidence points to a single, devastating truth: this nightmare was orchestrated by his closest confidantes—the very circle he relied on for success.
            </p>
            <p class="text-lg text-muted-foreground leading-relaxed">
              In a city where trust is a luxury he can no longer afford, Jason must unravel this chilling conspiracy before his perfect day becomes the perfect frame, and the last morning of his life.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cast Section -->
    <div class="py-20 bg-card">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-foreground mb-4">Meet the Cast</h2>
          <p class="text-xl text-muted-foreground">Starring {{ castNames }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="member in castMembers.slice(0, 6)" :key="member.id" class="text-center">
            <img :src="member.image_url" :alt="member.stage_name" class="w-48 h-48 rounded-full mx-auto mb-4 object-cover" />
            <h3 class="text-xl font-semibold text-foreground">{{ member.stage_name }}</h3>
            <p class="text-muted-foreground">{{ member.role_title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="py-20 bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-foreground mb-4">What People Are Saying</h2>
          <div class="flex items-center justify-center gap-2 mb-4">
            <div class="flex">
              <span v-for="i in 5" :key="i" class="text-yellow-400">★</span>
            </div>
            <span class="text-foreground font-semibold">{{ averageRating }}/5</span>
            <span class="text-muted-foreground">({{ approvedReviews.length }} reviews)</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="review in approvedReviews.slice(0, 3)" :key="review.id" class="bg-card p-6 rounded-lg border">
            <div class="flex items-center mb-4">
              <div class="flex">
                <span v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
              </div>
              <span class="ml-2 text-sm text-muted-foreground">{{ review.rating }}/5</span>
            </div>
            <p class="text-foreground mb-4">{{ review.content }}</p>
            <p class="text-sm text-muted-foreground">- {{ review.author_name }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Hls from 'hls.js'
import PurchaseButton from '@/Components/PurchaseButton.vue'
import ShareButton from '@/Components/ShareButton.vue'
import PublicLayout from '@/Layouts/PublicLayout.vue'

defineOptions({ layout: PublicLayout })

// Props from Laravel backend
const props = defineProps({
  banners: Array,
  castCrew: Array,
  gallery: Array,
  reviews: Array,
  pageContent: Object,
  paid: Boolean,
})

// Reactive state for trailer functionality
const showTrailer = ref(false)
const trailerEnded = ref(false)
const trailerVideo = ref(null)
const hlsInstance = ref(null)
const isMuted = ref(true)
const showBannerContent = ref(false)

// Computed properties
const heroBanner = computed(() => {
  return props.banners?.find(banner => banner.is_active) || null
})

const heroContent = computed(() => {
  return props.pageContent?.content || null
})

const castMembers = computed(() => {
  return props.castCrew?.filter(member => member.role_type === 'cast' && member.is_active) || []
})

const crewMembers = computed(() => {
  return props.castCrew?.filter(member => member.role_type === 'crew' && member.is_active) || []
})

const approvedReviews = computed(() => {
  return props.reviews?.filter(review => review.is_approved) || []
})

const averageRating = computed(() => {
  if (!approvedReviews.value.length) return '0.0'
  const sum = approvedReviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / approvedReviews.value.length).toFixed(1)
})

const castNames = computed(() => {
  return castMembers.value.slice(0, 3).map(member => member.stage_name).join(', ') || 'Jason Adebayo, Amara Nwosu, Kofi Mensah'
})

// Methods
const skipTrailer = () => {
  showTrailer.value = false
  trailerEnded.value = true
  destroyHls()
  // Clear video element to avoid black frame
  if (trailerVideo.value) {
    try {
      trailerVideo.value.pause()
      trailerVideo.value.removeAttribute('src')
      trailerVideo.value.load()
    } catch {}
  }
}

const handleTrailerEnd = () => {
  trailerEnded.value = true
  showTrailer.value = false
  destroyHls()
  // Clear video element after end to reveal banner image
  if (trailerVideo.value) {
    try {
      trailerVideo.value.pause()
      trailerVideo.value.removeAttribute('src')
      trailerVideo.value.load()
    } catch {}
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (trailerVideo.value) {
    trailerVideo.value.muted = isMuted.value
  }
}

const goToWatch = () => {
  window.location.href = '/watch'
}

const cloudStyle = (n) => {
  const positions = [
    { top: '10%', left: '5%' },
    { top: '25%', left: '80%' },
    { top: '40%', left: '15%' },
    { top: '55%', left: '70%' },
    { top: '70%', left: '25%' },
    { top: '15%', left: '60%' },
    { top: '85%', left: '45%' },
    { top: '30%', left: '90%' },
    { top: '60%', left: '10%' },
    { top: '45%', left: '50%' },
    { top: '75%', left: '85%' },
    { top: '20%', left: '35%' },
  ]
  return positions[n - 1] || { top: '50%', left: '50%' }
}

const handleRightClick = (event) => {
  event.preventDefault()
  return false
}

const handleKeyDown = (event) => {
  // Prevent screenshot shortcuts
  const screenshotKeys = [
    'PrintScreen',
    'F12', // Developer tools
    'F11', // Fullscreen (can be used for screenshots)
  ]

  if (screenshotKeys.includes(event.key) ||
      (event.ctrlKey && (event.key === 'u' || event.key === 'U')) || // View source
      (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'i')) || // Dev tools
      (event.ctrlKey && event.shiftKey && (event.key === 'C' || event.key === 'c')) || // Inspect element
      (event.ctrlKey && event.shiftKey && (event.key === 'J' || event.key === 'j')) // Console
  ) {
    event.preventDefault()
    return false
  }
}

const destroyHls = () => {
  if (hlsInstance.value) {
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }
}

const initHlsPlayer = () => {
  if (!heroBanner.value?.video_url || !trailerVideo.value) return

  const videoElement = trailerVideo.value
  // Construct full Bunny CDN URL from GUID stored in database
  const videoSrc = `https://vz-6024b712-a89.b-cdn.net/${heroBanner.value.video_url}/playlist.m3u8`

  if (Hls.isSupported()) {
    hlsInstance.value = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    })

    hlsInstance.value.loadSource(videoSrc)
    hlsInstance.value.attachMedia(videoElement)

    hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
      videoElement.muted = isMuted.value
      videoElement.play().catch(() => {
        // Autoplay failed, user interaction required
      })
    })

    hlsInstance.value.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS error:', data)
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hlsInstance.value.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            hlsInstance.value.recoverMediaError()
            break
          default:
            destroyHls()
            break
        }
      }
    })
  } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS support (Safari)
    videoElement.src = videoSrc
  }
}

// Scroll-based trailer stopping
const handleScroll = () => {
  const heroSection = document.querySelector('.hero-section')
  if (heroSection) {
    const rect = heroSection.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0

    if (!isVisible && showTrailer.value) {
      skipTrailer()
    }
  }
}

// Autoplay trailer after 3 seconds
onMounted(() => {
  if (heroBanner.value?.video_url) {
    const timer = setTimeout(() => {
      if (!trailerEnded.value) {
        showTrailer.value = true
        showBannerContent.value = true // Show banner content initially
        // Initialize HLS player after showing trailer
        setTimeout(() => {
          initHlsPlayer()
        }, 100)
      }
    }, 3000)

    // Add scroll listener
    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
      destroyHls()
    }
  }
})

onUnmounted(() => {
  destroyHls()
})
</script>

<style scoped>
.logo-cloud {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.logo-item {
  position: absolute;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.08);
  animation: float 18s linear infinite;
  white-space: nowrap;
}
@keyframes float {
  0% { transform: translateX(-10%) translateY(0); }
  50% { transform: translateX(10%) translateY(-6px); }
  100% { transform: translateX(-10%) translateY(0); }
}
</style>
