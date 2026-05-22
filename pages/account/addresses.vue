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

        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Address Book</h1>
            <p class="text-gray-500 mt-1">Manage your delivery addresses for faster checkout.</p>
          </div>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 bg-primary hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
          >
            <Plus class="h-4 w-4" /> Add Address
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="addresses.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <div class="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-5">
            <MapPin class="h-10 w-10 text-primary" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No addresses saved yet</h3>
          <p class="text-gray-500 mb-6 max-w-sm mx-auto">Add a delivery address so you can checkout faster next time.</p>
          <button
            @click="openAddModal"
            class="inline-flex items-center gap-2 bg-primary hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Plus class="h-4 w-4" /> Add Your First Address
          </button>
        </div>

        <!-- Address Cards -->
        <div v-else class="space-y-4">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-200"
            :class="address.isDefault ? 'border-primary ring-1 ring-primary' : 'border-gray-100 hover:shadow-md'"
          >
            <div class="p-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-4 flex-1 min-w-0">
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    :class="address.isDefault ? 'bg-primary text-white' : 'bg-purple-100 text-primary'">
                    <Home class="h-5 w-5" />
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <p class="font-semibold text-gray-900">{{ address.label }}</p>
                      <span v-if="address.isDefault" class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-white">
                        <Star class="h-2.5 w-2.5" /> Default
                      </span>
                    </div>
                    <p class="text-gray-800 text-sm font-medium">{{ address.name }}</p>
                    <p class="text-gray-500 text-sm">{{ address.line1 }}<span v-if="address.line2">, {{ address.line2 }}</span></p>
                    <p class="text-gray-500 text-sm">{{ address.city }}, {{ address.state }} {{ address.zip }}</p>
                    <p class="text-gray-500 text-sm">{{ address.country }}</p>
                    <p v-if="address.phone" class="text-gray-400 text-xs mt-1 flex items-center gap-1">
                      <Phone class="h-3 w-3" /> {{ address.phone }}
                    </p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 shrink-0">
                  <button
                    v-if="!address.isDefault"
                    @click="setDefault(address.id)"
                    class="text-xs text-gray-500 hover:text-primary border border-gray-200 hover:border-primary px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    Set Default
                  </button>
                  <button
                    @click="openEditModal(address)"
                    class="p-2 text-gray-400 hover:text-primary hover:bg-purple-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    @click="confirmDelete(address.id)"
                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Add / Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 class="text-xl font-semibold text-gray-900">{{ isEditing ? 'Edit Address' : 'Add New Address' }}</h2>
            <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <!-- Form Error -->
            <div v-if="formError" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle class="h-4 w-4 shrink-0" /> {{ formError }}
            </div>

            <!-- Label -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address Label <span class="text-gray-400 font-normal">(e.g. Home, Office)</span></label>
              <input v-model="form.label" type="text" placeholder="Home" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
            </div>

            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name <span class="text-red-400">*</span></label>
              <input v-model="form.name" type="text" placeholder="John Doe" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
            </div>

            <!-- Address Line 1 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1 <span class="text-red-400">*</span></label>
              <input v-model="form.line1" type="text" placeholder="123 Main Street" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
            </div>

            <!-- Address Line 2 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2 <span class="text-gray-400 font-normal">(optional)</span></label>
              <input v-model="form.line2" type="text" placeholder="Apt, Suite, Unit..." class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
            </div>

            <!-- City + State -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City <span class="text-red-400">*</span></label>
                <input v-model="form.city" type="text" placeholder="New York" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">State / Province <span class="text-red-400">*</span></label>
                <input v-model="form.state" type="text" placeholder="NY" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
              </div>
            </div>

            <!-- ZIP + Country -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code <span class="text-red-400">*</span></label>
                <input v-model="form.zip" type="text" placeholder="10001" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Country <span class="text-red-400">*</span></label>
                <select v-model="form.country" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white">
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number <span class="text-gray-400 font-normal">(optional)</span></label>
              <input v-model="form.phone" type="tel" placeholder="+1 (555) 000-0000" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
            </div>

            <!-- Default toggle -->
            <label class="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div
                @click="form.isDefault = !form.isDefault"
                class="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                :class="form.isDefault ? 'bg-primary' : 'bg-gray-300'"
              >
                <div
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                  :class="form.isDefault ? 'translate-x-5' : 'translate-x-0'"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Set as default address</p>
                <p class="text-xs text-gray-500">This will be pre-selected at checkout</p>
              </div>
            </label>
          </div>

          <!-- Modal footer -->
          <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 rounded-b-2xl">
            <button @click="closeModal" class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors text-sm">
              Cancel
            </button>
            <button @click="saveAddress" class="flex-1 bg-primary hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2">
              <Save class="h-4 w-4" />
              {{ isEditing ? 'Update Address' : 'Save Address' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div v-if="deleteId" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="deleteId = null" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 class="h-7 w-7 text-red-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">Delete Address?</h3>
          <p class="text-sm text-gray-500 text-center mb-6">This address will be permanently removed from your account.</p>
          <div class="flex gap-3">
            <button @click="deleteId = null" class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm">
              Cancel
            </button>
            <button @click="deleteAddress" class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ArrowLeft, MapPin, Plus, Home, Star, Pencil, Trash2, X, Save, AlertCircle, Phone } from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Address Book - Fortress Designs' })

const authStore = useAuthStore()

// ─── State ───────────────────────────────────────────────
const addresses = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const deleteId = ref(null)
const formError = ref('')

const defaultForm = () => ({
  label: 'Home',
  name: authStore.user?.displayName || '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  phone: '',
  isDefault: addresses.value.length === 0,
})

const form = reactive(defaultForm())

// ─── Persist to localStorage keyed to user UID ───────────
const storageKey = () => `fortress_addresses_${authStore.user?.uid || 'guest'}`

onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey())
    if (saved) addresses.value = JSON.parse(saved)
  } catch {}
})

