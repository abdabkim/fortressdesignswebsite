<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNavbar />

    <main class="flex-1 py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <NuxtLink to="/account">
          <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft class="h-4 w-4" /> Back to Dashboard
          </button>
        </NuxtLink>

        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p class="text-gray-500 mt-1">
              {{ wishlist.length }} {{ wishlist.length === 1 ? 'item' : 'items' }} saved for later
            </p>
          </div>
          <NuxtLink to="/shop">
            <button class="flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm">
              <ShoppingBag class="h-4 w-4" /> Browse Shop
            </button>
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-if="wishlist.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <div class="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Heart class="h-10 w-10 text-red-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p class="text-gray-500 mb-6 max-w-sm mx-auto">Browse the shop and tap the ♥ icon on any product to save it here.</p>
          <NuxtLink to="/shop">
            <button class="inline-flex items-center gap-2 bg-primary hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              <ShoppingBag class="h-4 w-4" /> Explore Products
            </button>
          </NuxtLink>
        </div>

        <!-- Products grid -->
        <div v-else>
          <!-- Bulk actions -->
          <div class="flex items-center justify-between mb-4">
            <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" class="w-4 h-4 accent-primary rounded" />
              Select All
            </label>
            <div class="flex gap-2">
              <button
                v-if="selectedIds.length > 0"
                @click="addSelectedToCart"
                class="flex items-center gap-2 bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <ShoppingCart class="h-4 w-4" /> Add {{ selectedIds.length }} to Cart
              </button>
              <button
                v-if="selectedIds.length > 0"
                @click="removeSelected"
                class="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Trash2 class="h-4 w-4" /> Remove
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in wishlist"
              :key="item.id"
              class="bg-white rounded-2xl shadow-sm border overflow-hidden group transition-all duration-200 hover:shadow-md"
              :class="selectedIds.includes(item.id) ? 'border-primary ring-1 ring-primary' : 'border-gray-100'"
            >
              <!-- Image -->
              <div class="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <!-- Select checkbox -->
                <div class="absolute top-3 left-3">
                  <input type="checkbox" :checked="selectedIds.includes(item.id)" @change="toggleSelect(item.id)"
                    class="w-5 h-5 accent-primary rounded shadow cursor-pointer" />
                </div>
                <!-- Remove from wishlist -->
                <button
                  @click="removeFromWishlist(item.id)"
                  class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                >
                  <Heart class="h-4 w-4 text-red-500 fill-red-500" />
                </button>
                <!-- Add to cart overlay -->
                <div class="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    @click="addToCart(item)"
                    class="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <ShoppingCart class="h-4 w-4" /> Add to Cart
                  </button>
                </div>
              </div>

              <!-- Info -->
              <div class="p-4">
                <p class="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{{ item.name }}</p>
                <p class="text-primary font-bold">${{ item.price.toFixed(2) }}</p>
                <p class="text-xs text-gray-400 mt-1">Added {{ item.addedDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="toastMsg" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium flex items-center gap-2">
        <CheckCircle class="h-4 w-4 text-green-400" /> {{ toastMsg }}
      </div>
    </Transition>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Heart, ShoppingBag, ShoppingCart, Trash2, CheckCircle } from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Wishlist - Fortress Designs' })

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const wishlist = computed(() => wishlistStore.items)
const selectedIds = ref([])
const toastMsg = ref('')

onMounted(() => {
  wishlistStore.load()
})

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => (toastMsg.value = ''), 3000)
}

const allSelected = computed(() => wishlist.value.length > 0 && selectedIds.value.length === wishlist.value.length)

function toggleSelectAll() {
  selectedIds.value = allSelected.value ? [] : wishlist.value.map(i => i.id)
}

function toggleSelect(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id)
  } else {
    selectedIds.value.push(id)
  }
}

function removeFromWishlist(id) {
  wishlistStore.removeItem(id)
  selectedIds.value = selectedIds.value.filter(i => i !== id)
}

function removeSelected() {
  wishlistStore.removeItems(selectedIds.value)
  selectedIds.value = []
  showToast('Items removed from wishlist')
}

function addToCart(item) {
  cartStore.addItem({ id: item.id, variantId: item.id, name: item.name, price: item.price, image: item.image })
  showToast(`${item.name} added to cart!`)
}

function addSelectedToCart() {
  const selected = wishlist.value.filter(i => selectedIds.value.includes(i.id))
  selected.forEach(item => cartStore.addItem({ id: item.id, variantId: item.id, name: item.name, price: item.price, image: item.image }))
  showToast(`${selected.length} items added to cart!`)
  selectedIds.value = []
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
</style>
