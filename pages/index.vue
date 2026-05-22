<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppNavbar />

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Bold Designs<br />For the<br />
              <span class="text-primary">Fearless</span>
            </h1>
            <p class="text-gray-600 text-lg max-w-md">
              Premium streetwear that makes a statement. Express your unique style with our curated collection of bold, vibrant designs.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/shop">
                <button class="bg-primary hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors">Shop Now</button>
              </NuxtLink>
              <NuxtLink to="/about">
                <button class="px-8 py-4 rounded-full text-lg font-medium border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">Learn More</button>
              </NuxtLink>
            </div>
            <div class="flex items-center gap-6 pt-4">
              <div class="flex -space-x-3">
                <img v-for="(src, i) in customerAvatars" :key="i" :src="src" alt="Customer" class="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">5,000+ Happy Customers</p>
                <div class="flex items-center gap-1">
                  <Star v-for="i in 5" :key="i" class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span class="text-sm text-gray-500 ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src="/hero.jpg" alt="Fortress Designs Collection" class="w-full h-auto" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div class="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full gradient-bg-accent flex items-center justify-center">
                <Star class="h-5 w-5 text-white" />
              </div>
              <span class="font-semibold text-gray-900">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" class="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
            <div class="inline-flex p-4 rounded-full bg-purple-100 mb-4">
              <component :is="feature.icon" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="font-semibold text-lg text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-500 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Exclusive Products</h2>
          <p class="text-gray-500 max-w-lg mx-auto">Discover our curated collection of premium streetwear designed for those who dare to stand out.</p>
        </div>

        <!-- Category filter -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            v-for="cat in categories" :key="cat.value"
            @click="activeCategory = cat.value"
            :class="['px-6 py-2 rounded-full text-sm font-medium transition-all', activeCategory === cat.value ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200']"
          >{{ cat.name }}</button>
        </div>

        <!-- Loading -->
        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="overflow-hidden border-0 shadow-lg rounded-2xl bg-white">
            <div class="aspect-[4/5] w-full bg-gray-200 animate-pulse"></div>
            <div class="p-4"><div class="h-4 w-3/4 bg-gray-200 animate-pulse mb-2 rounded"></div><div class="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div></div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-gray-500 mb-4">Unable to load products</p>
          <button @click="refresh()" class="bg-primary text-white px-6 py-2 rounded-lg">Retry</button>
        </div>

        <!-- Products grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="product in filteredProducts" :key="product.id" class="group overflow-hidden border-0 shadow-lg rounded-2xl bg-white hover:-translate-y-2 transition-transform duration-300">
            <div class="relative aspect-[4/5] overflow-hidden">
              <img :src="product.thumbnail_url" :alt="product.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg text-sm font-medium text-gray-900 shadow-sm">
                {{ getCategoryLabel(product.name) }}
              </div>
              <button @click="wishlistStore.toggleItem(product)" :class="['absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors', wishlistStore.isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-primary hover:text-white']">
                <Heart class="h-5 w-5" :fill="wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'" />
              </button>
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="flex gap-2">
                  <button @click="handleAddToCart(product)" class="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    <ShoppingCart class="h-4 w-4" /> Add to Cart
                  </button>
                  <NuxtLink :to="`/shop`">
                    <button class="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"><Eye class="h-4 w-4" /></button>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ product.name }}</h3>
              <p class="text-lg font-bold text-primary">${{ (29.99).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div v-if="!pending && !error && filteredProducts.length === 0" class="text-center py-12">
          <p class="text-gray-500 mb-4">No products in this category yet</p>
          <button @click="activeCategory = 'everything'" class="bg-primary text-white px-6 py-2 rounded-lg">View All Products</button>
        </div>

        <div class="text-center mt-12">
          <NuxtLink :to="activeCategory === 'everything' ? '/shop' : `/shop?category=${activeCategory}`">
            <button class="bg-primary hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-medium flex items-center gap-2 mx-auto transition-colors">
              View All {{ activeCategory === 'everything' ? 'Products' : categories.find(c => c.value === activeCategory)?.name || 'Products' }}
              <ArrowRight class="h-5 w-5" />
            </button>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=500&fit=crop" alt="Customer Support" class="w-full h-full object-cover" />
            </div>
            <div class="rounded-2xl overflow-hidden mt-8 hover:scale-105 transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop" alt="Customer Service" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="space-y-6">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">We Provide Best Customer Experience</h2>
            <p class="text-gray-500 leading-relaxed">At Fortress Designs, we ensure that our customers have the best shopping experience. Our team is dedicated to providing top-notch service and quality products.</p>
            <div class="space-y-4">
              <div v-for="(item, i) in checkItems" :key="i" class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <component :is="item.icon" class="h-6 w-6 text-primary" />
                </div>
                <p class="text-gray-700 font-medium">{{ item.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Join the Fortress Community</h2>
        <p class="text-gray-400 max-w-lg mx-auto mb-8">Subscribe to our newsletter and get 10% off your first order plus exclusive access to our new arrivals.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input type="email" v-model="email" placeholder="Enter your email" class="flex-1 px-6 py-4 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary" />
          <button class="bg-primary hover:bg-purple-700 text-white px-8 py-4 rounded-full font-medium transition-colors">Subscribe</button>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Star, Heart, CheckCircle, Award, ArrowRight, Sparkles, Zap, Shield, ShoppingCart, Eye } from '@lucide/vue'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

onMounted(() => {
  wishlistStore.load()
})

const activeCategory = ref('everything')
const email = ref('')

const customerAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
]

const features = [
  { icon: Shield, title: 'Quality Product', description: 'Premium materials and craftsmanship in every piece.' },
  { icon: Zap, title: 'Best Production', description: 'State-of-the-art printing technology for vibrant designs.' },
  { icon: Sparkles, title: '100% Authentic', description: "Original designs you won't find anywhere else." },
]

const categories = [
  { name: 'Everything', value: 'everything' },
  { name: 'T-Shirts', value: 't-shirts' },
  { name: 'Hoodies', value: 'hoodies' },
  { name: 'Sweatshirts', value: 'sweatshirts' },
  { name: 'Water Bottles', value: 'waterbottles' },
  { name: 'Bags', value: 'bags' },
]

const checkItems = [
  { icon: CheckCircle, label: 'Original Products' },
  { icon: Award, label: 'Satisfaction Guarantee' },
  { icon: Star, label: 'New Arrivals Everyday' },
]

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

const categoryLabelMap = { 't-shirts': 'T-Shirts', hoodies: 'Hoodies', sweatshirts: 'Sweatshirts', waterbottles: 'Water Bottles', bags: 'Bags' }
function getCategoryLabel(name) { return categoryLabelMap[categorizeProduct(name)] || 'Fortress Designs' }

const filteredProducts = computed(() => {
  const all = data.value?.result || []
  if (activeCategory.value === 'everything') return all.slice(0, 4)
  return all.filter(p => categorizeProduct(p.name) === activeCategory.value).slice(0, 4)
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

useHead({ title: 'Fortress Designs - Bold Streetwear', meta: [{ name: 'description', content: 'Premium streetwear for the bold and fearless.' }] })
</script>
