<template>
  <div class="min-h-screen bg-background">

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">Behind the Scenes</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore exclusive behind-the-scenes content, cast interviews, making-of footage, and production moments
        </p>
      </div>

      <!-- Category Tabs -->
      <Tabs v-model="activeCategory" class="mb-8">
        <TabsList class="grid w-full max-w-3xl mx-auto grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="behind-the-scenes">BTS</TabsTrigger>
          <TabsTrigger value="cast-interviews">Interviews</TabsTrigger>
          <TabsTrigger value="making-of">Making Of</TabsTrigger>
          <TabsTrigger value="film-stills">Stills</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
        </TabsList>
      </Tabs>

      <!-- Gallery Grid -->
      <div v-if="filteredImages.length === 0" class="text-center py-20">
        <p class="text-muted-foreground">No images found in this category.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(image, index) in filteredImages"
          :key="image.id"
          class="group relative aspect-video overflow-hidden rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-all"
          @click="openLightbox(index)"
        >
          <img
            :src="image.image_url"
            :alt="image.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-white font-semibold text-lg">{{ image.title }}</h3>
              <p v-if="image.description" class="text-white/80 text-sm mt-1">{{ image.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Dialog v-model:open="lightboxOpen">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{{ selectedImage?.title }}</DialogTitle>
          <DialogDescription v-if="selectedImage?.description">
            {{ selectedImage.description }}
          </DialogDescription>
        </DialogHeader>
        <div class="mt-4">
          <img
            v-if="selectedImage"
            :src="selectedImage.image_url"
            :alt="selectedImage.title"
            class="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="previousImage" :disabled="lightboxIndex === 0">
            Previous
          </Button>
          <Button variant="outline" @click="nextImage" :disabled="lightboxIndex === filteredImages.length - 1">
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import PublicLayout from '@/Layouts/PublicLayout.vue'
defineOptions({ layout: PublicLayout })

// Props from Laravel backend
const props = defineProps({
  gallery: Array,
  pageContent: Object
})

// Reactive data
const activeCategory = ref('all')
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

// Computed properties
const images = computed(() => {
  return props.gallery?.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image_url: item.image_url,
    category: item.category || 'behind-the-scenes'
  })) || []
})

const filteredImages = computed(() => {
  if (activeCategory.value === 'all') {
    return images.value
  }
  return images.value.filter(img => img.category === activeCategory.value)
})

const selectedImage = computed(() => {
  return filteredImages.value[lightboxIndex.value]
})

// Methods
const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const nextImage = () => {
  if (lightboxIndex.value < filteredImages.value.length - 1) {
    lightboxIndex.value++
  }
}

const previousImage = () => {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--
  }
}
</script>
