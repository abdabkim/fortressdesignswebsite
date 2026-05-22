<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppNavbar />

    <!-- Empty Cart -->
    <main v-if="cartStore.items.length === 0" class="flex-1 flex items-center justify-center py-20">
      <div class="text-center">
        <ShoppingBag class="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h1 class="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p class="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <NuxtLink to="/shop">
          <button class="gradient-bg-accent text-white text-lg px-8 py-4 rounded-full flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity">
            Continue Shopping <ArrowRight class="h-5 w-5" />
          </button>
        </NuxtLink>
      </div>
    </main>

    <!-- Cart with items -->
    <main v-else class="flex-1 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items -->
          <div class="lg:col-span-2 space-y-4">
            <div v-for="item in cartStore.items" :key="item.id" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div class="flex gap-4">
                <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
                      <p v-if="item.size" class="text-sm text-gray-500">Size: {{ item.size }}</p>
                      <p v-if="item.color" class="text-sm text-gray-500">Color: {{ item.color }}</p>
                    </div>
                    <button @click="cartStore.removeItem(item.id)" class="text-red-500 hover:text-red-700 p-1">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                  <div class="flex items-center justify-between mt-4">
                    <div class="flex items-center gap-2">
                      <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <Minus class="h-3 w-3" />
                      </button>
                      <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                      <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <Plus class="h-3 w-3" />
                      </button>
                    </div>
                    <span class="font-bold text-primary">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <button @click="cartStore.clearCart()" class="text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm">
              Clear Cart
            </button>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
              <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
              <div class="space-y-3 mb-4">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${{ cartStore.total.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{{ cartStore.total >= 50 ? 'Free' : '$5.99' }}</span>
                </div>
                <hr class="border-gray-200" />
                <div class="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span class="text-primary">${{ (cartStore.total + (cartStore.total >= 50 ? 0 : 5.99)).toFixed(2) }}</span>
                </div>
              </div>

              <div class="space-y-2 mb-4">
                <label class="text-sm font-medium">Promo Code</label>
                <div class="flex gap-2">
                  <input v-model="promoCode" placeholder="Enter code" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Apply</button>
                </div>
              </div>

              <NuxtLink to="/checkout" class="block">
                <button class="w-full gradient-bg-accent text-white py-4 rounded-xl flex items-center justify-center gap-2 font-medium hover:opacity-90 transition-opacity">
                  Proceed to Checkout <ArrowRight class="h-5 w-5" />
                </button>
              </NuxtLink>
              <p class="text-xs text-center text-gray-500 mt-3">Free shipping on orders over $50</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus } from '@lucide/vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const promoCode = ref('')

useHead({ title: 'Shopping Cart - Fortress Designs' })
</script>
