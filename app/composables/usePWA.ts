export function usePWAInstall() {
  const toast = useToast()
  
  // PWA install prompt
  const deferredPrompt = ref<any>(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)

  // Show install prompt - defined before it's used
  const install = async () => {
    if (!deferredPrompt.value) {
      toast.add({
        title: 'Already Installed',
        description: 'The app is already installed or cannot be installed on this device',
        icon: 'i-heroicons-information-circle',
        color: 'info'
      })
      return
    }

    try {
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      deferredPrompt.value = null
      isInstallable.value = false
    } catch (error) {
      console.error('Install error:', error)
      toast.add({
        title: 'Installation Failed',
        description: 'Could not install the app. Please try again.',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error'
      })
    }
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
        
        // Show a toast notification that the app can be installed
        toast.add({
          title: '📱 Install App',
          description: 'Install this app for offline access and a better experience',
          icon: 'i-heroicons-arrow-down-tray',
          color: 'primary',
          actions: [{
            label: 'Install',
            onClick: install
          }, {
            label: 'Later',
            onClick: () => {} // Dismiss
          }]
        })
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
          color: 'success'
        })
      })
    }
  })

  return {
    isInstallable,
    isInstalled,
    install,
  }
}

