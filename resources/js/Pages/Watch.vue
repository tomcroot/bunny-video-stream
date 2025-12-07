<template>
  <div
    class="min-h-screen bg-background text-foreground flex flex-col select-none"
    @contextmenu.prevent
    @dragstart.prevent
    @copy.prevent
    @cut.prevent
  >
    <div class="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-bold">{{ videoTitle }}</h1>
      <Link href="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back Home
      </Link>
    </div>
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-5xl">
        <div class="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
          <!-- Primary: Bunny Embed iframe (DRM-protected) -->
          <iframe
            v-if="embedUrl && !useEmbedFallback"
            :src="embedUrl"
            class="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullscreen
            loading="lazy"
            @error="switchToVideoFallback"
            @load="() => { isLoading = false }"
          ></iframe>

          <!-- Fallback: HTML5 video with signed HLS or MP4 -->
          <video
            v-if="useEmbedFallback || !embedUrl"
            ref="videoPlayer"
            class="w-full h-full"
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            playsinline
            :poster="banner?.image_url"
            @error="handleVideoError"
          >
            <source v-if="fallbackVideoUrl && !useHls" :src="fallbackVideoUrl" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <!-- Error message -->
          <div
            v-if="errorMessage"
            class="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-6"
          >
            <div class="text-center">
              <p class="text-lg font-semibold mb-2">{{ errorMessage }}</p>
              <button
                @click="retryLoad"
                class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors mt-4"
              >
                Retry
              </button>
            </div>
          </div>

          <!-- Loading state -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <div class="text-white">
              <svg class="animate-spin h-12 w-12 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-sm">Loading video...</p>
            </div>
          </div>
        </div>

        <div v-if="pageContent" class="mt-6 prose prose-invert max-w-none">
          <div v-html="pageContent.content"></div>
        </div>

        <p v-else class="mt-6 text-center text-sm text-muted-foreground">
          Enjoy your unlimited access. Thank you for your support!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import Hls from 'hls.js';

const props = defineProps({
  banner: Object,
  pageContent: Object,
  embedUrl: String,
  fallbackVideoUrl: String,
  videoTitle: {
    type: String,
    default: 'A Crazy Day In Accra'
  }
});

const videoPlayer = ref(null);
const hlsInstance = ref(null);
const errorMessage = ref('');
const isLoading = ref(true);
const useEmbedFallback = ref(false);
let keyguardListener = null;

// Check if we need to use HLS.js (for .m3u8 files) - only for fallback
const useHls = computed(() => {
  return useEmbedFallback.value && props.fallbackVideoUrl?.includes('.m3u8');
});

const handleVideoError = (e) => {
  console.error('Video error:', e);
  isLoading.value = false;
  errorMessage.value = 'Unable to load video. Please check your connection and try again.';
};

const switchToVideoFallback = (e) => {
  console.warn('Embed iframe failed, falling back to video player', e);
  useEmbedFallback.value = true;
  errorMessage.value = '';
  isLoading.value = true;
  setTimeout(() => initPlayer(), 100);
};

const retryLoad = () => {
  errorMessage.value = '';
  isLoading.value = true;
  initPlayer();
};

const initPlayer = () => {
  if (!props.fallbackVideoUrl || !videoPlayer.value) {
    errorMessage.value = 'No video available. Please contact support.';
    isLoading.value = false;
    return;
  }

  // If it's an HLS stream (.m3u8) in fallback mode
  if (useHls.value) {
    if (Hls.isSupported()) {
      // Clean up existing HLS instance
      if (hlsInstance.value) {
        hlsInstance.value.destroy();
      }

      hlsInstance.value = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        // Buffer configuration to reduce stalls
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        // Fragment loading configuration
        maxFragLookUpTolerance: 0.25,
        startFragPrefetch: true,
        // Error recovery
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 3,
        fragLoadingRetryDelay: 1000,
        // Reduce seeking issues
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3
      });

      hlsInstance.value.loadSource(props.fallbackVideoUrl);
      hlsInstance.value.attachMedia(videoPlayer.value);

      hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
        isLoading.value = false;
        console.log('HLS manifest loaded successfully');
      });

      hlsInstance.value.on(Hls.Events.ERROR, (event, data) => {
        // Only log fatal errors and handle non-fatal ones silently
        if (data.fatal) {
          console.error('HLS fatal error:', data);
          isLoading.value = false;
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              errorMessage.value = 'Network error. Please check your connection.';
              // Try to recover from network error
              setTimeout(() => {
                if (hlsInstance.value) {
                  hlsInstance.value.startLoad();
                }
              }, 1000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              errorMessage.value = 'Media error. Attempting to recover...';
              hlsInstance.value.recoverMediaError();
              // Clear error message after attempting recovery
              setTimeout(() => {
                if (!data.fatal) {
                  errorMessage.value = '';
                }
              }, 2000);
              break;
            default:
              errorMessage.value = 'Unable to load video. Please try again later.';
              break;
          }
        } else {
          // Non-fatal errors (buffer stalls, seeks) are handled automatically by HLS.js
          // Only log them in development for debugging
          if (import.meta.env.DEV) {
            console.log('HLS non-fatal error (auto-recovering):', data.details);
          }
        }
      });
    } else if (videoPlayer.value.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      videoPlayer.value.src = props.fallbackVideoUrl;
      videoPlayer.value.addEventListener('loadedmetadata', () => {
        isLoading.value = false;
      });
    } else {
      errorMessage.value = 'HLS is not supported in this browser.';
      isLoading.value = false;
    }
  } else {
    // Regular MP4 or other video format
    isLoading.value = false;
  }
};

onMounted(() => {
  initPlayer();
  // Block common download/inspect shortcuts (best-effort deterrent)
  keyguardListener = (e) => {
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const key = e.key.toLowerCase();
    if (
      key === 'f12' ||
      (ctrl && (key === 's' || key === 'p' || key === 'u')) ||
      (ctrl && shift && (key === 'i' || key === 'j' || key === 'c'))
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  window.addEventListener('keydown', keyguardListener, { capture: true });

  // Handle video loaded
  if (videoPlayer.value) {
    videoPlayer.value.addEventListener('loadeddata', () => {
      isLoading.value = false;
    });
  }
});

onBeforeUnmount(() => {
  if (hlsInstance.value) {
    hlsInstance.value.destroy();
  }
  if (keyguardListener) {
    window.removeEventListener('keydown', keyguardListener, { capture: true });
    keyguardListener = null;
  }
});
</script>
