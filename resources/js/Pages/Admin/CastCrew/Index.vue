<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p class="text-muted-foreground">Manage Cast & Crew</p>
          </div>
          <Link
            href="/admin/cast-crew/create"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus class="h-4 w-4 mr-2" />
            Add Member
          </Link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-card rounded-lg shadow">
        <div class="px-6 py-4 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">Cast & Crew Members</h2>
        </div>

        <div class="p-6">
          <div v-if="castCrew.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">No cast or crew members found. Add your first member to get started.</p>
          </div>

          <div v-else class="space-y-4">
            <!-- Filter Tabs -->
            <div class="flex space-x-4 mb-6">
              <button
                @click="activeFilter = 'all'"
                :class="['px-4 py-2 rounded-md text-sm font-medium', activeFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80']"
              >
                All ({{ castCrew.length }})
              </button>
              <button
                @click="activeFilter = 'cast'"
                :class="['px-4 py-2 rounded-md text-sm font-medium', activeFilter === 'cast' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80']"
              >
                Cast ({{ castCount }})
              </button>
              <button
                @click="activeFilter = 'crew'"
                :class="['px-4 py-2 rounded-md text-sm font-medium', activeFilter === 'crew' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80']"
              >
                Crew ({{ crewCount }})
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="member in filteredMembers"
                :key="member.id"
                class="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
              >
                <div class="aspect-square bg-muted">
                  <img
                    :src="member.photo_url || '/placeholder-avatar.jpg'"
                    :alt="member.name"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-medium text-foreground">{{ member.name }}</h3>
                    <span :class="['px-2 py-1 text-xs rounded-full', member.role_type === 'cast' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800']">
                      {{ member.role_type === 'cast' ? 'Cast' : 'Crew' }}
                    </span>
                  </div>

                  <p class="text-sm text-muted-foreground mb-2">{{ member.role }}</p>
                  <p class="text-sm text-muted-foreground mb-3">{{ member.bio }}</p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span :class="['px-2 py-1 text-xs rounded-full', member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                        {{ member.is_active ? 'Active' : 'Inactive' }}
                      </span>
                      <span class="text-xs text-muted-foreground">
                        Order: {{ member.display_order }}
                      </span>
                    </div>
                  </div>

                  <div class="flex space-x-2 mt-3">
                    <Link
                      :href="`/admin/cast-crew/${member.id}`"
                      class="flex-1 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded text-center hover:bg-secondary/80 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      :href="`/admin/cast-crew/${member.id}/edit`"
                      class="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>

                  <div class="mt-2">
                    <button
                      @click="deleteMember(member.id)"
                      class="w-full px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link, router } from '@inertiajs/vue3'
import { Plus } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const props = defineProps({
  castCrew: { type: Array, default: () => [] }
})

const castCrew = computed(() => props.castCrew ?? [])
const activeFilter = ref('all')

const castCount = computed(() => castCrew.value.filter(member => member.role_type === 'cast').length)
const crewCount = computed(() => castCrew.value.filter(member => member.role_type === 'crew').length)

const filteredMembers = computed(() => {
  if (activeFilter.value === 'all') {
    return castCrew.value
  }
  return castCrew.value.filter(member => member.role_type === activeFilter.value)
})

const deleteMember = (id) => {
  if (confirm('Are you sure you want to delete this cast/crew member?')) {
    router.delete(`/admin/cast-crew/${id}`)
  }
}
</script>
