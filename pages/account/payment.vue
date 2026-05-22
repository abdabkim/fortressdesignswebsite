<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNavbar />

    <main class="flex-1 py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <NuxtLink to="/account">
          <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft class="h-4 w-4" /> Back to Dashboard
          </button>
        </NuxtLink>

        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p class="text-gray-500 mt-1">Manage how you pay for your Fortress Designs orders.</p>
        </div>

        <!-- Polar.sh Demo Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            <Zap class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-white font-semibold mb-0.5">Powered by Polar.sh</p>
            <p class="text-blue-100 text-sm leading-relaxed">Secure, fast, and modern payments. Full Polar.sh integration coming soon — payment keys pending setup.</p>
            <span class="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
              <Clock class="h-3 w-3" /> Demo Mode Active
            </span>
          </div>
        </div>

        <!-- Saved Cards -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <CreditCard class="h-5 w-5 text-primary" />
              <h2 class="text-lg font-semibold text-gray-900">Saved Cards</h2>
            </div>
            <button
              @click="showAddCard = !showAddCard"
              class="flex items-center gap-2 text-sm font-medium text-primary hover:text-purple-700 border border-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus class="h-4 w-4" /> Add Card
            </button>
          </div>

          <!-- Demo Cards -->
          <div class="p-6 space-y-4">
            <div
              v-for="card in demoCards"
              :key="card.id"
              class="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer"
              :class="selectedCard === card.id ? 'border-primary bg-purple-50 ring-1 ring-primary' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'"
              @click="selectedCard = card.id"
            >
              <div class="flex items-center gap-4">
                <!-- Card brand icon -->
                <div class="w-12 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  :class="card.brand === 'Visa' ? 'bg-blue-600' : card.brand === 'Mastercard' ? 'bg-red-500' : 'bg-gray-800'">
                  {{ card.brand === 'Amex' ? 'AMEX' : card.brand.toUpperCase() }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ card.brand }} ending in {{ card.last4 }}</p>
                  <p class="text-xs text-gray-500">Expires {{ card.expiry }} · {{ card.holder }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span v-if="card.isDefault" class="text-xs font-medium text-primary bg-purple-100 px-2 py-0.5 rounded-full">Default</span>
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  :class="selectedCard === card.id ? 'border-primary bg-primary' : 'border-gray-300'"
                >
                  <div v-if="selectedCard === card.id" class="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            </div>

            <!-- Add Card Form (demo) -->
            <div v-if="showAddCard" class="border border-dashed border-gray-300 rounded-xl p-5 space-y-4">
              <p class="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock class="h-4 w-4 text-green-500" /> Secure Card Entry
                <span class="ml-auto text-xs text-gray-400 font-normal flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Demo Mode
                </span>
              </p>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Cardholder Name</label>
                <input v-model="newCard.holder" type="text" placeholder="John Doe" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
                <div class="relative">
                  <input v-model="newCard.number" type="text" placeholder="4242 4242 4242 4242" maxlength="19" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm pr-12" @input="formatCardNumber" />
                  <CreditCard class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Expiry (MM/YY)</label>
                  <input v-model="newCard.expiry" type="text" placeholder="12/27" maxlength="5" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">CVC</label>
                  <input v-model="newCard.cvc" type="password" placeholder="•••" maxlength="4" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>
              </div>
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
                <span>This is a demo — no real card data is stored or transmitted. Full Polar.sh payment processing will be enabled once API keys are configured.</span>
              </div>
              <div class="flex gap-3">
                <button @click="showAddCard = false" class="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button @click="addDemoCard" class="flex-1 bg-primary hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Plus class="h-4 w-4" /> Save Card
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Polar.sh Wallet (demo) -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div class="p-6 border-b border-gray-100 flex items-center gap-3">
            <Wallet class="h-5 w-5 text-primary" />
            <h2 class="text-lg font-semibold text-gray-900">Digital Wallets</h2>
          </div>
          <div class="p-6 space-y-3">
            <div v-for="wallet in wallets" :key="wallet.id"
              class="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="wallet.color">
                  <component :is="wallet.icon" class="h-5 w-5" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ wallet.name }}</p>
                  <p class="text-xs text-gray-500">{{ wallet.description }}</p>
                </div>
              </div>
              <span class="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>

        <!-- Billing Info -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div class="p-6 border-b border-gray-100 flex items-center gap-3">
            <Receipt class="h-5 w-5 text-primary" />
            <h2 class="text-lg font-semibold text-gray-900">Billing Address</h2>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-500 mb-4">Your billing address will be used for payment verification.</p>
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 flex items-start gap-3">
              <MapPin class="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p class="font-medium text-gray-900 mb-0.5">Same as delivery address</p>
                <p class="text-xs text-gray-500">Update your addresses in the <NuxtLink to="/account/addresses" class="text-primary hover:underline">Address Book</NuxtLink>.</p>
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
import { ref, reactive } from 'vue'
import {
  ArrowLeft, CreditCard, Plus, Lock, AlertCircle, Wallet, Zap, Clock,
  MapPin, Receipt, CheckCircle, Smartphone, Globe
} from '@lucide/vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Payment Methods - Fortress Designs' })

const showAddCard = ref(false)
const selectedCard = ref('card-1')
const toastMsg = ref('')

const newCard = reactive({ holder: '', number: '', expiry: '', cvc: '' })

const demoCards = ref([
  { id: 'card-1', brand: 'Visa', last4: '4242', expiry: '12/27', holder: 'Demo User', isDefault: true },
  { id: 'card-2', brand: 'Mastercard', last4: '5555', expiry: '06/26', holder: 'Demo User', isDefault: false },
])

const wallets = [
  { id: 'apple', name: 'Apple Pay', description: 'Pay with Touch ID or Face ID', icon: Smartphone, color: 'bg-gray-900 text-white' },
  { id: 'google', name: 'Google Pay', description: 'Fast checkout with your Google account', icon: Globe, color: 'bg-blue-500 text-white' },
]

function formatCardNumber(e) {
  let val = e.target.value.replace(/\D/g, '').substring(0, 16)
  newCard.number = val.replace(/(.{4})/g, '$1 ').trim()
}

function addDemoCard() {
  if (!newCard.holder || !newCard.number || !newCard.expiry) {
    showToast('Please fill in all required fields')
    return
  }
  const last4 = newCard.number.replace(/\s/g, '').slice(-4)
  const numberRaw = newCard.number.replace(/\s/g, '')
  const brand = numberRaw.startsWith('4') ? 'Visa' : numberRaw.startsWith('5') ? 'Mastercard' : 'Amex'
  demoCards.value.push({
    id: `card-${Date.now()}`,
    brand,
    last4,
    expiry: newCard.expiry,
    holder: newCard.holder,
    isDefault: false,
  })
  Object.assign(newCard, { holder: '', number: '', expiry: '', cvc: '' })
  showAddCard.value = false
  showToast('Card saved! (Demo mode — not stored)')
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => (toastMsg.value = ''), 3000)
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
</style>
