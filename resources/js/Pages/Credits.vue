<template>
  <div class="min-h-screen bg-background">

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-foreground mb-8">Credits</h1>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Meet the talented cast and crew who brought "A Crazy Day in Accra" to life.
          This film showcases the incredible talent and dedication of our Ghanaian film industry.
        </p>
      </div>

      <!-- Content -->
      <div class="space-y-20">
        <!-- Cast Section -->
        <section class="space-y-12">
          <!-- Cast Header -->
          <div class="text-center">
            <div class="inline-flex items-center gap-3 mb-4">
              <Users class="h-8 w-8 text-primary" />
              <h2 class="text-4xl font-bold text-foreground">Cast</h2>
            </div>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the talented actors who brought our characters to life on screen.
            </p>
          </div>

          <!-- Lead Cast -->
          <div class="space-y-8">
            <h3 class="text-2xl font-semibold text-foreground border-b border-border pb-3">Lead Cast</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card v-for="member in castMembers.filter(m => m.role_title?.toLowerCase().includes('lead'))" :key="member.id" class="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <div class="aspect-3/4 bg-muted relative overflow-hidden">
                      <img
                        v-if="member.image_url"
                        :src="member.image_url"
                        :alt="member.stage_name"
                        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                        <Users class="h-16 w-16 text-muted-foreground/60" />
                      </div>
                      <div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                      <div class="absolute bottom-4 left-4 right-4">
                        <div class="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                          <p class="text-white font-medium text-sm">{{ member.role_title }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent class="md:w-2/3 p-6">
                    <div class="mb-4">
                      <h4 class="text-2xl font-bold text-foreground mb-2">{{ member.stage_name }}</h4>
                      <p v-if="member.real_name" class="text-sm text-muted-foreground italic mb-3">
                        {{ member.real_name }}
                      </p>
                    </div>
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
            <h3 class="text-2xl font-semibold text-foreground border-b border-border pb-3">Supporting Cast</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card v-for="member in castMembers.filter(m => !m.role_title?.toLowerCase().includes('lead'))" :key="member.id" class="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div class="aspect-square bg-muted relative overflow-hidden mb-4">
                  <img
                    v-if="member.image_url"
                    :src="member.image_url"
                    :alt="member.stage_name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                    <Users class="h-12 w-12 text-muted-foreground/60" />
                  </div>
                  <div class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  <div class="absolute bottom-3 left-3 right-3">
                    <div class="bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
                      <p class="text-white font-medium text-xs">{{ member.role_title }}</p>
                    </div>
                  </div>
                </div>
                <CardContent class="p-4">
                  <h4 class="text-lg font-semibold text-foreground mb-1">{{ member.stage_name }}</h4>
                  <p v-if="member.real_name" class="text-sm text-muted-foreground italic mb-2">
                    {{ member.real_name }}
                  </p>
                  <p v-if="member.bio" class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {{ member.bio }}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <!-- Visual Separator -->
        <div class="flex items-center justify-center py-8">
          <div class="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
          <div class="mx-8">
            <Film class="h-8 w-8 text-primary" />
          </div>
          <div class="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
        </div>

        <!-- Crew Section -->
        <section class="space-y-12">
          <!-- Crew Header -->
          <div class="text-center">
            <div class="inline-flex items-center gap-3 mb-4">
              <Film class="h-8 w-8 text-primary" />
              <h2 class="text-4xl font-bold text-foreground">Crew</h2>
            </div>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              The talented professionals behind the scenes who made this film possible.
            </p>
          </div>

          <!-- Direction Department -->
          <div class="space-y-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-primary/10 rounded-lg">
                <Film class="h-6 w-6 text-primary" />
              </div>
              <h3 class="text-2xl font-semibold text-foreground">Direction</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card v-for="member in crewMembers.filter(m => m.job_title?.toLowerCase().includes('director'))" :key="member.id" class="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <div class="aspect-3/4 bg-muted relative overflow-hidden">
                      <img
                        v-if="member.image_url"
                        :src="member.image_url"
                        :alt="member.stage_name"
                        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                        <Film class="h-16 w-16 text-muted-foreground/60" />
                      </div>
                      <div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                      <div class="absolute bottom-4 left-4 right-4">
                        <div class="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                          <p class="text-white font-medium text-sm">{{ member.job_title }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent class="md:w-2/3 p-6">
                    <div class="mb-4">
                      <h4 class="text-2xl font-bold text-foreground mb-2">{{ member.stage_name }}</h4>
                      <p v-if="member.real_name" class="text-sm text-muted-foreground italic">
                        {{ member.real_name }}
                      </p>
                    </div>
                    <p v-if="member.bio" class="text-muted-foreground leading-relaxed">
                      {{ member.bio }}
                    </p>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>

          <!-- Production Department -->
          <div class="space-y-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-primary/10 rounded-lg">
                <Award class="h-6 w-6 text-primary" />
              </div>
              <h3 class="text-2xl font-semibold text-foreground">Production</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card v-for="member in crewMembers.filter(m => m.job_title?.toLowerCase().includes('producer') || m.job_title?.toLowerCase().includes('production'))" :key="member.id" class="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div class="aspect-square bg-muted relative overflow-hidden mb-4">
                  <img
                    v-if="member.image_url"
                    :src="member.image_url"
                    :alt="member.stage_name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                    <Award class="h-12 w-12 text-muted-foreground/60" />
                  </div>
                  <div class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  <div class="absolute bottom-3 left-3 right-3">
                    <div class="bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
                      <p class="text-white font-medium text-xs">{{ member.job_title }}</p>
                    </div>
                  </div>
                </div>
                <CardContent class="p-4">
                  <h4 class="text-lg font-semibold text-foreground mb-1">{{ member.stage_name }}</h4>
                  <p v-if="member.real_name" class="text-sm text-muted-foreground italic mb-2">
                    {{ member.real_name }}
                  </p>
                  <p v-if="member.bio" class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {{ member.bio }}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- Technical Team -->
          <div class="space-y-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-primary/10 rounded-lg">
                <Users class="h-6 w-6 text-primary" />
              </div>
              <h3 class="text-2xl font-semibold text-foreground">Technical Team</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card v-for="member in crewMembers.filter(m => !m.job_title?.toLowerCase().includes('director') && !m.job_title?.toLowerCase().includes('producer') && !m.job_title?.toLowerCase().includes('production'))" :key="member.id" class="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div class="aspect-square bg-muted relative overflow-hidden mb-4">
                  <img
                    v-if="member.image_url"
                    :src="member.image_url"
                    :alt="member.stage_name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                    <Users class="h-12 w-12 text-muted-foreground/60" />
                  </div>
                  <div class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  <div class="absolute bottom-3 left-3 right-3">
                    <div class="bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
                      <p class="text-white font-medium text-xs">{{ member.job_title }}</p>
                    </div>
                  </div>
                </div>
                <CardContent class="p-4">
                  <h4 class="text-lg font-semibold text-foreground mb-1">{{ member.stage_name }}</h4>
                  <p v-if="member.real_name" class="text-sm text-muted-foreground italic mb-2">
                    {{ member.real_name }}
                  </p>
                  <p v-if="member.bio" class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {{ member.bio }}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <!-- Empty States -->
        <div v-if="castMembers.length === 0 && crewMembers.length === 0" class="text-center py-12">
          <Film class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p class="text-muted-foreground text-lg">No cast and crew information available at the moment.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users, Film, Award } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import PublicLayout from '@/Layouts/PublicLayout.vue'
defineOptions({ layout: PublicLayout })

// Props from Laravel backend
const props = defineProps({
  castCrew: Array,
  pageContent: Object
})

// Computed properties
const castMembers = computed(() => {
  return props.castCrew?.filter(member => member.role_type === 'cast' && member.is_active) || []
})

const crewMembers = computed(() => {
  return props.castCrew?.filter(member => member.role_type === 'crew' && member.is_active) || []
})
</script>
