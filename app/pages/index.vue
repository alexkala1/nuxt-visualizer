<template>
  <div ref="visualizerContainer" class="min-h-screen bg-gray-950 text-white relative overflow-x-hidden">
    <!-- Visualization canvas (full height, behind everything) -->
    <div
      v-if="audioStore.isCapturing && presetStore.activePreset"
      class="fixed inset-0 w-full h-screen z-0"
      @click="handleVisualizationTap"
    >
      <VisualizerStage :is-u-i-hidden="isUIHidden" />
    </div>

    <!-- Header (overlays visualization) -->
    <header 
      class="border-b border-gray-800 bg-gray-900/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden"
      :class="{ 
        '-translate-y-full': isUIHidden,
        'h-16': !isMobile,
        'h-14': isMobile
      }"
    >
      <div class="w-full h-full px-2 sm:px-3 md:px-4 lg:px-6">
        <div class="flex items-center justify-between h-full min-w-0 max-w-7xl mx-auto gap-2">
          <div class="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
            <UIcon name="i-heroicons-musical-note" class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary flex-shrink-0" />
            <h1 class="text-xs sm:text-sm md:text-base lg:text-lg font-semibold truncate">
              <span class="hidden md:inline">Nuxt Audio Visualizer</span>
              <span class="hidden sm:inline md:hidden">Audio Visualizer</span>
              <span class="sm:hidden">Visualizer</span>
            </h1>
          </div>
          
          <div class="flex items-center gap-0.5 sm:gap-1 md:gap-2 flex-shrink-0 min-w-0">
            <!-- Not capturing: Show input options -->
            <template v-if="!audioStore.isCapturing">
              <UButton
                color="primary"
                :size="isMobile ? 'xs' : 'sm'"
                icon="i-heroicons-arrow-up-tray"
                class="hidden md:flex"
                @click="handleStartTabCapture"
              >
                Share tab audio
              </UButton>
              <UButton
                color="primary"
                size="xs"
                icon="i-heroicons-arrow-up-tray"
                class="md:hidden"
                @click="handleStartTabCapture"
              >
                Tab
              </UButton>
              <UButton
                color="primary"
                :size="isMobile ? 'xs' : 'sm'"
                variant="soft"
                icon="i-heroicons-microphone"
                class="hidden md:flex"
                @click="handleStartMicrophone"
              >
                Microphone
              </UButton>
              <UButton
                color="primary"
                size="xs"
                variant="soft"
                icon="i-heroicons-microphone"
                class="md:hidden"
                @click="handleStartMicrophone"
              >
                Mic
              </UButton>
            </template>

            <!-- Capturing: Show stop button and input method indicator -->
            <template v-else>
              <UButton
                color="error"
                :size="isMobile ? 'xs' : 'sm'"
                variant="soft"
                icon="i-heroicons-stop"
                class="hidden md:flex"
                @click="handleStopCapture"
              >
                Stop {{ audioStore.inputMethod === 'microphone' ? 'microphone' : 'capture' }}
              </UButton>
              <UButton
                color="error"
                size="xs"
                variant="soft"
                icon="i-heroicons-stop"
                class="md:hidden"
                @click="handleStopCapture"
              >
                Stop
              </UButton>
              
              <!-- Input method badge - only show on larger screens -->
              <div class="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs">
                <UIcon 
                  :name="audioStore.inputMethod === 'microphone' ? 'i-heroicons-microphone' : 'i-heroicons-arrow-up-tray'" 
                  class="w-3 h-3"
                />
                <span>{{ audioStore.inputMethod === 'microphone' ? 'Mic' : 'Tab' }}</span>
              </div>
            </template>

            <!-- Install PWA button -->
            <UButton
              v-if="isInstallable && !isInstalled"
              icon="i-heroicons-arrow-down-tray"
              :size="isMobile ? 'xs' : 'sm'"
              variant="soft"
              color="primary"
              :title="isMobile ? 'Install' : 'Install App'"
              @click="install"
            >
              <span class="hidden lg:inline">Install App</span>
            </UButton>

            <UButton
              v-if="audioStore.isCapturing && presetStore.activePreset"
              :icon="isFullscreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
              :size="isMobile ? 'xs' : 'sm'"
              variant="ghost"
              @click="toggleFullscreen"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Content area (below header) -->
    <div class="relative z-10 overflow-x-hidden" :class="{ 'pt-14': isMobile, 'pt-16': !isMobile }">
      <!-- Banners container -->
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4">
        <!-- Error banner -->
        <UAlert
          v-if="audioStore.hasError && audioStore.error && !isUIHidden"
          color="error"
          variant="soft"
          :title="audioStore.error"
          :close-button="{ icon: 'i-heroicons-x-mark', color: 'error', variant: 'link' }"
          class="mb-3 sm:mb-4 transition-opacity duration-300"
          @close="audioStore.clearError"
        />

        <!-- Info banner (when not capturing) -->
        <UAlert
          v-if="!audioStore.isCapturing && !audioStore.hasError && !isUIHidden"
          color="info"
          variant="soft"
          icon="i-heroicons-information-circle"
          title="Choose your audio input"
          class="transition-opacity duration-300"
        >
          <template #description>
            <div class="space-y-2 sm:space-y-3">
              <div>
                <p class="font-semibold text-sm sm:text-base">🎵 Tab Audio <span class="hidden sm:inline">(Recommended for streaming)</span></p>
                <p class="text-xs sm:text-sm">Visualize audio from YouTube, Spotify, or any browser tab</p>
                <p class="text-xs opacity-75 hidden sm:block">Chrome/Edge only • Requires permission each time</p>
              </div>
              <div class="mt-1.5 sm:mt-2">
                <p class="font-semibold text-sm sm:text-base">🎤 Microphone <span class="hidden sm:inline">(Best for live music)</span></p>
                <p class="text-xs sm:text-sm">Capture audio from your microphone, instruments, or DJ equipment</p>
                <p class="text-xs opacity-75 hidden sm:block">All browsers • Permission can be remembered</p>
              </div>
            </div>
          </template>
        </UAlert>
      </div>

      <!-- Preset grid (when not capturing or no preset) -->
      <div
        v-if="!audioStore.isCapturing || !presetStore.activePreset"
        class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 transition-opacity duration-300"
        :class="{ 'opacity-0 pointer-events-none': isUIHidden }"
      >
        <div class="mb-4 sm:mb-5 lg:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold">Choose a visualization</h2>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-arrow-path"
              variant="ghost"
              :size="isMobile ? 'sm' : 'md'"
              @click="handleRandomPreset"
            >
              Random
            </UButton>
            <UButton
              :icon="presetStore.cycleEnabled ? 'i-heroicons-pause' : 'i-heroicons-play'"
              variant="ghost"
              :size="isMobile ? 'sm' : 'md'"
              @click="handleToggleCycle"
            >
              <span class="hidden sm:inline">{{ presetStore.cycleEnabled ? 'Stop cycle' : 'Auto-cycle' }}</span>
              <span class="sm:hidden">{{ presetStore.cycleEnabled ? 'Stop' : 'Cycle' }}</span>
            </UButton>
          </div>
        </div>

        <PresetGrid />
      </div>
    </div>

    <!-- Keyboard shortcuts help (desktop only) -->
    <div
      v-if="audioStore.isCapturing && presetStore.activePreset && !isUIHidden && !isMobile"
      class="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur rounded-lg px-4 py-3 text-sm text-gray-300 space-y-1 transition-opacity duration-300 z-50"
    >
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">F</kbd> Fullscreen</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">Space</kbd> Pause</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">←</kbd> <kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">→</kbd> Switch preset</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">R</kbd> Random</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">C</kbd> Toggle cycle</div>
      <div><kbd class="inline-block px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-xs">H</kbd> Hide UI</div>
    </div>

    <!-- Mobile/Tablet controls -->
    <div
      v-if="audioStore.isCapturing && presetStore.activePreset && !isUIHidden && isMobile"
      class="mobile-controls fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md rounded-full transition-all duration-300 z-50 flex items-center shadow-lg border border-gray-700/50"
      :class="{
        'px-3 py-2 gap-1.5': isTablet,
        'px-2.5 py-2 gap-1': !isTablet
      }"
    >
      <UButton
        icon="i-heroicons-chevron-left"
        :size="isTablet ? 'sm' : 'xs'"
        variant="ghost"
        class="rounded-full"
        :class="isTablet ? 'w-9 h-9' : 'w-8 h-8'"
        @click="presetStore.previousPreset()"
      />
      <UButton
        :icon="presetStore.isPaused ? 'i-heroicons-play' : 'i-heroicons-pause'"
        :size="isTablet ? 'sm' : 'xs'"
        variant="ghost"
        class="rounded-full"
        :class="isTablet ? 'w-9 h-9' : 'w-8 h-8'"
        @click="presetStore.togglePause()"
      />
      <UButton
        icon="i-heroicons-arrow-path"
        :size="isTablet ? 'sm' : 'xs'"
        variant="ghost"
        class="rounded-full"
        :class="isTablet ? 'w-9 h-9' : 'w-8 h-8'"
        @click="handleRandomPreset"
      />
      <UButton
        :icon="presetStore.cycleEnabled ? 'i-heroicons-stop' : 'i-heroicons-play-circle'"
        :size="isTablet ? 'sm' : 'xs'"
        variant="ghost"
        class="rounded-full"
        :class="isTablet ? 'w-9 h-9' : 'w-8 h-8'"
        @click="handleToggleCycle"
      />
      <UButton
        icon="i-heroicons-chevron-right"
        :size="isTablet ? 'sm' : 'xs'"
        variant="ghost"
        class="rounded-full"
        :class="isTablet ? 'w-9 h-9' : 'w-8 h-8'"
        @click="presetStore.nextPreset()"
      />
    </div>

    <!-- Mobile hints -->
    <div
      v-if="audioStore.isCapturing && presetStore.activePreset && !isUIHidden && isMobile && showMobileHints"
      class="mobile-hints fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-md rounded-lg px-6 py-4 text-center z-50 animate-pulse border border-gray-700/50"
    >
      <div class="space-y-3">
        <p class="text-sm text-gray-300">📱 Touch Controls</p>
        <div class="text-xs text-gray-400 space-y-1">
          <p>• Tap screen to hide/show UI</p>
          <p>• Swipe left/right to change presets</p>
          <p>• Use bottom controls for playback</p>
        </div>
        <UButton
          size="xs"
          variant="ghost"
          @click="showMobileHints = false"
        >
          Got it
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen, useBreakpoints, breakpointsTailwind, useSwipe } from '@vueuse/core'

