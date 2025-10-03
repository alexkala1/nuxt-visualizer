// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SPA mode – we only need client-side APIs
  ssr: false,
  
  // Use the new Nuxt 4 app/ directory structure
  compatibilityDate: '2024-07-15',
  
  future: {
    compatibilityVersion: 4
  },

  // TypeScript strict mode
  typescript: {
    strict: true,
    typeCheck: false // disable for faster dev; enable pre-deploy
  },

  // Import Tailwind CSS
  css: ['~/assets/css/main.css'],

  // Modules
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],

  // App metadata
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Nuxt Audio Visualizer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Browser-based audio visualizer with multiple presets, inspired by Windows Media Player' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  // PWA configuration
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nuxt Audio Visualizer',
      short_name: 'Visualizer',
      description: 'Capture and visualize audio from your browser tabs',
      theme_color: '#0b0f1a',
      background_color: '#0b0f1a',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      // Simplified glob patterns for static site - only cache essential files
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}']
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  },

  // Static site generation
  nitro: {
    preset: 'static'
  },

  routeRules: {
    '/': { prerender: true }
  },

  // Dev server (HTTPS not strictly needed for localhost)
  devServer: {
    port: 3000
  },

  // Vite config
  vite: {
    assetsInclude: ['**/*.glsl', '**/*.frag', '**/*.vert']
  }
})

