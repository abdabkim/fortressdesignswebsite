export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  if (!authStore.loading && !authStore.user) {
    return navigateTo('/login')
  }
})
