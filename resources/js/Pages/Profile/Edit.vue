<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Navigation -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p class="mt-2 text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <a href="/profile/payments" class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
          Payment History
        </a>
      </div>

      <!-- Profile Information -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account's profile information and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input
                id="name"
                v-model="profileForm.name"
                :class="{ 'border-red-500': profileForm.errors.name }"
                required
              />
              <div v-if="profileForm.errors.name" class="text-sm text-red-600">
                {{ profileForm.errors.name }}
              </div>
            </div>

            <div class="space-y-2">
              <Label for="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                v-model="profileForm.email"
                :class="{ 'border-red-500': profileForm.errors.email }"
              />
              <p class="text-xs text-muted-foreground">We'll email a verification link whenever you add or change this.</p>
              <div v-if="profileForm.errors.email" class="text-sm text-red-600">
                {{ profileForm.errors.email }}
              </div>
            </div>

            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input
                id="phone"
                v-model="profileForm.phone_number"
                :class="{ 'border-red-500': profileForm.errors.phone_number }"
                required
              />
              <div v-if="profileForm.errors.phone_number" class="text-sm text-red-600">
                {{ profileForm.errors.phone_number }}
              </div>
            </div>

            <Button type="submit" :disabled="profileForm.processing">
              {{ profileForm.processing ? 'Saving...' : 'Save Changes' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Update Password -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="updatePassword" class="space-y-4">
            <div class="space-y-2">
              <Label for="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                v-model="passwordForm.current_password"
                :class="{ 'border-red-500': passwordForm.errors.current_password }"
                required
              />
              <div v-if="passwordForm.errors.current_password" class="text-sm text-red-600">
                {{ passwordForm.errors.current_password }}
              </div>
            </div>

            <div class="space-y-2">
              <Label for="password">New Password</Label>
              <Input
                id="password"
                type="password"
                v-model="passwordForm.password"
                :class="{ 'border-red-500': passwordForm.errors.password }"
                required
              />
              <div v-if="passwordForm.errors.password" class="text-sm text-red-600">
                {{ passwordForm.errors.password }}
              </div>
            </div>

            <div class="space-y-2">
              <Label for="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                v-model="passwordForm.password_confirmation"
                required
              />
            </div>

            <Button type="submit" :disabled="passwordForm.processing">
              {{ passwordForm.processing ? 'Updating...' : 'Update Password' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Delete Account -->
      <Card class="border-red-600">
        <CardHeader>
          <CardTitle class="text-red-600">Delete Account</CardTitle>
          <CardDescription>Permanently delete your account and all associated data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">
            Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
          </p>
          <Button variant="destructive" @click="showDeleteModal = true">
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <!-- Delete Confirmation Modal -->
      <Dialog v-model:open="showDeleteModal">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <form @submit.prevent="deleteAccount" class="space-y-4">
            <div class="space-y-2">
              <Label for="delete_password">Password</Label>
              <Input
                id="delete_password"
                type="password"
                v-model="deleteForm.password"
                placeholder="Enter your password to confirm"
                :class="{ 'border-red-500': deleteForm.errors.password }"
                required
              />
              <div v-if="deleteForm.errors.password" class="text-sm text-red-600">
                {{ deleteForm.errors.password }}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" @click="showDeleteModal = false">
                Cancel
              </Button>
              <Button type="submit" variant="destructive" :disabled="deleteForm.processing">
                {{ deleteForm.processing ? 'Deleting...' : 'Delete Account' }}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useForm, Link } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PublicLayout from '@/Layouts/PublicLayout.vue'

defineOptions({ layout: PublicLayout })

const props = defineProps({
  user: Object
})

const showDeleteModal = ref(false)

const profileForm = useForm({
  name: props.user.name,
  email: props.user.email,
  phone_number: props.user.phone_number
})

const passwordForm = useForm({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const deleteForm = useForm({
  password: ''
})

const updateProfile = () => {
  profileForm.put('/profile', {
    preserveScroll: true,
    onSuccess: () => {
      alert('Profile updated successfully!')
    }
  })
}

const updatePassword = () => {
  passwordForm.put('/profile/password', {
    preserveScroll: true,
    onSuccess: () => {
      passwordForm.reset()
      alert('Password updated successfully!')
    }
  })
}

const deleteAccount = () => {
  deleteForm.delete('/profile', {
    onSuccess: () => {
      showDeleteModal.value = false
    }
  })
}
</script>
