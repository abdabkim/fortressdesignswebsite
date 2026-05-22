<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNavbar />

    <main class="flex-1 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-4">
              <!-- Avatar -->
              <div class="relative">
                <div v-if="authStore.user?.photoURL" class="w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary ring-offset-2">
                  <img :src="authStore.user.photoURL" :alt="authStore.user.displayName || 'User'" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center ring-4 ring-primary ring-offset-2">
                  <span class="text-2xl font-bold text-white">{{ userInitial }}</span>
                </div>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">
                  Welcome back, {{ authStore.user?.displayName?.split(' ')[0] || 'there' }}!
                </h1>
                <p class="text-gray-500 mt-1">{{ authStore.user?.email }}</p>
                <p v-if="accountAge" class="text-xs text-gray-400 mt-0.5">Member since {{ accountAge }}</p>
              </div>
            </div>
            <NuxtLink to="/shop">
              <button class="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <ShoppingBag class="h-4 w-4" /> Continue Shopping
              </button>
            </NuxtLink>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:-translate-y-1 transition-transform duration-200">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-primary">
                <ShoppingBag class="h-6 w-6" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ ordersData?.result?.length ?? '—' }}</p>
                <p class="text-sm text-gray-500">Total Orders</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:-translate-y-1 transition-transform duration-200">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                <Truck class="h-6 w-6" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ inTransitCount }}</p>
                <p class="text-sm text-gray-500">In Transit</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:-translate-y-1 transition-transform duration-200">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
                <CheckCircle class="h-6 w-6" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ deliveredCount }}</p>
                <p class="text-sm text-gray-500">Delivered</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:-translate-y-1 transition-transform duration-200">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100 text-yellow-600">
                <Clock class="h-6 w-6" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ processingCount }}</p>
                <p class="text-sm text-gray-500">Processing</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Recent Orders -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100">
              <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 class="text-xl font-semibold">Recent Orders</h2>
                <NuxtLink to="/account/orders">
                  <button class="text-primary hover:text-purple-700 text-sm font-medium flex items-center gap-1 transition-colors">
                    View All <ArrowRight class="h-4 w-4" />
                  </button>
                </NuxtLink>
              </div>
              <div class="p-6">
                <!-- Loading -->
                <div v-if="ordersPending" class="space-y-4">
                  <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
                </div>
                <!-- Error -->
                <div v-else-if="ordersError" class="text-center py-8">
                  <p class="text-gray-500 text-sm">Could not load orders from Printful.</p>
                  <p class="text-xs text-gray-400 mt-1">{{ ordersError.message }}</p>
                </div>
                <!-- No orders -->
                <div v-else-if="!recentOrders.length" class="text-center py-8">
                  <Package class="h-12 w-12 text-gray-200 mx-auto mb-3" />
                  <p class="text-gray-500 text-sm">No orders yet. Start shopping!</p>
                  <NuxtLink to="/shop">
                    <button class="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Browse Shop</button>
                  </NuxtLink>
                </div>
                <!-- Orders list -->
                <div v-else class="space-y-4">
                  <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Package class="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">#{{ order.id }}</p>
                        <p class="text-sm text-gray-500">{{ formatDate(order.created) }} • {{ order.items?.length || 0 }} items</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900">${{ order.retail_costs?.total || '—' }}</p>
                      <span :class="`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`">
                        {{ formatStatus(order.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Access + Profile Summary -->
          <div class="space-y-6">
            <!-- Profile card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-base font-semibold">My Profile</h2>
                <NuxtLink to="/account/profile" class="text-xs text-primary hover:underline font-medium">Edit</NuxtLink>
              </div>
              <div class="space-y-3 text-sm">
                <div class="flex items-center gap-3 text-gray-600">
                  <User class="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{{ authStore.user?.displayName || 'No name set' }}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <Mail class="h-4 w-4 text-gray-400 shrink-0" />
                  <span class="truncate">{{ authStore.user?.email }}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <Shield class="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{{ authStore.user?.emailVerified ? 'Email Verified ✓' : 'Email Not Verified' }}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <LogIn class="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{{ authProviderLabel }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Access -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100">
              <div class="p-6 border-b border-gray-100">
                <h2 class="text-base font-semibold">Quick Access</h2>
              </div>
              <div class="p-4 space-y-1">
                <NuxtLink v-for="(item, index) in menuItems" :key="index" :to="item.href" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div class="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <component :is="item.icon" class="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 text-sm">{{ item.label }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ item.description }}</p>
                  </div>
                  <ArrowRight class="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ShoppingBag, Heart, Truck, Package, ArrowRight, User, MapPin, CreditCard, Mail, Shield, LogIn, Clock, CheckCircle } from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Dashboard - Fortress Designs' })

const authStore = useAuthStore()

// Real orders from Printful API
const { data: ordersData, pending: ordersPending, error: ordersError } = await useFetch('/api/orders')

const recentOrders = computed(() => {
  const result = ordersData.value?.result || []
  return result.slice(0, 5)
})

const inTransitCount = computed(() => {
  const orders = ordersData.value?.result || []
  return orders.filter(o => ['inprocess', 'fulfillment', 'partial'].includes(o.status)).length
})

const deliveredCount = computed(() => {
  const orders = ordersData.value?.result || []
  return orders.filter(o => o.status === 'fulfilled').length
})

const processingCount = computed(() => {
  const orders = ordersData.value?.result || []
  return orders.filter(o => ['draft', 'pending', 'onhold'].includes(o.status)).length
})

// User info
const userInitial = computed(() => {
  const name = authStore.user?.displayName || authStore.user?.email || '?'
  return name.charAt(0).toUpperCase()
})

const accountAge = computed(() => {
  const created = authStore.user?.metadata?.creationTime
  if (!created) return null
  return new Date(created).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const authProviderLabel = computed(() => {
  const providers = authStore.user?.providerData?.map(p => p.providerId) || []
  if (providers.includes('google.com')) return 'Signed in via Google'
  if (providers.includes('password')) return 'Email & Password'
  return 'Unknown provider'
})

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatStatus(status) {
  const map = {
    draft: 'Draft',
    pending: 'Pending',
    onhold: 'On Hold',
    inprocess: 'In Process',
    partial: 'Partial',
    fulfillment: 'Fulfillment',
    fulfilled: 'Delivered',
    canceled: 'Cancelled',
    archived: 'Archived',
  }
  return map[status] || status
}

function getStatusColor(status) {
  if (status === 'fulfilled') return 'bg-green-100 text-green-700'
  if (['inprocess', 'fulfillment', 'partial'].includes(status)) return 'bg-blue-100 text-blue-700'
  if (['pending', 'draft'].includes(status)) return 'bg-yellow-100 text-yellow-700'
  if (status === 'canceled') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}

const menuItems = [
  { icon: User, label: 'Profile Settings', description: 'Update your personal information', href: '/account/profile' },
  { icon: Package, label: 'Order History', description: 'View and track your orders', href: '/account/orders' },
  { icon: Heart, label: 'Wishlist', description: "Items you've saved for later", href: '/account/wishlist' },
  { icon: MapPin, label: 'Address Book', description: 'Manage your delivery addresses', href: '/account/addresses' },
  { icon: CreditCard, label: 'Payment Methods', description: 'Manage your payment options', href: '/account/payment' },
]
</script>
