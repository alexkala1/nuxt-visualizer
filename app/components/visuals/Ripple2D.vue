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
const ripples: Array<{ radius: number; maxRadius: number; intensity: number }> = []
let ctx: CanvasRenderingContext2D | null = null

function resize() {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  canvas.value.width = Math.floor(rect.width * dpr)
  canvas.value.height = Math.floor(rect.height * dpr)
  ctx = canvas.value.getContext('2d', { 
    alpha: false,
    desynchronized: true
  })
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

// Render loop - Performance optimized
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return

  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Background fade
  ctx.fillStyle = 'rgba(11, 15, 26, 0.1)'
  ctx.fillRect(0, 0, W, H)

  // Calculate average bass intensity
  let bassSum = 0
  for (let i = 0; i < 20; i++) {
    bassSum += data[i]
  }
  const bassLevel = bassSum / 20 / 255

  // Create new ripple on bass hits (limit max ripples)
  if (bassLevel > 0.5 && ripples.length < 8 && (ripples.length === 0 || ripples[ripples.length - 1].radius > 20)) {
    ripples.push({
      radius: 0,
      maxRadius: Math.min(W, H) * 0.8,
      intensity: bassLevel
    })
  }

  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i]
    ripple.radius += 3

    if (ripple.radius > ripple.maxRadius) {
      ripples.splice(i, 1)
      continue
    }

    const alpha = (1 - ripple.radius / ripple.maxRadius) * ripple.intensity
    const hue = (ripple.radius / ripple.maxRadius) * 180 + 180

    // Draw concentric circles (reduced from 3 to 2 for performance)
    for (let j = 0; j < 2; j++) {
      ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha / (j + 1)})`
      ctx.lineWidth = (4 - j) * dpr
      ctx.beginPath()
      ctx.arc(centerX, centerY, ripple.radius + j * 2, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  // Draw frequency particles around center (reduced from 64)
  const particleCount = 48
  const baseRadius = Math.min(W, H) * 0.1
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    const freqIdx = Math.floor((i / particleCount) * data.length)
    const intensity = data[freqIdx] / 255
    
    const radius = baseRadius + intensity * 50
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    const hue = (i / particleCount) * 360
    ctx.fillStyle = `hsl(${hue}, 80%, ${50 + intensity * 30}%)`
    ctx.beginPath()
    ctx.arc(x, y, 2 + intensity * 3, 0, Math.PI * 2)
    ctx.fill()
  }
})
</script>

