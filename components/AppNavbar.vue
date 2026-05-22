<template>
  <!-- Navbar wrapper: white card with shadow, full width, sticky -->
  <header class="sticky top-0 z-50 w-full bg-white" style="box-shadow: 0 1px 12px 0 rgba(108,43,217,0.07); border-bottom: 1px solid #f0edfb;">
    <div style="max-width:1200px; margin:0 auto; padding:0 20px; height:72px; display:flex; align-items:center; justify-content:space-between; gap:12px;">

      <!-- ── LEFT: Logo ─────────────────────────────────────── -->
      <NuxtLink to="/" style="display:flex;align-items:center;gap:12px;text-decoration:none;flex-shrink:0;">
        <div style="width:48px;height:48px;border-radius:50%;background:#f5f0ff;border:1.5px solid #ede5ff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
          <img src="/favicon.png" alt="Fortress Designs" style="width:36px;height:36px;object-fit:contain;" @error="e => e.target.style.display='none'" />
        </div>
        <span style="font-size:1.1rem;font-weight:700;color:#111;letter-spacing:-0.02em;white-space:nowrap;" class="logo-text">Fortress Designs</span>
      </NuxtLink>

      <!-- ── CENTER: Pill nav (desktop) ────────────────────── -->
      <nav class="pill-nav" style="display:flex;align-items:center;gap:2px;background:#fff;border:1.5px solid #ede5ff;border-radius:9999px;padding:6px 8px;box-shadow:0 2px 16px 0 rgba(108,43,217,0.08);flex-shrink:0;">

        <template v-for="link in navLinks" :key="link.id">

          <!-- Products link with dropdown -->
          <div v-if="link.id === 'products'"
            style="position:relative;"
            @mouseenter="productsOpen = true"
            @mouseleave="productsOpen = false"
          >
            <NuxtLink
              :to="link.to"
              class="nav-link"
              :style="activeLink === link.id ? 'color:#6C2BD9;position:relative;' : 'color:#666;position:relative;'"
              style="padding:7px 16px;font-size:0.875rem;font-weight:500;border-radius:9999px;text-decoration:none;display:flex;align-items:center;gap:4px;white-space:nowrap;"
              @click="setActive(link)"
            >
              {{ link.label }}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              <span v-if="activeLink === link.id" style="position:absolute;bottom:4px;left:50%;transform:translateX(-50%);height:2px;background:#6C2BD9;border-radius:9999px;width:calc(100% - 28px);"/>
            </NuxtLink>

            <!-- Dropdown panel wrapper (adds invisible hover bridge) -->
            <div v-if="productsOpen"
              style="position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;z-index:200;">
              <!-- Actual Dropdown Box -->
              <div style="background:#fff;border:1.5px solid #ede5ff;border-radius:16px;padding:8px;min-width:180px;box-shadow:0 8px 32px rgba(108,43,217,0.14);position:relative;">
                <!-- Arrow -->
                <div style="position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:10px;height:10px;background:#fff;border-left:1.5px solid #ede5ff;border-top:1.5px solid #ede5ff;rotate:45deg;"/>

                <NuxtLink
                  v-for="cat in categories"
                  :key="cat.value"
                  :to="cat.to"
                  style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;font-size:0.85rem;font-weight:500;color:#444;text-decoration:none;transition:background 0.12s,color 0.12s;"
                  @mouseenter="e => { e.currentTarget.style.background='#f5f0ff'; e.currentTarget.style.color='#6C2BD9'; }"
                  @mouseleave="e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#444'; }"
                  @click="productsOpen = false; setActive(link)"
                >
                  <span style="font-size:1rem;">{{ cat.icon }}</span>
                  {{ cat.label }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- All other links (no dropdown) -->
          <NuxtLink
            v-else
            :to="link.to"
            class="nav-link"
            :style="activeLink === link.id ? 'color:#6C2BD9;position:relative;' : 'color:#666;position:relative;'"
            style="padding:7px 16px;font-size:0.875rem;font-weight:500;border-radius:9999px;text-decoration:none;transition:color 0.15s,background 0.15s;white-space:nowrap;"
            @click="setActive(link)"
            @mouseenter="e => { if(activeLink !== link.id) { e.currentTarget.style.color='#6C2BD9'; e.currentTarget.style.background='#f5f0ff'; } }"
            @mouseleave="e => { if(activeLink !== link.id) { e.currentTarget.style.color='#666'; e.currentTarget.style.background='transparent'; } }"
          >
            {{ link.label }}
            <span v-if="activeLink === link.id" style="position:absolute;bottom:4px;left:50%;transform:translateX(-50%);height:2px;background:#6C2BD9;border-radius:9999px;width:calc(100% - 28px);"/>
          </NuxtLink>

        </template>
      </nav>


      <!-- ── RIGHT: Action icons ────────────────────────────── -->
      <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">

        <!-- Cart -->
        <NuxtLink to="/cart" style="position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#f5f0ff;border:1.5px solid #ede5ff;text-decoration:none;color:#555;transition:background 0.15s;"
          @mouseenter="e => e.currentTarget.style.background='#ede5ff'"
          @mouseleave="e => e.currentTarget.style.background='#f5f0ff'">
          <ShoppingCart :size="18" />
          <span v-if="cartStore.cartCount > 0"
            style="position:absolute;top:-3px;right:-3px;min-width:17px;height:17px;padding:0 3px;background:#6C2BD9;color:#fff;font-size:9px;font-weight:700;border-radius:9999px;display:flex;align-items:center;justify-content:center;line-height:1;">
            {{ cartStore.cartCount > 9 ? '9+' : cartStore.cartCount }}
          </span>
        </NuxtLink>

        <!-- User button + dropdown -->
        <div style="position:relative;" ref="userMenuRef">
          <button
            @click="userOpen = !userOpen"
            style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#f5f0ff;border:1.5px solid #ede5ff;cursor:pointer;color:#555;transition:background 0.15s;"
            @mouseenter="e => e.currentTarget.style.background='#ede5ff'"
            @mouseleave="e => e.currentTarget.style.background='#f5f0ff'"
            aria-label="Account"
          >
            <User :size="18" />
          </button>

          <!-- Dropdown panel -->
          <div v-if="userOpen"
            style="position:absolute;top:calc(100% + 10px);right:0;width:220px;background:#fff;border:1.5px solid #ede5ff;border-radius:16px;padding:6px;z-index:200;box-shadow:0 8px 32px rgba(108,43,217,0.14);">

            <template v-if="!authStore.loading && authStore.user">
              <div style="padding:10px 12px 10px;border-bottom:1px solid #f0edfb;margin-bottom:4px;">
                <div style="font-size:0.875rem;font-weight:600;color:#111;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ authStore.user.displayName || 'My Account' }}</div>
                <div style="font-size:0.75rem;color:#888;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ authStore.user.email }}</div>
              </div>
              <NuxtLink to="/account"          class="dd-item" @click="userOpen=false"><LayoutDashboard :size="13"/> Dashboard</NuxtLink>
              <NuxtLink to="/account/profile"  class="dd-item" @click="userOpen=false"><Settings :size="13"/> Profile Settings</NuxtLink>
              <NuxtLink to="/account/orders"   class="dd-item" @click="userOpen=false"><ShoppingBag :size="13"/> Order History</NuxtLink>
              <NuxtLink to="/account/wishlist" class="dd-item" @click="userOpen=false"><Heart :size="13"/> Wishlist</NuxtLink>
              <div style="height:1px;background:#f0edfb;margin:4px 0;"/>
              <button class="dd-item dd-danger" @click="handleLogout"><LogOut :size="13"/> Sign Out</button>
            </template>

            <template v-else-if="!authStore.loading">
              <NuxtLink to="/login"  class="dd-item" @click="userOpen=false"><LogIn :size="13"/> Sign In</NuxtLink>
              <NuxtLink to="/signup" class="dd-item" @click="userOpen=false"><UserPlus :size="13"/> Create Account</NuxtLink>
            </template>

            <div v-else style="padding:12px;text-align:center;font-size:0.8rem;color:#aaa;">Loading…</div>
          </div>
        </div>

        <!-- YouTube — ONLY on /shop (Merch) pages -->
        <a
          v-if="isMerchPage"
          href="https://www.youtube.com/@daleam2934"
          target="_blank"
          rel="noopener noreferrer"
          style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#6C2BD9;color:#fff;text-decoration:none;box-shadow:0 4px 14px rgba(108,43,217,0.38);transition:background 0.15s,transform 0.15s;"
          @mouseenter="e => { e.currentTarget.style.background='#5a23b8'; e.currentTarget.style.transform='scale(1.07)'; }"
          @mouseleave="e => { e.currentTarget.style.background='#6C2BD9'; e.currentTarget.style.transform='scale(1)'; }"
          aria-label="YouTube"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z"/>
          </svg>
        </a>

        <!-- Mobile hamburger -->
        <button
          class="hamburger-btn"
          @click="mobileOpen = !mobileOpen"
          style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#f5f0ff;border:1.5px solid #ede5ff;cursor:pointer;color:#555;"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        >
          <X v-if="mobileOpen" :size="18" />
          <Menu v-else :size="18" />
        </button>
      </div>
    </div>

    <!-- ── Mobile menu ──────────────────────────────────────── -->
    <div v-if="mobileOpen" style="background:#fff;border-top:1px solid #f0edfb;padding:10px 16px 16px;" class="mobile-menu-panel">
      <NuxtLink
        v-for="link in navLinks"
        :key="'m-'+link.to"
        :to="link.to"
        :style="isActive(link) ? 'color:#6C2BD9;background:#f5f0ff;' : 'color:#555;background:transparent;'"
        style="display:block;padding:11px 16px;border-radius:12px;font-size:0.9rem;font-weight:500;text-decoration:none;margin-bottom:2px;"
        @click="mobileOpen=false"
      >{{ link.label }}</NuxtLink>

      <div style="height:1px;background:#f0edfb;margin:8px 0;"/>

      <template v-if="authStore.user">
        <NuxtLink to="/account"          style="display:block;padding:11px 16px;border-radius:12px;font-size:0.9rem;font-weight:500;color:#555;text-decoration:none;margin-bottom:2px;" @click="mobileOpen=false">My Account</NuxtLink>
        <NuxtLink to="/account/wishlist" style="display:block;padding:11px 16px;border-radius:12px;font-size:0.9rem;font-weight:500;color:#555;text-decoration:none;margin-bottom:2px;" @click="mobileOpen=false">Wishlist</NuxtLink>
        <button style="display:block;width:100%;text-align:left;padding:11px 16px;border-radius:12px;font-size:0.9rem;font-weight:500;color:#dc2626;background:transparent;border:none;cursor:pointer;" @click="handleLogout">Sign Out</button>
      </template>
      <template v-else>
        <NuxtLink to="/login"  style="display:block;padding:11px 16px;border-radius:12px;font-size:0.9rem;font-weight:500;color:#555;text-decoration:none;margin-bottom:2px;" @click="mobileOpen=false">Sign In</NuxtLink>
        <NuxtLink to="/signup" style="display:block;padding:11px 16px;border-radius:12px;font-size:0.9rem;font-weight:500;color:#6C2BD9;text-decoration:none;font-weight:600;" @click="mobileOpen=false">Create Account</NuxtLink>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ShoppingCart, ShoppingBag, User, LogIn, LogOut,
  UserPlus, Menu, X, LayoutDashboard, Settings, Heart
} from '@lucide/vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const route      = useRoute()
const cartStore  = useCartStore()
const authStore  = useAuthStore()
const { $firebaseAuth } = useNuxtApp()

