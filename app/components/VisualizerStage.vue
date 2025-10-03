<template>
  <div class="w-full h-full absolute inset-0">
    <!-- Dynamic preset component -->
    <component
      :is="presetStore.activePreset?.component"
      v-if="presetStore.activePreset && !presetStore.isPaused"
      class="w-full h-full absolute inset-0"
    />

    <!-- Paused overlay -->
    <div
      v-if="presetStore.isPaused && !isUIHidden"
      class="absolute inset-0 flex items-center justify-center bg-gray-950/50 backdrop-blur-sm"
    >
      <div class="text-center">
        <UIcon name="i-heroicons-pause-circle" class="w-24 h-24 text-gray-500 mb-4" />
        <p class="text-xl text-gray-400">Paused</p>
        <p class="text-sm text-gray-500 mt-2">Press <kbd class="inline-block px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">Space</kbd> to resume</p>
      </div>
    </div>

    <!-- Audio levels indicator (bottom left) -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="audioStore.isCapturing && !isUIHidden"
        class="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur rounded-lg px-4 py-3 text-xs space-y-1"
      >
        <div class="flex items-center gap-2">
        <span class="w-12 text-gray-400">Bass</span>
        <div class="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 transition-all duration-75"
            :style="{ width: `${audioStore.levels.bass * 100}%` }"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-12 text-gray-400">Mid</span>
        <div class="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 transition-all duration-75"
            :style="{ width: `${audioStore.levels.mid * 100}%` }"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-12 text-gray-400">Treble</span>
        <div class="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-purple-500 transition-all duration-75"
            :style="{ width: `${audioStore.levels.treble * 100}%` }"
          />
        </div>
        </div>
      </div>
    </Transition>

    <!-- Preset info (top left, below header) -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="presetStore.activePreset && !isUIHidden"
        class="absolute top-20 left-4 bg-gray-900/80 backdrop-blur rounded-lg px-4 py-2 z-40"
      >
        <h3 class="font-semibold">{{ presetStore.activePreset.name }}</h3>
        <p class="text-xs text-gray-400">{{ presetStore.activePreset.description }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useRafFn } from '@vueuse/core'

defineProps<{
  isUIHidden: boolean
}>()

const audioStore = useAudioStore()
const presetStore = usePresetStore()
const { computeLevels } = useAnalyser()

// Update audio levels in RAF loop
useRafFn(() => {
  if (audioStore.isCapturing && !presetStore.isPaused) {
    const levels = computeLevels()
    audioStore.updateLevels(levels)
  }
})
</script>

