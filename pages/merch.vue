<template>
  <div style="min-height:100vh;background:#faf9ff;">
    <AppNavbar />

    <section style="background:linear-gradient(135deg,#6C2BD9 0%,#D946EF 100%);padding:80px 20px;text-align:center;">
      <div style="max-width:700px;margin:0 auto;">
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:9999px;padding:6px 16px;font-size:0.8rem;color:#fff;font-weight:600;margin-bottom:20px;letter-spacing:0.04em;">
          👕 FORTRESS MERCH
        </div>
        <h1 style="font-size:clamp(2rem,5vw,3.2rem);font-weight:800;color:#fff;margin:0 0 16px;line-height:1.15;">Rep the Brand</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:1.05rem;margin:0 auto;max-width:500px;line-height:1.7;">
          Official Fortress Designs merch. Wear what you believe in.
        </p>
        <div style="margin-top:28px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
          <NuxtLink to="/shop" style="display:inline-flex;align-items:center;gap:8px;background:#fff;color:#6C2BD9;padding:12px 28px;border-radius:9999px;font-weight:700;font-size:0.95rem;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,0.15);">
            🛒 Shop Now
          </NuxtLink>
          <a href="https://www.youtube.com/@daleam2934" target="_blank" rel="noopener noreferrer"
            style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.4);color:#fff;padding:12px 28px;border-radius:9999px;font-weight:700;font-size:0.95rem;text-decoration:none;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
            Watch on YouTube
          </a>
        </div>
      </div>
    </section>

    <!-- Coming soon / placeholder -->
    <section style="max-width:900px;margin:0 auto;padding:60px 20px;text-align:center;">
      <div style="background:#fff;border:1.5px solid #ede5ff;border-radius:28px;padding:60px 40px;box-shadow:0 4px 24px rgba(108,43,217,0.07);">
        <div style="font-size:3.5rem;margin-bottom:16px;">🏰</div>
        <h2 style="font-size:1.6rem;font-weight:800;color:#111;margin:0 0 12px;">Exclusive Merch Dropping Soon</h2>
        <p style="color:#666;font-size:1rem;line-height:1.7;max-width:480px;margin:0 auto 28px;">
          We're putting the finishing touches on something special. Follow us on YouTube and check back for the official launch.
        </p>
        <a href="https://www.youtube.com/@daleam2934" target="_blank" rel="noopener noreferrer"
          style="display:inline-flex;align-items:center;gap:10px;background:#6C2BD9;color:#fff;padding:13px 30px;border-radius:9999px;font-weight:700;font-size:0.95rem;text-decoration:none;box-shadow:0 4px 14px rgba(108,43,217,0.35);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
          Subscribe for Updates
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
useHead({ title: 'Merch - Fortress Designs' })
</script>
