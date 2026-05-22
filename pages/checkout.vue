<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNavbar />

    <main class="flex-1 py-12">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 mb-8">
          <NuxtLink to="/cart" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Cart</NuxtLink>
          <ChevronRight class="h-4 w-4 text-gray-400" />
          <span class="text-sm font-bold text-gray-900">Checkout</span>
        </div>

        <div v-if="orderPlaced" class="bg-white rounded-2xl shadow-sm border border-green-100 p-16 text-center">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle class="h-10 w-10 text-green-600" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p class="text-gray-500 mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your order has been placed and is being processed by Printful.
            We've sent a confirmation email to {{ authStore.user?.email || 'your email' }}.
          </p>
          <NuxtLink to="/account/orders">
            <button class="bg-primary hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-colors">
              View Order Status
            </button>
          </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column: Checkout Form -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Polar.sh Banner -->
            <div class="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <Zap class="h-5 w-5 text-white" />
              </div>
              <div>
                <p class="text-white font-semibold mb-0.5">Secure Checkout powered by Polar.sh</p>
                <p class="text-blue-100 text-sm">You are in Demo Mode. No real charges will be made until integration is finalized.</p>
              </div>
            </div>

            <!-- Shipping Information -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin class="h-5 w-5 text-primary" /> Shipping Address
              </h2>
              
              <div v-if="addresses.length > 0" class="space-y-3">
                <label v-for="addr in addresses" :key="addr.id" class="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" :class="selectedAddress === addr.id ? 'border-primary bg-purple-50' : 'border-gray-200'">
                  <div class="pt-1">
                    <input type="radio" :value="addr.id" v-model="selectedAddress" class="w-4 h-4 accent-primary" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="font-semibold text-gray-900">{{ addr.name }} <span v-if="addr.label" class="text-xs text-gray-500 font-normal">({{ addr.label }})</span></p>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ addr.line1 }}<span v-if="addr.line2">, {{ addr.line2 }}</span></p>
                    <p class="text-sm text-gray-600">{{ addr.city }}, {{ addr.state }} {{ addr.zip }}</p>
                    <p class="text-sm text-gray-600">{{ addr.country }}</p>
                  </div>
                </label>
                <NuxtLink to="/account/addresses" class="inline-block mt-2 text-sm text-primary font-medium hover:underline">+ Manage addresses</NuxtLink>
              </div>
              
              <div v-else class="text-center p-6 border border-dashed rounded-xl border-gray-300">
                <p class="text-gray-500 text-sm mb-3">You don't have any saved addresses.</p>
                <NuxtLink to="/account/addresses">
                  <button class="text-primary text-sm font-medium border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Add Address
                  </button>
                </NuxtLink>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard class="h-5 w-5 text-primary" /> Payment Method
              </h2>
              
              <div class="space-y-3">
                <label class="flex items-center justify-between p-4 border border-primary bg-purple-50 rounded-xl cursor-pointer">
                  <div class="flex items-center gap-3">
                    <input type="radio" checked class="w-4 h-4 accent-primary" />
                    <div class="w-10 h-6 bg-blue-600 text-white text-xs font-bold flex items-center justify-center rounded">VISA</div>
                    <div>
                      <p class="font-medium text-gray-900 text-sm">Visa ending in 4242</p>
                      <p class="text-xs text-gray-500">Expires 12/27</p>
                    </div>
                  </div>
                </label>
                <NuxtLink to="/account/payment" class="inline-block mt-2 text-sm text-primary font-medium hover:underline">+ Manage payment methods</NuxtLink>
              </div>
            </div>

          </div>

          <!-- Right Column: Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div class="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                <div v-for="item in cartStore.items" :key="item.id" class="flex gap-3">
                  <div class="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 text-sm line-clamp-1">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                    <p class="text-sm font-semibold text-primary mt-1">${{ (item.price * item.quantity).toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t border-gray-100">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-medium text-gray-900">${{ cartStore.total.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span class="font-medium text-gray-900">{{ shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}` }}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Tax (estimated)</span>
                  <span class="font-medium text-gray-900">${{ taxAmount.toFixed(2) }}</span>
                </div>
                
                <div class="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100 mt-3">
                  <span>Total</span>
                  <span class="text-primary">${{ finalTotal.toFixed(2) }}</span>
                </div>
              </div>

              <button 
                @click="placeOrder" 
                :disabled="isProcessing || cartStore.items.length === 0 || !selectedAddress"
                class="w-full mt-6 bg-primary hover:bg-purple-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="isProcessing" class="h-5 w-5 animate-spin" />
                <span v-else>Place Order (Demo)</span>
              </button>
              
              <p class="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                <Lock class="h-3 w-3" /> Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronRight, CheckCircle, MapPin, CreditCard, Lock, Zap, Loader2 } from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Checkout - Fortress Designs' })

const authStore = useAuthStore()
const cartStore = useCartStore()

const addresses = ref([])
const selectedAddress = ref('')

const isProcessing = ref(false)
const orderPlaced = ref(false)

const storageKey = () => `fortress_addresses_${authStore.user?.uid || 'guest'}`

onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey())
    if (saved) {
      addresses.value = JSON.parse(saved)
      const def = addresses.value.find(a => a.isDefault)
      if (def) selectedAddress.value = def.id
      else if (addresses.value.length > 0) selectedAddress.value = addresses.value[0].id
    }
  } catch {}
})

const shippingCost = computed(() => cartStore.total >= 50 ? 0 : 5.99)
const taxAmount = computed(() => cartStore.total * 0.08) // 8% dummy tax
const finalTotal = computed(() => cartStore.total + shippingCost.value + taxAmount.value)

async function placeOrder() {
  if (cartStore.items.length === 0 || !selectedAddress.value) return
  
  isProcessing.value = true
  
  // Simulate network request to Polar / Printful API
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isProcessing.value = false
  orderPlaced.value = true
  cartStore.clearCart()
  
  // Scroll to top to see confirmation
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
