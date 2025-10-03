import { useMagicKeys, whenever, useFullscreen } from '@vueuse/core'
import type { Ref } from 'vue'

export function useKeyboardShortcuts(isUIHidden?: Ref<boolean>, toast?: any) {
  const presetStore = usePresetStore()
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

  const keys = useMagicKeys()
  
  // F or f: toggle fullscreen
  whenever(keys.f, () => {
    toggleFullscreen()
  })

  // Space: toggle pause
  whenever(keys.space, (v) => {
    if (v) presetStore.togglePause()
  })

  // ArrowRight: next preset
  whenever(keys.arrowright, (v) => {
    if (v) presetStore.nextPreset()
  })

  // ArrowLeft: previous preset
  whenever(keys.arrowleft, (v) => {
    if (v) presetStore.previousPreset()
  })

  // R: random preset
  whenever(keys.r, (v) => {
    if (v) {
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

  // C: toggle cycle
  whenever(keys.c, (v) => {
    if (v) {
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

  // H: toggle UI visibility (hide/show)
  whenever(keys.h, (v) => {
    if (v && isUIHidden) {
      isUIHidden.value = !isUIHidden.value
    }
  })

  return {
    isFullscreen
  }
}

