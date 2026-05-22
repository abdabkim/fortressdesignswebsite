<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppNavbar />

    <!-- Hero -->
    <section class="bg-white py-20 border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Our Story</h1>
        <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          Built by creators, for creators. Fortress Designs was born from a passion for bold self-expression and premium quality.
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Where Bold Meets Quality</h2>
            <div class="space-y-4 text-gray-500">
              <p>Fortress Designs started in 2020 with a simple mission: create clothing that helps people express their unique identity without compromising on quality.</p>
              <p>We noticed a gap in the market—streetwear that looked good but fell apart after a few washes, or quality basics that lacked personality. We decided to bridge that gap.</p>
              <p>Today, we partner with premium print-on-demand manufacturers to deliver designs that are as durable as they are distinctive. Every piece is printed with care and shipped directly to you.</p>
              <p>Fortress Designs isn't just a brand—it's a community of individuals who refuse to blend in. Welcome to the family.</p>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-square rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=600&fit=crop" alt="Fortress Designs Studio" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-xl shadow-xl">
              <div class="text-4xl font-bold">5K+</div>
              <div class="text-sm text-white/80">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-white border-y">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(value, index) in values" :key="index" class="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
            <div class="inline-flex p-4 rounded-full gradient-bg-accent mb-4">
              <component :is="value.icon" class="h-6 w-6 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">{{ value.title }}</h3>
            <p class="text-gray-500 text-sm">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Meet the Team</h2>
        <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div v-for="(member, index) in team" :key="index" class="text-center">
            <div class="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 border-4 border-primary">
              <img :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
            </div>
            <h3 class="font-semibold text-lg">{{ member.name }}</h3>
            <p class="text-gray-500">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to Join the Movement?</h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Explore our collection and find the pieces that speak to you.</p>
        <NuxtLink to="/shop">
          <button class="flex items-center gap-2 bg-primary text-white hover:bg-purple-700 text-lg px-10 py-4 rounded-full mx-auto transition-colors">
            Explore the Shop <ArrowRight class="h-5 w-5" />
          </button>
        </NuxtLink>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { Target, Heart, Zap, Users, ArrowRight } from '@lucide/vue'

const values = [
  { icon: Target, title: 'Quality First', description: 'We use only premium materials and partner with top manufacturers to ensure every piece meets our high standards.' },
  { icon: Heart, title: 'Passion Driven', description: 'Every design is crafted with passion and purpose. We believe clothing is a form of self-expression.' },
  { icon: Zap, title: 'Bold Innovation', description: 'We push boundaries and challenge conventions. Our designs are for those who dare to be different.' },
  { icon: Users, title: 'Community Focused', description: "We're building more than a brand—we're building a community of bold individuals who support each other." },
]

const team = [
  { name: 'Alex Rivera', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
  { name: 'Jordan Lee', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop' },
  { name: 'Taylor Morgan', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
]

useHead({ title: 'About Us - Fortress Designs' })
</script>
