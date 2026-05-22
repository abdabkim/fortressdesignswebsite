import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  variantId: number
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    cartCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    addItem(newItem: Omit<CartItem, 'quantity'>) {
      const existing = this.items.find((item) => item.variantId === newItem.variantId)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ ...newItem, quantity: 1 })
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
    },
    updateQuantity(id: number, quantity: number) {
      if (quantity <= 0) {
        this.removeItem(id)
        return
      }
      const item = this.items.find((item) => item.id === id)
      if (item) item.quantity = quantity
    },
    clearCart() {
      this.items = []
    },
  },
})
