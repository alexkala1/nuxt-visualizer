import { useDebounceFn } from '@vueuse/core'

export function useVisualizerResize(onResize: () => void) {
  let rafId: number | null = null
  
  // Debounced resize handler to prevent excessive calls
  const debouncedResize = useDebounceFn(() => {
    // Use requestAnimationFrame to ensure DOM has settled
    if (rafId) cancelAnimationFrame(rafId)
    
    rafId = requestAnimationFrame(() => {
      onResize()
      rafId = null
    })
  }, 150)

  onMounted(() => {
    if (import.meta.client) {
      // Handle both resize and orientation change
      window.addEventListener('resize', debouncedResize)
      window.addEventListener('orientationchange', debouncedResize)
      
      // Also listen for visual viewport resize on mobile
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', debouncedResize)
      }
    }
  })

  onBeforeUnmount(() => {
    if (import.meta.client) {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('orientationchange', debouncedResize)
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', debouncedResize)
      }
    }
  })

  return {
    debouncedResize
  }
}

