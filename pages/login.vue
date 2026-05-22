<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppNavbar />

    <main class="flex-1 flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p class="text-gray-500 mt-1">Sign in to your Fortress Designs account</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <input v-model="email" type="email" placeholder="you@example.com" required :disabled="isLoading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Password</label>
              <a href="#" class="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <input v-model="password" type="password" placeholder="Enter your password" required :disabled="isLoading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
          </div>

          <div class="flex items-center gap-2">
            <input id="remember" type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary" />
            <label for="remember" class="text-sm text-gray-600">Remember me</label>
          </div>

          <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>

          <button type="submit" :disabled="isLoading"
            class="w-full bg-primary hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
            <div class="relative flex justify-center text-sm"><span class="bg-white px-4 text-gray-400">or continue with</span></div>
          </div>

          <button type="button" @click="handleGoogleSignIn" :disabled="isLoading"
            class="w-full border border-gray-300 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50">
            <svg class="h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p class="text-center text-sm text-gray-500 mt-4">
            Don't have an account?
            <NuxtLink to="/signup" class="text-primary font-medium hover:underline ml-1">Sign up</NuxtLink>
          </p>
        </form>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { $firebaseAuth } = useNuxtApp()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await $firebaseAuth.signIn(email.value, password.value)
    navigateTo('/')
  } catch (error) {
    errorMsg.value = error.message || 'Please check your credentials and try again.'
  } finally {
    isLoading.value = false
  }
}

const handleGoogleSignIn = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await $firebaseAuth.signInWithGoogle()
    navigateTo('/')
  } catch (error) {
    errorMsg.value = error.message || 'Could not sign in with Google.'
  } finally {
    isLoading.value = false
  }
}

useHead({ title: 'Sign In - Fortress Designs' })
</script>
