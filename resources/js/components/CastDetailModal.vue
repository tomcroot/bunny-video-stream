<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold text-foreground">{{ member.stage_name }}</DialogTitle>
        <DialogDescription class="text-muted-foreground">
          {{ member.job_title || 'Cast Member' }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Profile Image -->
        <div class="space-y-4">
          <div class="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              v-if="member.image_url"
              :src="member.image_url"
              :alt="member.stage_name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Users class="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-4">
          <div v-if="member.real_name" class="space-y-2">
            <h3 class="font-semibold text-foreground">Real Name</h3>
            <p class="text-muted-foreground">{{ member.real_name }}</p>
          </div>

          <div v-if="member.job_title" class="space-y-2">
            <h3 class="font-semibold text-foreground">Role</h3>
            <p class="text-muted-foreground">{{ member.job_title }}</p>
          </div>

          <div v-if="member.bio" class="space-y-2">
            <h3 class="font-semibold text-foreground">Biography</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">{{ member.bio }}</p>
          </div>

          <div v-if="!member.real_name && !member.job_title && !member.bio" class="space-y-2">
            <p class="text-muted-foreground italic">No additional information available.</p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { Users } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

defineProps({
  member: {
    type: Object,
    required: true,
  },
})
</script>
