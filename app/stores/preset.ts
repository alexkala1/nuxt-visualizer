import { defineStore } from 'pinia'
import type { Component } from 'vue'

export interface VisualPreset {
  id: string
  name: string
  description: string
  kind: '2d' | '3d' | 'shader'
  component: Component
  thumbnail?: string
  defaults: Record<string, any>
  tags?: string[]
}

export interface PresetParams {
  [key: string]: any
}

export const usePresetStore = defineStore('preset', () => {
  // Load persisted data from localStorage (client-side only)
  const getPersistedData = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('nuxt-visualizer-preset')
        if (stored) {
          return JSON.parse(stored)
        }
      } catch (e) {
        console.error('Failed to load preset state', e)
      }
    }
    return null
  }

  const persisted = getPersistedData()

  // State
  const presets = shallowRef<VisualPreset[]>([])
  const activePresetId = ref<string | null>(persisted?.activePresetId || null)
  const paramsById = ref<Record<string, PresetParams>>(persisted?.paramsById || {})
  const favorites = ref<string[]>(persisted?.favorites || [])
  const cycleEnabled = ref(persisted?.cycleEnabled || false)
  const cycleInterval = ref(persisted?.cycleInterval || 10000) // 10 seconds
  const isPaused = ref(false)

  // Computed
  const activePreset = computed(() => 
    presets.value.find(p => p.id === activePresetId.value) || null
  )
  
  const activeParams = computed(() => {
    if (!activePresetId.value) return {}
    return paramsById.value[activePresetId.value] || activePreset.value?.defaults || {}
  })

  const favoritePresets = computed(() => 
    presets.value.filter(p => favorites.value.includes(p.id))
  )

  // Actions
  function registerPreset(preset: VisualPreset) {
    const existing = presets.value.find(p => p.id === preset.id)
    if (!existing) {
      // Use shallowRef trigger by creating new array
      presets.value = [...presets.value, preset]
      paramsById.value[preset.id] = { ...preset.defaults }
    }
  }

  function setActivePreset(id: string) {
    const preset = presets.value.find(p => p.id === id)
    if (preset) {
      activePresetId.value = id
      // Ensure params exist
      if (!paramsById.value[id]) {
        paramsById.value[id] = { ...preset.defaults }
      }
    }
  }

  function updateParams(id: string, params: Partial<PresetParams>) {
    if (paramsById.value[id]) {
      paramsById.value[id] = { ...paramsById.value[id], ...params }
    } else {
      paramsById.value[id] = { ...params }
    }
  }

  function toggleFavorite(id: string) {
    const idx = favorites.value.indexOf(id)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(id)
    }
  }

  function nextPreset() {
    if (presets.value.length === 0) return
    const currentIdx = presets.value.findIndex(p => p.id === activePresetId.value)
    const nextIdx = (currentIdx + 1) % presets.value.length
    setActivePreset(presets.value[nextIdx].id)
  }

  function previousPreset() {
    if (presets.value.length === 0) return
    const currentIdx = presets.value.findIndex(p => p.id === activePresetId.value)
    const prevIdx = currentIdx <= 0 ? presets.value.length - 1 : currentIdx - 1
    setActivePreset(presets.value[prevIdx].id)
  }

  function randomPreset() {
    if (presets.value.length === 0) return
    const randomIdx = Math.floor(Math.random() * presets.value.length)
    setActivePreset(presets.value[randomIdx].id)
  }

  function toggleCycle() {
    cycleEnabled.value = !cycleEnabled.value
  }

  function setCycleInterval(ms: number) {
    cycleInterval.value = ms
  }

  function togglePause() {
    isPaused.value = !isPaused.value
  }

  // Auto-save to localStorage on changes (client-side only)
  if (import.meta.client) {
    watch([activePresetId, paramsById, favorites, cycleEnabled, cycleInterval], () => {
      try {
        const data = {
          activePresetId: activePresetId.value,
          paramsById: paramsById.value,
          favorites: favorites.value,
          cycleEnabled: cycleEnabled.value,
          cycleInterval: cycleInterval.value
        }
        localStorage.setItem('nuxt-visualizer-preset', JSON.stringify(data))
      } catch (e) {
        console.error('Failed to save preset state', e)
      }
    }, { deep: true })
  }

  return {
    // State
    presets,
    activePresetId,
    paramsById,
    favorites,
    cycleEnabled,
    cycleInterval,
    isPaused,
    // Computed
    activePreset,
    activeParams,
    favoritePresets,
    // Actions
    registerPreset,
    setActivePreset,
    updateParams,
    toggleFavorite,
    nextPreset,
    previousPreset,
    randomPreset,
    toggleCycle,
    setCycleInterval,
    togglePause
  }
})

