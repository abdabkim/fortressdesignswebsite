<template>
  <div class="min-h-screen bg-[#faf9ff] font-sans pb-12">
    <AppNavbar />

    <!-- Hero Section -->
    <section class="w-full px-4 sm:px-6 lg:px-8 mt-8 mb-12">
      <div class="relative bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center min-h-[400px]">
        <!-- Background Image (merchheader.png) -->
        <div class="absolute inset-0 z-0">
          <img src="/merchhead.png?" alt="Header Background" class="w-full h-full object-cover object-right" />
        </div>
        
        <!-- Content -->
        <div class="relative z-10 w-full md:w-1/2 lg:w-[55%] xl:w-1/2 p-8 md:p-12 lg:pl-16 flex flex-col justify-center">
          <p class="text-primary font-bold tracking-widest text-sm mb-2 uppercase">Welcome To</p>
          <h1 class="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">Official Merch</h1>
          <p class="text-lg md:text-xl text-gray-700 mb-5 leading-snug">
            From the music to the message.<br/>
            Support Dale Honeyghan.
          </p>
          <p class="text-gray-600 mb-8 max-w-sm leading-relaxed text-sm md:text-base">
            Dale Honeyghan is a music artist with a message of hope, faith, and perseverance. His music uplifts, inspires, and connects people through authentic sound and powerful lyrics.
          </p>
          
          <div class="flex flex-row flex-nowrap items-center gap-3">
            <NuxtLink to="/shop" class="inline-flex shrink-0 items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm whitespace-nowrap">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              Shop Merch
            </NuxtLink>
            <a href="#" class="inline-flex shrink-0 items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm whitespace-nowrap">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Listen to Songs
            </a>
            <a href="#" class="inline-flex shrink-0 items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm whitespace-nowrap">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
              Visit YouTube Channel
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <section class="w-full px-4 sm:px-6 lg:px-8 mb-12 flex flex-col lg:flex-row gap-6">
      
      <!-- Latest Songs -->
      <div class="lg:w-[40%] bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Latest Songs</h2>
          <a href="#" class="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View All Songs
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>
        
        <div class="space-y-4">
          <!-- Song Item -->
          <div v-for="(song, index) in songs" :key="index" class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors group">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
                <img :src="song.image" class="w-full h-full object-cover" v-if="song.image" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.28l8-1.6V11.114A4.369 4.369 0 0015 11c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path></svg>
                </div>
              </div>
              <button class="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm text-gray-700 hover:text-primary hover:border-primary transition-colors">
                <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
              </button>
              <div class="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-xs">{{ song.title }}</div>
            </div>
            <div class="flex items-center gap-4 text-gray-500 text-sm">
              <span>{{ song.duration }}</span>
              <button class="p-1 hover:text-gray-900 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 110-4 2 2 0 010 4z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Release -->
      <div class="lg:w-[60%] bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-gray-900">Featured Release</h2>
          <p class="text-gray-500 text-sm mt-1">The new single is out now.</p>
        </div>
        
        <a href="#" class="inline-flex w-max items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-colors mb-6 text-sm">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
          Watch on YouTube
        </a>
        
        <div class="mt-auto relative rounded-xl overflow-hidden flex items-center justify-center min-h-[220px]">
          <img src="/stripessection.png" alt="Featured Release Stripes" class="w-full h-full object-cover" />
        </div>
      </div>
      
    </section>

    <!-- Stay Updated -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Stay Updated</h3>
            <p class="text-sm text-gray-500">Be the first to know about new music, merch, and updates.</p>
          </div>
        </div>
        
        <div class="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          <input type="email" placeholder="Enter your email" class="w-full sm:w-64 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
          <button class="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm">
            Subscribe
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
definePageMeta({ layout: false })
useHead({ title: 'Official Merch - Fortress Designs' })

const songs = [
  { title: 'Stripes feat. Nevaeh Valcin', duration: '3:46', image: '/Stripes.jpeg' },
  { title: 'Morning Train', duration: '5:28', image: '/morningtrain.png' },
  { title: 'Seeking the Lost', duration: '4:27', image: '' },
  { title: 'Thank You for Loving Me', duration: '3:24', image: '' },
  { title: 'Walls feat. Shaiaye', duration: '3:27', image: '' }
]
</script>
