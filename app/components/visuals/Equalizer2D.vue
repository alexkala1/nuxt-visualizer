<template>
  <div class="w-full h-full absolute inset-0">
    <canvas ref="canvas" class="w-full h-full block" />
  </div>
</template>

<script setup lang="ts">
import { useRafFn } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
const { getFrequencyData } = useAnalyser()
const audioStore = useAudioStore()

const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
let ctx: CanvasRenderingContext2D | null = null
let barHeights: number[] = []
let peakHeights: number[] = []
let peakHoldTime: number[] = []

function resize() {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  
  // Validate dimensions (fix for mobile orientation change)
  if (rect.width === 0 || rect.height === 0) return
  
  canvas.value.width = Math.floor(rect.width * dpr)
  canvas.value.height = Math.floor(rect.height * dpr)
  ctx = canvas.value.getContext('2d', { 
    alpha: false,
    desynchronized: true
  })
}

onMounted(() => {
  resize()
})

// Use the improved resize handler for mobile
useVisualizerResize(resize)

// Modern equalizer with peak indicators and smooth animations
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return

  const W = el.width
  const H = el.height

  // Background with subtle gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, H)
  bgGradient.addColorStop(0, '#0a0f1a')
  bgGradient.addColorStop(1, '#050810')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, W, H)

  // Equalizer bars
  const bins = 48
  const step = Math.floor(data.length / bins)
  const barWidth = W / bins
  const spacing = barWidth * 0.15
  const actualBarWidth = barWidth - spacing

  // Initialize arrays
  if (barHeights.length !== bins) {
    barHeights = new Array(bins).fill(0)
    peakHeights = new Array(bins).fill(0)
    peakHoldTime = new Array(bins).fill(0)
  }

  // Draw bars and peaks
  for (let i = 0; i < bins; i++) {
    // Average frequency data
    let sum = 0
    for (let j = 0; j < step; j++) {
      sum += data[i * step + j] || 0
    }
    const targetHeight = (sum / step / 255) * (H * 0.85)
    
    // Smooth interpolation for bar animation
    barHeights[i] = barHeights[i] + (targetHeight - barHeights[i]) * 0.3
    const barHeight = barHeights[i]

    // Peak hold logic
    if (barHeight >= peakHeights[i]) {
      peakHeights[i] = barHeight
      peakHoldTime[i] = 30 // Hold for 30 frames
    } else if (peakHoldTime[i] > 0) {
      peakHoldTime[i]--
    } else {
      peakHeights[i] = Math.max(peakHeights[i] - 2, barHeight)
    }

    const x = i * barWidth + spacing / 2
    const y = H - barHeight

    // Bar gradient (frequency-based color)
    const gradient = ctx.createLinearGradient(x, H, x, y)
    
    // Low frequencies = red/orange, mid = green/yellow, high = blue/purple
    let hue
    if (i < bins * 0.33) {
      hue = 0 + (i / (bins * 0.33)) * 60 // Red to yellow
    } else if (i < bins * 0.66) {
      hue = 60 + ((i - bins * 0.33) / (bins * 0.33)) * 120 // Yellow to cyan
    } else {
      hue = 180 + ((i - bins * 0.66) / (bins * 0.34)) * 90 // Cyan to purple
    }

    gradient.addColorStop(0, `hsl(${hue}, 85%, 55%)`)
    gradient.addColorStop(0.5, `hsl(${hue}, 90%, 60%)`)
    gradient.addColorStop(1, `hsl(${hue}, 95%, 70%)`)

    // Draw bar with rounded top
    ctx.fillStyle = gradient
    ctx.beginPath()
    const radius = Math.min(actualBarWidth / 2, 5 * dpr)
    ctx.roundRect(x, y, actualBarWidth, barHeight, [radius, radius, 0, 0])
    ctx.fill()

    // Glow effect
    ctx.shadowBlur = 10 * dpr
    ctx.shadowColor = `hsl(${hue}, 90%, 60%)`
    ctx.fill()
    ctx.shadowBlur = 0

    // Reflection at bottom
    const reflectionGradient = ctx.createLinearGradient(x, H, x, H - 30 * dpr)
    reflectionGradient.addColorStop(0, `hsla(${hue}, 85%, 55%, 0.3)`)
    reflectionGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = reflectionGradient
    ctx.fillRect(x, H, actualBarWidth, -Math.min(barHeight * 0.3, 30 * dpr))

    // Peak indicator
    if (peakHeights[i] > 5) {
      const peakY = H - peakHeights[i]
      ctx.fillStyle = `hsl(${hue}, 100%, 80%)`
      ctx.shadowBlur = 8 * dpr
      ctx.shadowColor = `hsl(${hue}, 100%, 80%)`
      ctx.fillRect(x, peakY - 3 * dpr, actualBarWidth, 2 * dpr)
      ctx.shadowBlur = 0
    }
  }

  // Draw frequency labels
  ctx.fillStyle = 'rgba(150, 170, 200, 0.6)'
  ctx.font = `${10 * dpr}px sans-serif`
  ctx.textAlign = 'center'
  const labels = ['Bass', 'Low Mid', 'Mid', 'High Mid', 'Treble']
  labels.forEach((label, i) => {
    const x = ((i + 0.5) / labels.length) * W
    ctx.fillText(label, x, H - 5 * dpr)
  })

  // Draw level indicators
  const levels = [audioStore.levels.bass, audioStore.levels.mid, audioStore.levels.treble]
  const levelNames = ['B', 'M', 'T']
  const levelX = W - 40 * dpr
  
  levels.forEach((level, i) => {
    const y = 20 * dpr + i * 25 * dpr
    
    // Background
    ctx.fillStyle = 'rgba(30, 35, 45, 0.8)'
    ctx.fillRect(levelX, y, 35 * dpr, 15 * dpr)
    
    // Level bar
    const levelWidth = level * 30 * dpr
    const levelHue = level > 0.8 ? 0 : level > 0.5 ? 30 : 120
    ctx.fillStyle = `hsl(${levelHue}, 85%, 60%)`
    ctx.fillRect(levelX + 2.5 * dpr, y + 2.5 * dpr, levelWidth, 10 * dpr)
    
    // Label
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${9 * dpr}px sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(levelNames[i], levelX + 2.5 * dpr, y - 3 * dpr)
  })
})
</script>

