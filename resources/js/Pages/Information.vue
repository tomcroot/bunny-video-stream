<template>
  <div class="min-h-screen bg-background">

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-foreground mb-8">Film Information</h1>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover everything about "A Crazy Day in Accra" - from its compelling story to the creative vision behind its production.
        </p>
      </div>

      <!-- Movie Poster & Basic Info -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <!-- Poster -->
        <div class="lg:col-span-1">
          <div class="aspect-[2/3] bg-muted rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1489599735734-79b4d4c4b3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="A Crazy Day in Accra Poster"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Basic Info -->
        <div class="lg:col-span-2 space-y-6">
          <div>
            <h2 class="text-3xl font-bold text-foreground mb-4">A Crazy Day in Accra</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div class="bg-card p-4 rounded-lg border">
                <div class="text-primary font-semibold">Release Year</div>
                <div class="text-foreground">2025</div>
              </div>
              <div class="bg-card p-4 rounded-lg border">
                <div class="text-primary font-semibold">Runtime</div>
                <div class="text-foreground">2h 15m</div>
              </div>
              <div class="bg-card p-4 rounded-lg border">
                <div class="text-primary font-semibold">Genre</div>
                <div class="text-foreground">Thriller, Drama</div>
              </div>
              <div class="bg-card p-4 rounded-lg border">
                <div class="text-primary font-semibold">Language</div>
                <div class="text-foreground">English</div>
              </div>
            </div>
          </div>

          <!-- Rating -->
          <div class="bg-card p-6 rounded-lg border">
            <div class="flex items-center gap-4 mb-2">
              <div class="flex items-center gap-2">
                <Star class="h-5 w-5 text-yellow-400 fill-current" />
                <span class="text-2xl font-bold text-foreground">8.7</span>
                <span class="text-muted-foreground">/ 10</span>
              </div>
              <span class="text-muted-foreground">IMDb Rating</span>
            </div>
            <p class="text-sm text-muted-foreground">Based on 2,341 user reviews</p>
          </div>
        </div>
      </div>

      <!-- Plot Summary -->
      <section class="mb-12">
        <div class="bg-card p-8 rounded-lg border">
          <h3 class="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <BookOpen class="h-6 w-6 text-primary" />
            Plot Summary
          </h3>
          <div class="space-y-4 text-muted-foreground leading-relaxed">
            <p class="text-lg">
              Armed with a game-changing project, Jason arrives at an investor meeting only to walk into a trap. Within minutes, he's the prime suspect in a brutal murder, thrust into a 24-hour manhunt across Accra—evading authorities and assassins sent by his closest confidantes.
            </p>
            <p>
              As Jason navigates the chaotic streets of Ghana's capital, he uncovers a web of corruption and betrayal that goes deeper than he ever imagined. With time running out and trust in short supply, he must rely on his wits and the unexpected help of strangers to clear his name and expose the truth.
            </p>
            <p>
              "A Crazy Day in Accra" is a high-stakes thriller that captures the vibrant energy and underlying tensions of urban life in West Africa, where opportunity and danger walk hand in hand.
            </p>
          </div>
        </div>
      </section>

      <!-- Production Information -->
      <section class="mb-12">
        <h3 class="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Film class="h-6 w-6 text-primary" />
          Production Information
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-card p-6 rounded-lg border">
            <h4 class="text-lg font-semibold text-foreground mb-4">Production Company</h4>
            <p class="text-muted-foreground mb-2">Promise Land Films</p>
            <p class="text-sm text-muted-foreground">
              An independent Ghanaian production company dedicated to authentic storytelling and cultural representation.
            </p>
          </div>

          <div class="bg-card p-6 rounded-lg border">
            <h4 class="text-lg font-semibold text-foreground mb-4">Filming Locations</h4>
            <p class="text-muted-foreground mb-2">Accra, Ghana</p>
            <p class="text-sm text-muted-foreground">
              Shot entirely on location in Ghana's capital city, showcasing authentic urban landscapes and local culture.
            </p>
          </div>

          <div class="bg-card p-6 rounded-lg border">
            <h4 class="text-lg font-semibold text-foreground mb-4">Director</h4>
            <p class="text-muted-foreground mb-2">Promise Land Films</p>
            <p class="text-sm text-muted-foreground">
              Visionary filmmakers bringing fresh perspectives to African cinema.
            </p>
          </div>

          <div class="bg-card p-6 rounded-lg border">
            <h4 class="text-lg font-semibold text-foreground mb-4">Technical Specs</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Aspect Ratio:</span>
                <span class="text-foreground">2.35:1 (Cinemascope)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Sound:</span>
                <span class="text-foreground">Dolby Digital 5.1</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Format:</span>
                <span class="text-foreground">4K Digital</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Themes & Style -->
      <section class="mb-12">
        <div class="bg-card p-8 rounded-lg border">
          <h3 class="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Target class="h-6 w-6 text-primary" />
            Themes & Style
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 class="text-lg font-semibold text-foreground mb-3">Central Themes</h4>
              <ul class="space-y-2 text-muted-foreground">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Trust and betrayal in modern relationships</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Corruption and justice in urban Africa</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>The resilience of the human spirit</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Cultural identity in a globalized world</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-foreground mb-3">Cinematic Style</h4>
              <ul class="space-y-2 text-muted-foreground">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Dynamic urban cinematography</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Fast-paced thriller pacing</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Authentic Ghanaian cultural elements</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Blend of suspense and social commentary</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Comments Section -->
      <section class="mb-12">
        <div class="bg-card p-8 rounded-lg border">
          <h3 class="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <MessageCircle class="h-6 w-6 text-primary" />
            Community Comments
          </h3>

          <!-- Comment Form -->
          <div class="mb-8">
            <div class="bg-muted/50 p-6 rounded-lg border-2 border-dashed border-muted-foreground/25">
              <h4 class="text-lg font-semibold text-foreground mb-4">Share Your Thoughts</h4>
              <form @submit.prevent="submitComment" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input
                      v-model="newComment.name"
                      type="text"
                      class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Email (optional)</label>
                    <input
                      v-model="newComment.email"
                      type="email"
                      class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Comment</label>
                  <textarea
                    v-model="newComment.content"
                    rows="4"
                    class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="What did you think of the film?"
                    required
                  ></textarea>
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <label class="text-sm font-medium text-foreground">Rating:</label>
                    <div class="flex gap-1">
                      <button
                        v-for="star in 5"
                        :key="star"
                        @click="newComment.rating = star"
                        type="button"
                        class="focus:outline-none"
                      >
                        <Star
                          :class="[
                            'h-5 w-5',
                            star <= newComment.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-muted-foreground/30'
                          ]"
                        />
                      </button>
                    </div>
                  </div>
                  <Button type="submit" :disabled="submitting" class="ml-auto">
                    <Send class="h-4 w-4 mr-2" />
                    {{ submitting ? 'Posting...' : 'Post Comment' }}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <!-- Comments List -->
          <div class="space-y-6">
            <div v-for="comment in comments" :key="comment.id" class="border-b border-border pb-6 last:border-b-0 last:pb-0">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="font-semibold text-foreground">{{ comment.name }}</span>
                    <div class="flex gap-1">
                      <Star
                        v-for="star in 5"
                        :key="star"
                        :class="[
                          'h-4 w-4',
                          star <= comment.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-muted-foreground/30'
                        ]"
                      />
                    </div>
                    <span class="text-sm text-muted-foreground">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <p class="text-muted-foreground leading-relaxed">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <div v-if="comments.length === 0" class="text-center py-8">
              <MessageCircle class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p class="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import { Star, Film, BookOpen, Target, MessageCircle, Send, User } from 'lucide-vue-next'
