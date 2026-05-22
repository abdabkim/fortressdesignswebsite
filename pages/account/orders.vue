<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNavbar />

    <main class="flex-1 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <NuxtLink to="/account">
            <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors">
              <ArrowLeft class="h-4 w-4" /> Back to Dashboard
            </button>
          </NuxtLink>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Order History</h1>
              <p class="text-gray-500 mt-1">View and track all your Printful orders</p>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <Package class="h-4 w-4" />
              <span v-if="!pending">{{ filteredOrders.length }} of {{ allOrders.length }} orders</span>
              <span v-else>Loading orders…</span>
            </div>
          </div>
        </div>

        <!-- Search + Filter bar -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div class="p-4">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="relative flex-1">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  v-model="searchQuery"
                  placeholder="Search by order ID or item name…"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div class="flex gap-2 overflow-x-auto">
                <button
                  v-for="filter in filterOptions" :key="filter.value"
                  @click="selectedFilter = filter.value"
                  :class="['px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap font-medium', selectedFilter === filter.value ? 'bg-primary text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50']"
                >
                  {{ filter.label }}
                  <span v-if="filter.count !== null" class="ml-1.5 text-xs opacity-70">({{ filter.count }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="pending" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-gray-200" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-1/3 bg-gray-200 rounded" />
                <div class="h-3 w-1/4 bg-gray-200 rounded" />
              </div>
              <div class="w-20 h-6 bg-gray-200 rounded-full" />
            </div>
            <div class="flex gap-3">
              <div class="w-20 h-20 rounded-lg bg-gray-200" />
              <div class="w-20 h-20 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>

        <!-- API Error -->
        <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-red-100 p-12 text-center">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle class="h-8 w-8 text-red-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Could not load orders</h3>
          <p class="text-gray-500 text-sm mb-1">{{ error.message }}</p>
          <p class="text-gray-400 text-xs mb-6">Make sure your Printful API token is set correctly in your .env file.</p>
          <button @click="refresh()" class="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm">
            <RotateCcw class="h-4 w-4" /> Retry
          </button>
        </div>

        <!-- Empty (no orders at all) -->
        <div v-else-if="allOrders.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p class="text-gray-500 mb-4">Your Printful order history will appear here once you make your first purchase.</p>
          <NuxtLink to="/shop">
            <button class="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors">Start Shopping</button>
          </NuxtLink>
        </div>

        <!-- No results from filter/search -->
        <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search class="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No orders match your search</h3>
          <p class="text-gray-500 mb-4">Try a different search term or filter.</p>
          <button @click="resetFilters" class="text-primary hover:underline text-sm font-medium">Clear filters</button>
        </div>

        <!-- Orders list -->
        <div v-else class="space-y-4">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <!-- Order header -->
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                    <Package class="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Order #{{ order.id }}</h3>
                    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-0.5">
                      <span class="flex items-center gap-1">
                        <Calendar class="h-3.5 w-3.5" />
                        {{ formatDate(order.created) }}
                      </span>
                      <span v-if="order.retail_costs?.total" class="flex items-center gap-1">
                        <DollarSign class="h-3.5 w-3.5" />
                        ${{ order.retail_costs.total }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Package class="h-3.5 w-3.5" />
                        {{ order.items?.length || 0 }} {{ order.items?.length === 1 ? 'item' : 'items' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span :class="`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`">
                    {{ formatStatus(order.status) }}
                  </span>
                </div>
              </div>

              <!-- Shipping info if available -->
              <div v-if="order.shipping" class="mb-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                <Truck class="h-3.5 w-3.5 text-gray-400" />
                <span>{{ order.shipping }} shipping</span>
                <span v-if="order.ship_date" class="ml-auto">Expected: {{ formatDate(order.ship_date, true) }}</span>
              </div>

              <!-- Order items -->
              <div v-if="order.items?.length" class="flex flex-wrap gap-3 mb-5">
                <div
                  v-for="(item, i) in order.items"
                  :key="i"
                  class="flex items-center gap-3 bg-gray-50 rounded-xl p-2 pr-4 border border-gray-100"
                >
                  <img
                    :src="item.files?.find(f => f.type === 'preview')?.thumbnail_url || item.preview_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop'"
                    :alt="item.name"
                    class="w-14 h-14 rounded-lg object-cover bg-gray-200"
                  />
                  <div>
                    <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                    <p v-if="item.retail_price" class="text-xs font-semibold text-primary">${{ item.retail_price }}</p>
                  </div>
                </div>
              </div>

              <!-- Recipient -->
              <div v-if="order.recipient" class="mb-4 text-xs text-gray-500 flex items-start gap-2">
                <MapPin class="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span>
                  {{ order.recipient.name }} ·
                  {{ order.recipient.address1 }}, {{ order.recipient.city }}, {{ order.recipient.state_code }} {{ order.recipient.zip }}, {{ order.recipient.country_code }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                <a
                  v-if="order.dashboard_url"
                  :href="order.dashboard_url"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink class="h-4 w-4" /> View in Printful
                </a>
                <button class="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <RotateCcw class="h-4 w-4" /> Reorder
                </button>
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
import { ref, computed } from 'vue'
import {
  Package, ArrowLeft, Search, RotateCcw, Calendar, DollarSign,
  AlertCircle, Truck, MapPin, ExternalLink
} from '@lucide/vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Order History - Fortress Designs' })

// ── Fetch real Printful orders ───────────────────────────
const { data, pending, error, refresh } = await useFetch('/api/orders')

const allOrders = computed(() => data.value?.result || [])

// ── Filters ──────────────────────────────────────────────
const searchQuery = ref('')
const selectedFilter = ref('all')

const statusGroups = {
  all: null,
  active: ['inprocess', 'fulfillment', 'partial', 'pending', 'onhold'],
  fulfilled: ['fulfilled'],
  draft: ['draft'],
  canceled: ['canceled'],
}

const filterOptions = computed(() => [
  { value: 'all', label: 'All Orders', count: allOrders.value.length },
  { value: 'active', label: 'Active', count: allOrders.value.filter(o => statusGroups.active.includes(o.status)).length },
  { value: 'fulfilled', label: 'Fulfilled', count: allOrders.value.filter(o => o.status === 'fulfilled').length },
  { value: 'draft', label: 'Draft', count: allOrders.value.filter(o => o.status === 'draft').length },
  { value: 'canceled', label: 'Cancelled', count: allOrders.value.filter(o => o.status === 'canceled').length },
])

const filteredOrders = computed(() => {
  let list = allOrders.value

  // Status filter
  const statuses = statusGroups[selectedFilter.value]
  if (statuses) list = list.filter(o => statuses.includes(o.status))

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(o =>
      String(o.id).includes(q) ||
      o.items?.some(i => i.name?.toLowerCase().includes(q))
    )
  }

  return list
})

function resetFilters() {
  searchQuery.value = ''
  selectedFilter.value = 'all'
}

// ── Helpers ───────────────────────────────────────────────
function formatDate(ts, short = false) {
  if (!ts) return '—'
  const d = new Date(ts * 1000)
  return short
    ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatStatus(status) {
  const map = {
    draft: 'Draft', pending: 'Pending', onhold: 'On Hold',
    inprocess: 'In Process', partial: 'Partial', fulfillment: 'Fulfillment',
    fulfilled: 'Fulfilled', canceled: 'Cancelled', archived: 'Archived',
  }
  return map[status] || status
}

function getStatusColor(status) {
  if (status === 'fulfilled') return 'bg-green-100 text-green-700'
  if (['inprocess', 'fulfillment', 'partial'].includes(status)) return 'bg-blue-100 text-blue-700'
  if (['pending', 'onhold'].includes(status)) return 'bg-yellow-100 text-yellow-700'
  if (status === 'draft') return 'bg-gray-100 text-gray-600'
  if (status === 'canceled') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}
</script>