const audioStore = useAudioStore()
const presetStore = usePresetStore()
const toast = useToast()

// PWA functionality
const { isInstallable, isInstalled, install } = usePWAInstall()

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
const isUIHidden = ref(false)
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg') // Include tablets in mobile experience
const isTablet = breakpoints.between('md', 'lg')
const showMobileHints = ref(false)

// Show mobile hints on first use
onMounted(() => {
  if (isMobile.value) {
    const hasSeenHints = localStorage.getItem('mobile-hints-seen')
    if (!hasSeenHints) {
      setTimeout(() => {
        if (audioStore.isCapturing && presetStore.activePreset) {
          showMobileHints.value = true
          setTimeout(() => {
            showMobileHints.value = false
            localStorage.setItem('mobile-hints-seen', 'true')
          }, 8000)
        }
      }, 2000)
    }
  }
})

// Tap to hide UI for mobile and tablets
function handleVisualizationTap(event: MouseEvent) {
  if (!isMobile.value || !audioStore.isCapturing || !presetStore.activePreset) return
  
  // Only hide UI if tapping on the visualization area (not on controls)
  const target = event.target as HTMLElement
  if (target.closest('.mobile-controls') || target.closest('.mobile-hints')) return
  
  isUIHidden.value = !isUIHidden.value
  showMobileHints.value = false
}

// Swipe gestures for mobile
const visualizerContainer = ref<HTMLElement | null>(null)
const { direction } = useSwipe(visualizerContainer, {
  threshold: 50,
  onSwipe() {
    if (!audioStore.isCapturing || !presetStore.activePreset) return
    
    if (direction.value === 'left') {
      presetStore.nextPreset()
      showMobileHints.value = false
    } else if (direction.value === 'right') {
      presetStore.previousPreset()
      showMobileHints.value = false
    }
  }
})

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