import { Button } from '@/Components/ui/button'
import PublicLayout from '@/Layouts/PublicLayout.vue'
defineOptions({ layout: PublicLayout })

// Props from Laravel backend
const props = defineProps({
  pageContent: Object,
  reviews: Array
})

// Reactive data
const comments = ref([])
const newComment = ref({
  name: '',
  email: '',
  content: '',
  rating: 0
})
const submitting = ref(false)

// Methods
const submitComment = async () => {
  if (!newComment.value.name.trim() || !newComment.value.content.trim() || newComment.value.rating === 0) {
    alert('Please fill in all fields and select a rating.')
    return
  }

  submitting.value = true

  try {
    await router.post('/reviews', newComment.value, {
      onSuccess: () => {
        // Reset form
        newComment.value = {
          name: '',
          email: '',
          content: '',
          rating: 0
        }
        alert('Thank you for your review! It will be published after approval.')
      },
      onError: (errors) => {
        console.error('Validation errors:', errors)
        let errorMessage = 'Please check your input:\n'
        for (const [field, message] of Object.entries(errors)) {
          errorMessage += `${field}: ${message}\n`
        }
        alert(errorMessage)
      },
      onFinish: () => {
        submitting.value = false
      }
    })
  } catch (error) {
    console.error('Error posting comment:', error)
    alert('There was an error submitting your review. Please try again.')
    submitting.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load approved reviews from backend
onMounted(() => {
  // Load reviews from props if available, otherwise use sample data
  if (props.reviews && props.reviews.length > 0) {
    comments.value = props.reviews
  } else {
    // Sample comments for development/preview
    comments.value = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        content: 'Absolutely gripping from start to finish! The portrayal of Accra feels so authentic and the pacing keeps you on the edge of your seat. Can\'t wait to see more from this director.',
        rating: 5,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael@example.com',
        content: 'The themes of corruption and justice really hit home. The cinematography of the city streets is stunning. A fresh take on the thriller genre with strong African representation.',
        rating: 4,
        created_at: '2024-01-14T15:45:00Z'
      },
      {
        id: 3,
        name: 'Amara Okafor',
        email: '',
        content: 'As a Ghanaian, I appreciate seeing our stories told authentically. The cultural details are spot on and the performances are powerful. This film deserves more attention!',
        rating: 5,
        created_at: '2024-01-13T20:15:00Z'
      }
    ]
  }
})
</script>
