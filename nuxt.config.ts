// https://nuxt.com/docs/api/configuration/nuxt-config

// Helper to construct paths with baseURL
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const getPath = (path: string) => {
  const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

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
    baseURL,
    head: {
      title: 'Nuxt Audio Visualizer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Browser-based audio visualizer with multiple presets, inspired by Windows Media Player' },
        { name: 'theme-color', content: '#0b0f1a' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: getPath('/favicon.svg') },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: getPath('/icon-192.png') },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: getPath('/icon-512.png') },
        { rel: 'apple-touch-icon', sizes: '192x192', href: getPath('/icon-192.png') },
        { rel: 'manifest', href: getPath('/manifest.webmanifest') }
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
      start_url: baseURL,
      scope: baseURL,
      orientation: 'any',
      icons: [
        {
          src: getPath('/icon-192.png'),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: getPath('/icon-512.png'),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600 // Check for updates every hour
    },
    devOptions: {
      enabled: true,
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

