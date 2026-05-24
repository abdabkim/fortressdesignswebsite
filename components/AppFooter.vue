<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="col-span-1">
          <div class="flex items-center gap-3 mb-6">
            <img src="/favicon.png" alt="Fortress Designs" class="h-12 w-auto invert" @error="(e) => e.target.style.display = 'none'" />
            <span class="text-xl font-bold">Fortress Designs</span>
          </div>
          <p class="text-gray-400 mb-6 leading-relaxed">
            Discover the latest fashion trends and express your unique style with our curated collection of premium clothing and accessories.
          </p>
          <div class="flex gap-4">
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-6">Quick Links</h4>
          <ul class="space-y-4">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-primary transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/shop" class="text-gray-400 hover:text-primary transition-colors">Shop</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-400 hover:text-primary transition-colors">About Us</NuxtLink></li>
            <li><NuxtLink to="/cart" class="text-gray-400 hover:text-primary transition-colors">Cart</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-6">Categories</h4>
          <ul class="space-y-4">
            <li><a href="#" class="text-gray-400 hover:text-primary transition-colors">New Arrivals</a></li>
            <li><a href="#" class="text-gray-400 hover:text-primary transition-colors">Bestsellers</a></li>
            <li><a href="#" class="text-gray-400 hover:text-primary transition-colors">Trending Now</a></li>
            <li><a href="#" class="text-gray-400 hover:text-primary transition-colors">Sale Items</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-6">Contact Us</h4>
          <ul class="space-y-4">
            <li class="flex items-center gap-3 text-gray-400">
              <MapPin class="h-5 w-5 text-primary" /> Jamaica
            </li>
            <li class="flex items-center gap-3 text-gray-400">
              <Phone class="h-5 w-5 text-primary" /> +1 (876) 234-6399
            </li>
            <li class="flex items-center gap-3 text-gray-400">
              <Mail class="h-5 w-5 text-primary" /> fortressdesignsco876@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Fortress Designs. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Mail, Phone, MapPin } from '@lucide/vue'
</script>
