<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppNavbar />

    <div class="bg-white py-16 text-center border-b">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{{ pageTitle }}</h1>
        <p class="text-xl text-gray-600">{{ pageSubtitle }}</p>
        <NuxtLink v-if="category || isNew || isSale" to="/shop">
          <button class="mt-4 px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">View All Products</button>
        </NuxtLink>
      </div>
    </div>

    <main class="flex-1 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading -->
        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="overflow-hidden rounded-xl bg-white border shadow-sm">
            <div class="h-64 w-full bg-gray-200 animate-pulse"></div>
            <div class="p-4"><div class="h-4 w-3/4 bg-gray-200 animate-pulse mb-2 rounded"></div><div class="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div></div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-500 text-lg mb-4">Unable to load products. Please try again later.</p>
          <button @click="refresh()" class="bg-primary text-white px-6 py-2 rounded-lg">Retry</button>
        </div>

        <!-- Products -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in displayProducts" :key="product.id"
            class="group overflow-hidden border border-gray-200 rounded-xl hover:shadow-lg transition-shadow bg-white"
          >
            <div class="relative aspect-square overflow-hidden bg-gray-100">
              <img :src="product.thumbnail_url" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="flex gap-2">
                  <button @click="handleAddToCart(product)" class="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors" title="Add to Cart">
                    <ShoppingCart class="h-4 w-4" />
                  </button>
                  <button @click="wishlistStore.toggleItem(product)" class="p-2 rounded-lg transition-colors" :class="wishlistStore.isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-900 hover:bg-white'" title="Wishlist">
                    <Heart class="h-4 w-4" :class="{ 'fill-current': wishlistStore.isInWishlist(product.id) }" />
                  </button>
                  <button class="p-2 bg-white/80 rounded-lg hover:bg-white transition-colors" title="Quick View">
                    <Eye class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ product.name }}</h3>
              <p class="text-sm text-gray-500 mb-2">Fortress Designs • {{ product.variants }} variant{{ product.variants !== 1 ? 's' : '' }}</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-primary">$29.99</span>
                <button @click="handleAddToCart(product)" class="gradient-bg-accent text-white text-sm px-3 py-1 rounded-lg hover:opacity-90 transition-opacity">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!pending && !error && displayProducts.length === 0" class="text-center py-20">
          <p class="text-gray-500 text-lg mb-4">No products available in this category at the moment.</p>
          <NuxtLink to="/shop">
            <button class="bg-primary text-white px-6 py-2 rounded-lg">View All Products</button>
          </NuxtLink>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ShoppingCart, Eye, Heart } from '@lucide/vue'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const route = useRoute()

onMounted(() => {
  wishlistStore.load()
})

const category = computed(() => route.query.category || null)
const isNew = computed(() => route.query.new === 'true')
const isSale = computed(() => route.query.sale === 'true')

const pageTitle = computed(() => {
  if (isNew.value) return 'New Arrivals'
  if (isSale.value) return 'Sale Items'
  if (!category.value) return 'All Products'
  const map = { 't-shirts': 'T-Shirts', hoodies: 'Hoodies', sweatshirts: 'Sweatshirts', waterbottles: 'Water Bottles', bags: 'Bags', merch: 'Merch' }
  return map[category.value] || 'All Products'
})

const pageSubtitle = computed(() => {
  if (isNew.value) return 'Check out our latest arrivals'
  if (isSale.value) return 'Amazing deals on selected items'
  if (category.value) return `Browse our collection of ${pageTitle.value.toLowerCase()}`
  return 'Premium streetwear for the bold and fearless'
})

const { data, pending, error, refresh } = await useFetch('/api/catalog')

function categorizeProduct(name) {
  const n = name.toLowerCase()
  if (n.includes('sweatshirt')) return 'sweatshirts'
  if (n.includes('hoodie')) return 'hoodies'
  if (n.includes('t-shirt') || n.includes('tshirt')) return 't-shirts'
  if (n.includes('water') || n.includes('bottle') || n.includes('cooler')) return 'waterbottles'
  if (n.includes('backpack') || n.includes('bag')) return 'bags'
  return null
}

const displayProducts = computed(() => {
  const all = data.value?.result || []
  if (isNew.value || isSale.value) return all.slice(0, 4)
  if (!category.value || category.value === 'all') return all
  if (category.value === 'merch') return []
  return all.filter(p => categorizeProduct(p.name) === category.value).slice(0, 4)
})

const handleAddToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    variantId: product.id,
    name: product.name,
    price: 29.99,
    image: product.thumbnail_url,
  })
}

useHead({ title: `${pageTitle.value} - Fortress Designs` })
</script>
