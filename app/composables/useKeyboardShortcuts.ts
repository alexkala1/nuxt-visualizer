import { useFullscreen } from '@vueuse/core'
import type { Ref } from 'vue'

export function useKeyboardShortcuts(isUIHidden?: Ref<boolean>, toast?: any) {
  const audioStore = useAudioStore()
  const presetStore = usePresetStore()
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
  
  // Helper to check if visualization is active
  const isVisualizationActive = () => audioStore.isCapturing && presetStore.activePreset
  
  // Helper to check if we should ignore keyboard events (when typing in input)
  const shouldIgnoreEvent = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    const tagName = target.tagName.toLowerCase()
    return tagName === 'input' || tagName === 'textarea' || target.contentEditable === 'true'
  }

  // Keyboard event handler
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore if typing in an input field
    if (shouldIgnoreEvent(e)) return
    
    // Only handle shortcuts when visualization is active
    if (!isVisualizationActive()) return

    const key = e.key.toLowerCase()

    switch (key) {
      case 'f':
        e.preventDefault()
        toggleFullscreen()
        break

      case ' ': // Space
        e.preventDefault()
        presetStore.togglePause()
        break

      case 'arrowright':
        e.preventDefault()
        presetStore.nextPreset()
        break

      case 'arrowleft':
        e.preventDefault()
        presetStore.previousPreset()
        break

      case 'r':
        e.preventDefault()
        presetStore.randomPreset()
        nextTick(() => {
          const preset = presetStore.activePreset
          if (preset && toast) {
            toast.add({
              title: '🎲 ' + preset.name,
              description: 'Random preset selected',
              color: 'primary' as const,
              icon: 'i-heroicons-arrow-path-20-solid'
            })
          }
        })
        break

      case 'c':
        e.preventDefault()
        presetStore.toggleCycle()
        nextTick(() => {
          if (toast) {
            toast.add({
              title: presetStore.cycleEnabled ? '▶️ Auto-Cycle Enabled' : '⏸️ Auto-Cycle Disabled',
              description: presetStore.cycleEnabled 
                ? `Switching presets every ${presetStore.cycleInterval / 1000}s` 
                : 'Manual preset control restored',
              color: presetStore.cycleEnabled ? 'success' : 'neutral' as const,
              icon: presetStore.cycleEnabled ? 'i-heroicons-play-circle-20-solid' : 'i-heroicons-pause-circle-20-solid'
            })
          }
        })
        break

      case 'h':
        e.preventDefault()
        if (isUIHidden) {
          isUIHidden.value = !isUIHidden.value
        }
        break
    }
  }

  // Register keyboard event listener
  onMounted(() => {
    if (import.meta.client) {
      window.addEventListener('keydown', handleKeyDown)
    }
  })

  // Cleanup on unmount
  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  return {
    isFullscreen
  }
}

