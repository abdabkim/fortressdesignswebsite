<template>
  <div style="min-height:100vh;background:#faf9ff;">
    <AppNavbar />

    <section style="background:linear-gradient(135deg,#D946EF 0%,#ef4444 100%);padding:72px 20px;text-align:center;">
      <div style="max-width:700px;margin:0 auto;">
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);border-radius:9999px;padding:6px 16px;font-size:0.8rem;color:#fff;font-weight:600;margin-bottom:18px;letter-spacing:0.04em;">
          🔥 LIMITED TIME
        </div>
        <h1 style="font-size:clamp(2rem,5vw,3rem);font-weight:800;color:#fff;margin:0 0 14px;">Sales & Deals</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:1rem;margin:0;line-height:1.7;">Big savings on Fortress Designs favourites. Don't sleep on these.</p>
      </div>
    </section>

    <section style="max-width:1200px;margin:0 auto;padding:60px 20px;">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px;">
        <div v-if="loading" v-for="i in 4" :key="i"
          style="background:#fff;border:1.5px solid #ede5ff;border-radius:20px;height:340px;">
        </div>
        <div v-else-if="products.length === 0" style="grid-column:1/-1;text-align:center;padding:60px;color:#888;">
          Check back soon for sales!
        </div>
        <NuxtLink v-else v-for="product in products" :key="product.id" :to="`/shop`"
          style="background:#fff;border:1.5px solid #ede5ff;border-radius:20px;overflow:hidden;text-decoration:none;box-shadow:0 2px 12px rgba(108,43,217,0.06);transition:transform 0.2s,box-shadow 0.2s;position:relative;"
          @mouseenter="e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(108,43,217,0.14)'; }"
          @mouseleave="e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(108,43,217,0.06)'; }">
          <div style="position:absolute;top:12px;left:12px;background:#ef4444;color:#fff;font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:9999px;letter-spacing:0.05em;">SALE</div>
          <div style="aspect-ratio:1;background:#fff5f5;overflow:hidden;">
            <img :src="product.thumbnail_url" :alt="product.name" style="width:100%;height:100%;object-fit:cover;" @error="e => e.target.style.display='none'" />
          </div>
          <div style="padding:16px;">
            <div style="font-size:0.95rem;font-weight:700;color:#111;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ product.name }}</div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:0.9rem;color:#ef4444;font-weight:700;">Shop Now →</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
definePageMeta({ layout: false })
useHead({ title: 'Sales - Fortress Designs' })

const products = ref([])
const loading  = ref(true)

onMounted(async () => {
  try {
    const res  = await fetch('/api/catalog')
    const data = await res.json()
    products.value = data.result || []
  } catch (e) {
    products.value = []
  } finally {
    loading.value = false
  }
})
</script>