function persist() {
  localStorage.setItem(storageKey(), JSON.stringify(addresses.value))
}

// ─── Modal helpers ────────────────────────────────────────
function openAddModal() {
  isEditing.value = false
  editingId.value = null
  formError.value = ''
  Object.assign(form, defaultForm())
  showModal.value = true
}

function openEditModal(address) {
  isEditing.value = true
  editingId.value = address.id
  formError.value = ''
  Object.assign(form, { ...address })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  formError.value = ''
}

// ─── CRUD operations ──────────────────────────────────────
function validateForm() {
  if (!form.name.trim()) return 'Full name is required.'
  if (!form.line1.trim()) return 'Address line 1 is required.'
  if (!form.city.trim()) return 'City is required.'
  if (!form.state.trim()) return 'State / Province is required.'
  if (!form.zip.trim()) return 'ZIP / Postal code is required.'
  if (!form.country.trim()) return 'Country is required.'
  return null
}

function saveAddress() {
  const error = validateForm()
  if (error) { formError.value = error; return }

  if (form.isDefault) {
    addresses.value.forEach(a => (a.isDefault = false))
  }

  if (isEditing.value) {
    const idx = addresses.value.findIndex(a => a.id === editingId.value)
    if (idx !== -1) addresses.value[idx] = { ...form, id: editingId.value }
  } else {
    addresses.value.push({ ...form, id: Date.now().toString() })
  }

  // ensure at least one default
  if (!addresses.value.some(a => a.isDefault) && addresses.value.length > 0) {
    addresses.value[0].isDefault = true
  }

  persist()
  closeModal()
}

function setDefault(id) {
  addresses.value.forEach(a => (a.isDefault = a.id === id))
  persist()
}

function confirmDelete(id) {
  deleteId.value = id
}

function deleteAddress() {
  addresses.value = addresses.value.filter(a => a.id !== deleteId.value)
  // Re-assign default if needed
  if (addresses.value.length > 0 && !addresses.value.some(a => a.isDefault)) {
    addresses.value[0].isDefault = true
  }
  persist()
  deleteId.value = null
}
</script>
