<template>
  <div class="min-h-screen" style="background:#faf9ff;">
    <AppNavbar />

    <!-- Hero -->
    <section style="background:linear-gradient(135deg,#6C2BD9 0%,#D946EF 100%);padding:80px 20px;text-align:center;">
      <div style="max-width:700px;margin:0 auto;">
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:9999px;padding:6px 16px;font-size:0.8rem;color:#fff;font-weight:500;margin-bottom:20px;">
          🎵 Latest Tracks
        </div>
        <h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:#fff;margin:0 0 16px;line-height:1.15;">The Sound of<br/>Fortress Designs</h1>
        <p style="font-size:1.05rem;color:rgba(255,255,255,0.85);margin:0 auto;max-width:520px;line-height:1.7;">
          Discover our music — raw, authentic, and built from the ground up. Stream our latest releases below.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section style="max-width:900px;margin:0 auto;padding:60px 20px;">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111;margin:0 0 32px;">Featured Releases</h2>

      <div style="display:grid;gap:20px;">
        <div v-for="track in tracks" :key="track.title"
          style="background:#fff;border:1.5px solid #ede5ff;border-radius:20px;padding:20px 24px;display:flex;align-items:center;gap:20px;box-shadow:0 2px 12px rgba(108,43,217,0.06);">
          <!-- Thumbnail -->
          <div :style="'width:64px;height:64px;border-radius:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.8rem;background:' + track.bg">
            {{ track.emoji }}
          </div>
          <!-- Info -->
          <div style="flex:1;min-width:0;">
            <div style="font-size:1rem;font-weight:700;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ track.title }}</div>
            <div style="font-size:0.82rem;color:#888;margin-top:3px;">{{ track.genre }} · {{ track.duration }}</div>
          </div>
          <!-- Play button -->
          <a :href="track.link" target="_blank" rel="noopener noreferrer"
            style="display:flex;align-items:center;gap:8px;padding:10px 20px;background:#6C2BD9;color:#fff;border-radius:9999px;font-size:0.85rem;font-weight:600;text-decoration:none;flex-shrink:0;transition:background 0.15s;"
            @mouseenter="e => e.currentTarget.style.background='#5a23b8'"
            @mouseleave="e => e.currentTarget.style.background='#6C2BD9'">
            ▶ Listen
          </a>
        </div>
      </div>

      <!-- YouTube CTA -->
      <div style="margin-top:48px;background:linear-gradient(135deg,#6C2BD9,#D946EF);border-radius:24px;padding:40px;text-align:center;">
        <div style="font-size:2rem;margin-bottom:12px;">🎬</div>
        <h3 style="font-size:1.4rem;font-weight:700;color:#fff;margin:0 0 10px;">Watch on YouTube</h3>
        <p style="color:rgba(255,255,255,0.85);font-size:0.95rem;margin:0 0 24px;">Full videos, behind the scenes, and exclusive drops.</p>
        <a href="https://www.youtube.com/@FortressDesigns" target="_blank" rel="noopener noreferrer"
          style="display:inline-flex;align-items:center;gap:10px;background:#fff;color:#6C2BD9;padding:12px 28px;border-radius:9999px;font-weight:700;font-size:0.95rem;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,0.15);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#6C2BD9"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
          Subscribe on YouTube
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const tracks = [
  { title: 'Built Different', genre: 'Hip-Hop', duration: '3:24', emoji: '🔥', bg: '#fff0f5', link: 'https://www.youtube.com/@FortressDesigns' },
  { title: 'Fortress Flow',   genre: 'Rap',     duration: '2:58', emoji: '⚡', bg: '#f0f5ff', link: 'https://www.youtube.com/@FortressDesigns' },
  { title: 'No Cap Season',   genre: 'Hip-Hop', duration: '3:41', emoji: '🎯', bg: '#f5fff0', link: 'https://www.youtube.com/@FortressDesigns' },
  { title: 'Purple Reign',    genre: 'R&B',     duration: '4:02', emoji: '👑', bg: '#f5f0ff', link: 'https://www.youtube.com/@FortressDesigns' },
]
</script>
