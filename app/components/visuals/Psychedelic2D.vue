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
let rotation = 0

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

// WMP Psychedelia-style kaleidoscope visualization
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return

  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  ctx.fillRect(0, 0, W, H)

  // Rotation based on mid frequencies
  rotation += (0.005 + audioStore.levels.mid * 0.02)

  // Kaleidoscope mirrors
  const mirrors = 8
  const segments = 32

  for (let m = 0; m < mirrors; m++) {
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((m / mirrors) * Math.PI * 2 + rotation)

    // Draw frequency patterns
    for (let i = 0; i < segments; i++) {
      const freqIdx = Math.floor((i / segments) * data.length)
      const intensity = data[freqIdx] / 255
      const radius = 50 + i * 8 + intensity * 50

      // Color cycling based on frequency and time
      const hue = ((i / segments) * 360 + Date.now() * 0.1) % 360
      const saturation = 80 + intensity * 20
      const lightness = 40 + intensity * 40

      // Multiple circles for kaleidoscope effect
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.6 + intensity * 0.4})`
      
      // Draw symmetric points
      ctx.beginPath()
      ctx.arc(radius, 0, 3 + intensity * 8, 0, Math.PI * 2)
      ctx.fill()

      // Mirror effect
      ctx.beginPath()
      ctx.arc(radius, 0, 3 + intensity * 8, 0, Math.PI * 2)
      ctx.scale(1, -1)
      ctx.fill()
      ctx.scale(1, -1)

      // Glow
      ctx.shadowBlur = 10 + intensity * 20
      ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      ctx.fill()
    }

    ctx.restore()
  }

  // Center orb
  const bassIntensity = audioStore.levels.bass
  const orbRadius = 20 + bassIntensity * 40
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, orbRadius)
  gradient.addColorStop(0, `hsla(${Date.now() * 0.1 % 360}, 100%, 70%, 1)`)
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2)
  ctx.fill()
})
</script>

