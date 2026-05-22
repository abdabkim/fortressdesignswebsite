<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNavbar />

    <main class="flex-1 py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Back -->
        <NuxtLink to="/account">
          <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft class="h-4 w-4" /> Back to Dashboard
          </button>
        </NuxtLink>

        <h1 class="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p class="text-gray-500 mb-8">Manage your personal information and account security.</p>

        <!-- Avatar Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
          <div class="flex items-center gap-6">
            <div class="relative shrink-0">
              <div v-if="authStore.user?.photoURL" class="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary ring-offset-2">
                <img :src="authStore.user.photoURL" :alt="authStore.user.displayName || 'User'" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center ring-4 ring-primary ring-offset-2">
                <span class="text-4xl font-bold text-white">{{ userInitial }}</span>
              </div>
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm mb-1">{{ authStore.user?.displayName || 'No name set' }}</p>
              <p class="text-sm text-gray-500 mb-3">{{ authStore.user?.email }}</p>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  :class="authStore.user?.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                  <CheckCircle v-if="authStore.user?.emailVerified" class="h-3 w-3" />
                  <AlertCircle v-else class="h-3 w-3" />
                  {{ authStore.user?.emailVerified ? 'Verified' : 'Not Verified' }}
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                  <component :is="providerIcon" class="h-3 w-3" />
                  {{ authProviderLabel }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Name Form -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>

          <div v-if="nameSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle class="h-4 w-4 shrink-0" /> Display name updated successfully!
          </div>
          <div v-if="nameError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle class="h-4 w-4 shrink-0" /> {{ nameError }}
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  v-model="displayName"
                  type="text"
                  placeholder="Your full name"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  :value="authStore.user?.email"
                  type="email"
                  disabled
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                />
              </div>
              <p class="text-xs text-gray-400 mt-1">Email cannot be changed here. Use account security settings.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
              <div class="relative">
                <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  :value="accountCreated"
                  disabled
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Sign In</label>
              <div class="relative">
                <Clock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  :value="lastSignIn"
                  disabled
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <button
              @click="saveDisplayName"
              :disabled="nameSaving || displayName === authStore.user?.displayName"
              class="flex items-center gap-2 bg-primary hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm"
            >
              <Loader2 v-if="nameSaving" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              {{ nameSaving ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </div>

        <!-- Change Password -->
        <div v-if="isEmailProvider" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Change Password</h2>
          <p class="text-sm text-gray-500 mb-4">We'll send a password reset link to your email address.</p>

          <div v-if="passwordMsg" class="mb-4 p-3 rounded-lg text-sm flex items-center gap-2"
            :class="passwordMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'">
            <CheckCircle v-if="passwordMsg.type === 'success'" class="h-4 w-4 shrink-0" />
            <AlertCircle v-else class="h-4 w-4 shrink-0" />
            {{ passwordMsg.text }}
          </div>

          <button
            @click="sendPasswordReset"
            :disabled="passwordSending"
            class="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 px-6 py-3 rounded-xl font-medium transition-colors text-sm"
          >
            <Loader2 v-if="passwordSending" class="h-4 w-4 animate-spin" />
            <KeyRound v-else class="h-4 w-4" />
            {{ passwordSending ? 'Sending…' : 'Send Password Reset Email' }}
          </button>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <h2 class="text-lg font-semibold text-red-600 mb-1">Sign Out</h2>
          <p class="text-sm text-gray-500 mb-4">Sign out of your Fortress Designs account on this device.</p>
          <button
            @click="handleLogout"
            class="flex items-center gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl font-medium transition-colors text-sm"
          >
            <LogOut class="h-4 w-4" />
            Sign Out
          </button>
        </div>

      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ArrowLeft, User, Mail, Calendar, Clock, Save, Loader2, CheckCircle, AlertCircle,
  KeyRound, LogOut, Shield, LogIn
} from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Profile Settings - Fortress Designs' })

const authStore = useAuthStore()
const { $firebaseAuth } = useNuxtApp()

// Editable state
const displayName = ref(authStore.user?.displayName || '')
const nameSaving = ref(false)
const nameSuccess = ref(false)
const nameError = ref('')
const passwordSending = ref(false)
const passwordMsg = ref(null)

// Computed info
const userInitial = computed(() => {
  const name = authStore.user?.displayName || authStore.user?.email || '?'
  return name.charAt(0).toUpperCase()
})

const accountCreated = computed(() => {
  const ts = authStore.user?.metadata?.creationTime
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
})

const lastSignIn = computed(() => {
  const ts = authStore.user?.metadata?.lastSignInTime
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
})

const authProviderLabel = computed(() => {
  const providers = authStore.user?.providerData?.map(p => p.providerId) || []
  if (providers.includes('google.com')) return 'Google'
  if (providers.includes('password')) return 'Email & Password'
  return 'Unknown'
})

const providerIcon = computed(() => {
  const providers = authStore.user?.providerData?.map(p => p.providerId) || []
  return providers.includes('google.com') ? LogIn : Shield
})

const isEmailProvider = computed(() =>
  authStore.user?.providerData?.some(p => p.providerId === 'password') ?? false
)

// Save display name via Firebase updateProfile
async function saveDisplayName() {
  nameError.value = ''
  nameSuccess.value = false
  nameSaving.value = true
  try {
    await $firebaseAuth.updateDisplayName(displayName.value)
    nameSuccess.value = true
    setTimeout(() => (nameSuccess.value = false), 4000)
  } catch (err) {
    nameError.value = err.message || 'Failed to update name. Please try again.'
  } finally {
    nameSaving.value = false
  }
}

async function sendPasswordReset() {
  passwordSending.value = true
  passwordMsg.value = null
  try {
    await $firebaseAuth.sendPasswordReset(authStore.user?.email)
    passwordMsg.value = { type: 'success', text: 'Password reset email sent! Check your inbox.' }
  } catch (err) {
    passwordMsg.value = { type: 'error', text: err.message || 'Failed to send reset email.' }
  } finally {
    passwordSending.value = false
  }
}

async function handleLogout() {
  await $firebaseAuth.logout()
  navigateTo('/')
}
</script>
