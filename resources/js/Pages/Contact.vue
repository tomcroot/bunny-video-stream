<template>
  <div class="min-h-screen bg-background">

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-foreground mb-8">Contact Us</h1>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get in touch with the "A Crazy Day in Accra" team. We'd love to hear from you!
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="name">Name *</Label>
                  <Input
                    id="name"
                    v-model="form.name"
                    :class="{ 'border-red-500': errors.name }"
                    required
                  />
                  <div v-if="errors.name" class="text-sm text-red-600">
                    {{ errors.name }}
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    v-model="form.email"
                    :class="{ 'border-red-500': errors.email }"
                    required
                  />
                  <div v-if="errors.email" class="text-sm text-red-600">
                    {{ errors.email }}
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <Label for="subject">Subject *</Label>
                <Input
                  id="subject"
                  v-model="form.subject"
                  :class="{ 'border-red-500': errors.subject }"
                  required
                />
                <div v-if="errors.subject" class="text-sm text-red-600">
                  {{ errors.subject }}
                </div>
              </div>

              <div class="space-y-2">
                <Label for="message">Message *</Label>
                <Textarea
                  id="message"
                  v-model="form.message"
                  :class="{ 'border-red-500': errors.message }"
                  rows="5"
                  required
                />
                <div v-if="errors.message" class="text-sm text-red-600">
                  {{ errors.message }}
                </div>
              </div>

              <Button type="submit" :disabled="isSubmitting" class="w-full">
                <span v-if="isSubmitting">Sending...</span>
                <span v-else>Send Message</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <!-- Contact Information -->
        <div class="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Multiple ways to reach out to our team
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center space-x-3">
                <Mail class="h-5 w-5 text-muted-foreground" />
                <div>
                  <p class="font-medium text-foreground">Email</p>
                  <p class="text-sm text-muted-foreground">info@acrazydayinaccra.com</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <Phone class="h-5 w-5 text-muted-foreground" />
                <div>
                  <p class="font-medium text-foreground">Phone</p>
                  <p class="text-sm text-muted-foreground">+233 XX XXX XXXX</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <MapPin class="h-5 w-5 text-muted-foreground" />
                <div>
                  <p class="font-medium text-foreground">Location</p>
                  <p class="text-sm text-muted-foreground">Accra, Ghana</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
              <CardDescription>
                Stay updated with the latest news and behind-the-scenes content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex space-x-4">
                <Button variant="outline" size="sm">
                  <span class="sr-only">Facebook</span>
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  <span class="sr-only">Twitter</span>
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <span class="sr-only">Instagram</span>
                  Instagram
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Footer placeholder -->
    <footer class="bg-gray-900 text-white py-12 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 mb-4 md:mb-0">© 2025 A Crazy Day in Accra. All rights reserved.</p>
            <div class="flex space-x-6">
              <Link href="/terms" class="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import PublicLayout from '@/Layouts/PublicLayout.vue'
defineOptions({ layout: PublicLayout })
import { Mail, Phone, MapPin } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Props from Laravel backend
const props = defineProps({
  pageContent: Object
})

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  } else if (form.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!form.subject.trim()) {
    errors.subject = 'Subject is required'
    isValid = false
  } else if (form.subject.length < 5) {
    errors.subject = 'Subject must be at least 5 characters'
    isValid = false
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  } else if (form.message.length < 10) {
    errors.message = 'Message must be at least 10 characters'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    await router.post('/contact', form, {
      onSuccess: () => {
        // Reset form
        form.name = ''
        form.email = ''
        form.subject = ''
        form.message = ''
        alert('Thank you for your message! We\'ll get back to you soon.')
      },
      onError: (serverErrors) => {
        // Update errors from server response
        if (serverErrors.name) errors.name = serverErrors.name
        if (serverErrors.email) errors.email = serverErrors.email
        if (serverErrors.subject) errors.subject = serverErrors.subject
        if (serverErrors.message) errors.message = serverErrors.message
      },
      onFinish: () => {
        isSubmitting.value = false
      }
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error sending your message. Please try again.')
    isSubmitting.value = false
  }
}
</script>
