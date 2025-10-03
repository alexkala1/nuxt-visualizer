<template>
  <div class="min-h-screen bg-gray-950 text-white relative">
    <!-- Visualization canvas (full height, behind everything) -->
    <div
      v-if="audioStore.isCapturing && presetStore.activePreset"
      class="fixed inset-0 w-full h-screen z-0"
    >
      <VisualizerStage :is-u-i-hidden="isUIHidden" />
    </div>

    <!-- Header (overlays visualization) -->
    <header 
      class="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      :class="{ '-translate-y-full': isUIHidden }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-musical-note" class="w-8 h-8 text-primary" />
            <h1 class="text-xl font-semibold">Nuxt Audio Visualizer</h1>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Not capturing: Show input options -->
            <template v-if="!audioStore.isCapturing">
              <UButton
                color="primary"
                size="lg"
                icon="i-heroicons-arrow-up-tray"
                @click="handleStartTabCapture"
              >
                Share tab audio
              </UButton>
              <UButton
                color="primary"
                size="lg"
                variant="soft"
                icon="i-heroicons-microphone"
                @click="handleStartMicrophone"
              >
                Microphone
              </UButton>
            </template>

            <!-- Capturing: Show stop button and input method indicator -->
            <template v-else>
              <UButton
                color="error"
                size="lg"
                variant="soft"
                icon="i-heroicons-stop"
                @click="handleStopCapture"
              >
                Stop {{ audioStore.inputMethod === 'microphone' ? 'microphone' : 'capture' }}
              </UButton>
              
              <!-- Input method badge -->
              <div class="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-sm">
                <UIcon 
                  :name="audioStore.inputMethod === 'microphone' ? 'i-heroicons-microphone' : 'i-heroicons-arrow-up-tray'" 
                  class="w-4 h-4"
                />
                <span class="text-xs">{{ audioStore.inputMethod === 'microphone' ? 'Microphone' : 'Tab Audio' }}</span>
              </div>
            </template>

            <UButton
              v-if="audioStore.isCapturing && presetStore.activePreset"
              :icon="isFullscreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
              size="lg"
              variant="ghost"
              @click="toggleFullscreen"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Content area (below header) -->
    <div class="relative z-10 pt-[73px]">
      <!-- Error banner -->
      <UAlert
        v-if="audioStore.hasError && audioStore.error && !isUIHidden"
        color="error"
        variant="soft"
        :title="audioStore.error"
        :close-button="{ icon: 'i-heroicons-x-mark', color: 'error', variant: 'link' }"
        class="m-4 transition-opacity duration-300"
        @close="audioStore.clearError"
      />

    <!-- Info banner (when not capturing) -->
    <UAlert
      v-if="!audioStore.isCapturing && !audioStore.hasError && !isUIHidden"
      color="info"
      variant="soft"
      icon="i-heroicons-information-circle"
      title="Choose your audio input"
      class="m-4 transition-opacity duration-300"
    >
      <template #description>
        <div class="space-y-2">
          <div>
            <p class="font-semibold">🎵 Tab Audio (Recommended for streaming)</p>
            <p class="text-sm">Visualize audio from YouTube, Spotify, or any browser tab</p>
            <p class="text-xs opacity-75">Chrome/Edge only • Requires permission each time</p>
          </div>
          <div class="mt-2">
            <p class="font-semibold">🎤 Microphone (Best for live music)</p>
            <p class="text-sm">Capture audio from your microphone, instruments, or DJ equipment</p>
            <p class="text-xs opacity-75">All browsers • Permission can be remembered</p>
          </div>
        </div>
      </template>
    </UAlert>

      <!-- Preset grid (when not capturing or no preset) -->
      <div
        v-if="!audioStore.isCapturing || !presetStore.activePreset"
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300"
        :class="{ 'opacity-0 pointer-events-none': isUIHidden }"
      >
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Choose a visualization</h2>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-arrow-path"
              variant="ghost"
              @click="handleRandomPreset"
            >
              Random
            </UButton>
            <UButton
              :icon="presetStore.cycleEnabled ? 'i-heroicons-pause' : 'i-heroicons-play'"
              variant="ghost"
              @click="handleToggleCycle"
            >
              {{ presetStore.cycleEnabled ? 'Stop cycle' : 'Auto-cycle' }}
            </UButton>
          </div>
        </div>

        <PresetGrid />
      </div>
    </div>

    <!-- Keyboard shortcuts help -->
    <div
      v-if="audioStore.isCapturing && presetStore.activePreset && !isUIHidden"
      class="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur rounded-lg px-4 py-3 text-sm text-gray-300 space-y-1 transition-opacity duration-300 z-50"
    >
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">F</kbd> Fullscreen</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">Space</kbd> Pause</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">←</kbd> <kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">→</kbd> Switch preset</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">R</kbd> Random</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">C</kbd> Toggle cycle</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">H</kbd> Hide UI</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'

const audioStore = useAudioStore()
const presetStore = usePresetStore()
const toast = useToast()

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
const isUIHidden = ref(false)

// Keyboard shortcuts
useKeyboardShortcuts(isUIHidden, toast)

// Start tab capture handler
async function handleStartTabCapture() {
  await audioStore.startTabCapture()
  // Error handling is done in the store
}

// Start microphone handler
async function handleStartMicrophone() {
  await audioStore.startMicrophoneCapture()
  // Error handling is done in the store
}

// Stop capture handler
function handleStopCapture() {
  audioStore.stopCapture()
}

// Random preset handler  
function handleRandomPreset() {
  presetStore.randomPreset()
  nextTick(() => {
    const preset = presetStore.activePreset
    if (preset) {
      toast.add({
        title: '🎲 ' + preset.name,
        description: 'Random preset selected',
        color: 'primary' as const,
        icon: 'i-heroicons-arrow-path-20-solid'
      })
    }
  })
}

// Toggle cycle handler
function handleToggleCycle() {
  presetStore.toggleCycle()
  nextTick(() => {
    toast.add({
      title: presetStore.cycleEnabled ? '▶️ Auto-Cycle Enabled' : '⏸️ Auto-Cycle Disabled',
      description: presetStore.cycleEnabled 
        ? `Switching presets every ${presetStore.cycleInterval / 1000}s` 
        : 'Manual preset control restored',
      color: presetStore.cycleEnabled ? 'success' : 'neutral' as const,
      icon: presetStore.cycleEnabled ? 'i-heroicons-play-circle-20-solid' : 'i-heroicons-pause-circle-20-solid'
    })
  })
}

// Auto-cycle presets
let cycleTimer: ReturnType<typeof setInterval> | null = null

watchEffect(() => {
  if (presetStore.cycleEnabled && audioStore.isCapturing) {
    cycleTimer = setInterval(() => {
      if (!presetStore.isPaused) {
        presetStore.nextPreset()
      }
    }, presetStore.cycleInterval)
  } else {
    if (cycleTimer) {
      clearInterval(cycleTimer)
      cycleTimer = null
    }
  }
})

onBeforeUnmount(() => {
  if (cycleTimer) {
    clearInterval(cycleTimer)
  }
})
</script>

