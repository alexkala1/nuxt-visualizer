export function usePWAInstall() {
  const toast = useToast()
  
  // PWA install prompt
  const deferredPrompt = ref<any>(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)
  const needRefresh = ref(false)
  const registration = ref<ServiceWorkerRegistration | null>(null)

  // Register service worker manually
  if (import.meta.client && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
        registration.value = reg
        
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                needRefresh.value = true
              }
            })
          }
        })
        
        // Check for updates periodically
        setInterval(() => {
          reg.update()
        }, 60 * 60 * 1000) // Check every hour
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    })
  }

  // Check if app is already installed
  onMounted(() => {
    if (import.meta.client) {
      // Check if running as PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      isInstalled.value = isStandalone || isIOSStandalone

      // Listen for install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt.value = e
        isInstallable.value = true
      })

      // Listen for successful installation
      window.addEventListener('appinstalled', () => {
        deferredPrompt.value = null
        isInstallable.value = false
        isInstalled.value = true
        toast.add({
          title: 'App Installed!',
          description: 'You can now use the app offline',
          icon: 'i-heroicons-check-circle',
          color: 'green'
        })
      })
    }
  })

  // Show install prompt
  async function install() {
    if (!deferredPrompt.value) {
      toast.add({
        title: 'Already Installed',
        description: 'The app is already installed or cannot be installed on this device',
        icon: 'i-heroicons-information-circle',
        color: 'blue'
      })
      return
    }

    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    deferredPrompt.value = null
    isInstallable.value = false
  }

  // Update the app
  async function updateApp() {
    try {
      if (registration.value && registration.value.waiting) {
        // Tell the service worker to skip waiting
        registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
        
        // Listen for the controller change and reload
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })
      } else {
        // Fallback: just reload
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to update:', error)
      toast.add({
        title: 'Update Failed',
        description: 'Please refresh the page manually',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'red'
      })
    }
  }

  // Show update notification when available
  watch(needRefresh, (newValue) => {
    if (newValue) {
      toast.add({
        title: 'Update Available!',
        description: 'A new version is ready. Click to update.',
        icon: 'i-heroicons-arrow-path',
        color: 'blue',
        timeout: 0, // Don't auto-dismiss
        actions: [{
          label: 'Update Now',
          click: updateApp
        }, {
          label: 'Later',
          click: () => {} // Dismiss
        }]
      })
    }
  })

  return {
    // Install
    isInstallable,
    isInstalled,
    install,
    
    // Update
    needRefresh,
    updateApp,
  }
}

