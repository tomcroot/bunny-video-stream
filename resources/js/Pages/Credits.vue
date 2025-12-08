<template>
  <div class="min-h-screen bg-background">

    <!-- ✅ CINEMATIC MINI HERO -->
    <section class="relative h-[45vh] flex items-center justify-center overflow-hidden bg-black">
      <!-- Gradient backdrop -->
      <div class="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-black"></div>

      <div class="relative z-10 text-center px-6">
        <span class="inline-block mb-4 px-4 py-1 text-xs tracking-widest uppercase border border-red-500 text-red-400 rounded-full">
          🚀 World Premiere Exclusive
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4">
          Credits
        </h1>
        <p class="max-w-2xl mx-auto text-gray-300 text-lg">
          Meet the talented cast & crew who brought
          <strong class="text-white">A Crazy Day in Accra</strong> to life.
        </p>
      </div>
    </section>

    <!-- ✅ MAIN CONTENT -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <div class="space-y-20">

        <!-- ================= CAST ================= -->
        <section id="cast" class="space-y-12">
          <div class="text-center">
            <div class="inline-flex items-center gap-3 mb-4">
              <Users class="h-8 w-8 text-primary" />
              <h2 class="text-4xl font-bold text-foreground">Cast</h2>
            </div>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              The remarkable actors who shaped the story on screen.
            </p>
          </div>

          <!-- Lead Cast -->
          <div class="space-y-8">
            <h3 class="text-2xl font-semibold border-b border-border pb-3">
              Lead Cast
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card
                v-for="member in castMembers.filter(m => m.role_title?.toLowerCase().includes('lead'))"
                :key="member.id"
                class="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <div class="aspect-3/4 bg-muted relative overflow-hidden">
                      <img
                        v-if="member.image_url"
                        :src="member.image_url"
                        :alt="member.stage_name"
                        class="w-full h-full object-cover hover:scale-105 transition"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <Users class="h-16 w-16 text-muted-foreground/50" />
                      </div>
                      <div class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                      <div class="absolute bottom-3 left-3 right-3">
                        <span class="bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {{ member.role_title }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardContent class="md:w-2/3 p-6">
                    <h4 class="text-2xl font-bold mb-1">
                      {{ member.stage_name }}
                    </h4>
                    <p v-if="member.real_name" class="text-sm italic text-muted-foreground mb-3">
                      {{ member.real_name }}
                    </p>
                    <p v-if="member.bio" class="text-muted-foreground leading-relaxed">
                      {{ member.bio }}
                    </p>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>

          <!-- Supporting Cast -->
          <div class="space-y-8">
            <h3 class="text-2xl font-semibold border-b border-border pb-3">
              Supporting Cast
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                v-for="member in castMembers.filter(m => !m.role_title?.toLowerCase().includes('lead'))"
                :key="member.id"
                class="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div class="aspect-square bg-muted relative overflow-hidden mb-4">
                  <img
                    v-if="member.image_url"
                    :src="member.image_url"
                    class="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Users class="h-12 w-12 text-muted-foreground/50" />
                  </div>

                  <div class="absolute bottom-2 left-2 right-2">
                    <span class="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {{ member.role_title }}
                    </span>
                  </div>
                </div>

                <CardContent class="p-4">
                  <h4 class="font-semibold">{{ member.stage_name }}</h4>
                  <p v-if="member.real_name" class="text-sm italic text-muted-foreground">
                    {{ member.real_name }}
                  </p>
                  <p v-if="member.bio" class="text-sm mt-2 line-clamp-3 text-muted-foreground">
                    {{ member.bio }}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <!-- ================= CREW ================= -->
        <section id="crew" class="space-y-12">
          <div class="text-center">
            <div class="inline-flex items-center gap-3 mb-4">
              <Film class="h-8 w-8 text-primary" />
              <h2 class="text-4xl font-bold text-foreground">Crew</h2>
            </div>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              The visionaries and technicians behind the scenes.
            </p>
          </div>

          <!-- Direction -->
          <div class="space-y-8">
            <h3 class="text-2xl font-semibold border-b border-border pb-3">
              Direction
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card
                v-for="member in crewMembers.filter(m => m.job_title?.toLowerCase().includes('director'))"
                :key="member.id"
                class="hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
              >
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <img
                      v-if="member.image_url"
                      :src="member.image_url"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-muted">
                      <Film class="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  </div>

                  <CardContent class="md:w-2/3 p-6">
                    <h4 class="text-2xl font-bold mb-1">
                      {{ member.stage_name }}
                    </h4>
                    <p class="italic text-sm text-muted-foreground mb-3">
                      {{ member.job_title }}
                    </p>
                    <p v-if="member.bio" class="text-muted-foreground">
                      {{ member.bio }}
                    </p>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>

        </section>

        <!-- ================= EMPTY STATE ================= -->
        <div
          v-if="castMembers.length === 0 && crewMembers.length === 0"
          class="text-center py-16"
        >
          <Film class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p class="text-muted-foreground text-lg">
            No cast & crew information available yet.
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users, Film } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import PublicLayout from '@/Layouts/PublicLayout.vue'

defineOptions({ layout: PublicLayout })

const props = defineProps({
  castCrew: Array,
  pageContent: Object,
})

const castMembers = computed(() => {
  return props.castCrew?.filter(
    member => member.role_type === 'cast' && member.is_active
  ) || []
})

const crewMembers = computed(() => {
  return props.castCrew?.filter(
    member => member.role_type === 'crew' && member.is_active
  ) || []
})
</script>
