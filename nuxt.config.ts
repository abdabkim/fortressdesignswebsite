// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }]
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    printfulToken: process.env.PRINTFUL_TOKEN,
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@lucide/vue',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'firebase/app',
        'firebase/auth'
      ]
    }
  }
})
