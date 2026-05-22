import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: true,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    setUser(user: User | null) {
      this.user = user
      this.loading = false
    },
    setLoading(loading: boolean) {
      this.loading = loading
    },
  },
})
