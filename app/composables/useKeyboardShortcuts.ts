import { useMagicKeys, whenever, useFullscreen } from '@vueuse/core'
import type { Ref } from 'vue'

export function useKeyboardShortcuts(isUIHidden?: Ref<boolean>, toast?: any) {
  const audioStore = useAudioStore()
  const presetStore = usePresetStore()
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

  const keys = useMagicKeys()
  
  // Helper to check if visualization is active
  const isVisualizationActive = () => audioStore.isCapturing && presetStore.activePreset
  
  // F or f: toggle fullscreen (only when visualization is active)
  whenever(keys.f!, () => {
    if (isVisualizationActive()) {
      toggleFullscreen()
    }
  })

  // Space: toggle pause (only when visualization is active)
  whenever(keys.space!, (v) => {
    if (v && isVisualizationActive()) {
      presetStore.togglePause()
    }
  })

  // ArrowRight: next preset (only when visualization is active)
  whenever(keys.arrowright!, (v) => {
    if (v && isVisualizationActive()) {
      presetStore.nextPreset()
    }
  })

  // ArrowLeft: previous preset (only when visualization is active)
  whenever(keys.arrowleft!, (v) => {
    if (v && isVisualizationActive()) {
      presetStore.previousPreset()
    }
  })

  // R: random preset (only when visualization is active)
  whenever(keys.r!, (v) => {
    if (v && isVisualizationActive()) {
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
    }
  })

  // C: toggle cycle (only when visualization is active)
  whenever(keys.c!, (v) => {
    if (v && isVisualizationActive()) {
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
    }
  })

  // H: toggle UI visibility (only when visualization is active)
  whenever(keys.h!, (v) => {
    if (v && isUIHidden && isVisualizationActive()) {
      isUIHidden.value = !isUIHidden.value
    }
  })

  return {
    isFullscreen
  }
}

