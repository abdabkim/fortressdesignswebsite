import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as any[],
  }),
  getters: {
    itemCount: (state) => state.items.length,
    isInWishlist: (state) => (id: any) => state.items.some((item) => item.id === id),
  },
  actions: {
    load() {
      const authStore = useAuthStore()
      const storageKey = `fortress_wishlist_${authStore.user?.uid || 'guest'}`
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          this.items = JSON.parse(saved)
        }
      } catch (e) {
        console.error('Failed to load wishlist', e)
      }
    },
    save() {
      const authStore = useAuthStore()
      const storageKey = `fortress_wishlist_${authStore.user?.uid || 'guest'}`
      localStorage.setItem(storageKey, JSON.stringify(this.items))
    },
    toggleItem(product: any) {
      const index = this.items.findIndex((item) => item.id === product.id)
      if (index !== -1) {
        this.items.splice(index, 1)
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price || 29.99, // default price if not provided
          image: product.image || product.thumbnail_url,
          addedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        })
      }
      this.save()
    },
    removeItem(id: any) {
      this.items = this.items.filter((item) => item.id !== id)
      this.save()
    },
    removeItems(ids: any[]) {
      this.items = this.items.filter((item) => !ids.includes(item.id))
      this.save()
    },
  },
})