const mobileOpen   = ref(false)
const userOpen     = ref(false)
const userMenuRef  = ref(null)
const productsOpen = ref(false)

const navLinks = [
  { id: 'about',    label: 'About Us', to: '/about'    },
  { id: 'products', label: 'Products', to: '/shop'     },
  { id: 'merch',    label: 'Merch',    to: '/merch'    },
  { id: 'new',      label: 'New',      to: '/new'      },
  { id: 'sales',    label: 'Sales',    to: '/sales'    },
]

const categories = [
  { label: 'All Products',  icon: '🛍️', value: 'all',         to: '/shop'                          },
  { label: 'T-Shirts',      icon: '👕', value: 't-shirts',    to: '/shop?category=t-shirts'        },
  { label: 'Hoodies',       icon: '🧥', value: 'hoodies',     to: '/shop?category=hoodies'         },
  { label: 'Sweatshirts',   icon: '👔', value: 'sweatshirts', to: '/shop?category=sweatshirts'     },
  { label: 'Water Bottles', icon: '🍶', value: 'waterbottles',to: '/shop?category=waterbottles'    },
  { label: 'Bags',          icon: '🎒', value: 'bags',        to: '/shop?category=bags'            },
]

// Track active link by click
const activeLink = ref('')

function setActive(link) {
  activeLink.value = link.id
}

// YouTube icon ONLY on the Merch page (/merch)
const isMerchPage = computed(() => route.path === '/merch')

// Set initial active based on current path
onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  const match = navLinks.find(l => route.path === l.to)
  if (match) activeLink.value = match.id
})

async function handleLogout() {
  await $firebaseAuth.logout()
  userOpen.value   = false
  mobileOpen.value = false
  navigateTo('/')
}

function onClickOutside(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    userOpen.value = false
  }
}

onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
/* Dropdown item shared style */
.dd-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.84rem;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  transition: background 0.13s, color 0.13s;
}
.dd-item:hover { background: #f5f0ff; color: #6C2BD9; }
.dd-danger     { color: #dc2626 !important; }
.dd-danger:hover { background: #fef2f2 !important; color: #b91c1c !important; }

/* Hide pill nav and show hamburger on small screens */
@media (max-width: 767px) {
  .pill-nav       { display: none !important; }
  .logo-text      { display: none; }
}
/* Hide hamburger on large screens */
@media (min-width: 768px) {
  .hamburger-btn      { display: none !important; }
  .mobile-menu-panel  { display: none !important; }
}
</style>
