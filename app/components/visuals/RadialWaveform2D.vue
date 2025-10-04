<template>
  <div class="w-full h-full absolute inset-0">
    <canvas ref="canvas" class="w-full h-full block" />
  </div>
</template>

<script setup lang="ts">
import { useRafFn } from '@vueuse/core'

const canvas = ref<HTMLCanvasElement | null>(null)
const { getTimeDomainData } = useAnalyser()
const audioStore = useAudioStore()

const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
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

// Radial waveform - waveform drawn as radius from center
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getTimeDomainData()
  if (!data) return

  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Background with subtle gradient
  const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(W, H) / 2)
  bgGradient.addColorStop(0, '#0a0e1a')
  bgGradient.addColorStop(1, '#050810')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, W, H)

  const baseRadius = Math.min(W, H) * 0.2
  const maxAmplitude = Math.min(W, H) * 0.3

  // Draw multiple layers with different colors
  const layers = 3
  
  for (let layer = 0; layer < layers; layer++) {
    ctx.beginPath()
    
    const layerOffset = layer * Math.floor(data.length / layers)
    const hue = (120 + layer * 120 + Date.now() * 0.05) % 360
    
    for (let i = 0; i < data.length; i += 1) {
      const angle = (i / data.length) * Math.PI * 2
      const dataIndex = (i + layerOffset) % data.length
      const value = ((data[dataIndex] || 128) - 128) / 128
      const amplitude = value * maxAmplitude * (1 + audioStore.levels.bass * 0.5)
      const radius = baseRadius + amplitude + (layer * 15)

      const x = centerX + Math.cos(angle - Math.PI / 2) * radius
      const y = centerY + Math.sin(angle - Math.PI / 2) * radius

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()

    // Fill with gradient
    const fillGradient = ctx.createRadialGradient(centerX, centerY, baseRadius, centerX, centerY, baseRadius + maxAmplitude)
    fillGradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.15)`)
    fillGradient.addColorStop(1, `hsla(${hue}, 80%, 40%, 0.05)`)
    ctx.fillStyle = fillGradient
    ctx.fill()

    // Stroke with glow
    ctx.strokeStyle = `hsl(${hue}, 85%, 65%)`
    ctx.lineWidth = (2 + layer * 0.5) * dpr
    ctx.lineJoin = 'round'
    ctx.shadowBlur = 15 * dpr
    ctx.shadowColor = `hsl(${hue}, 85%, 65%)`
    ctx.stroke()

    // Inner glow
    ctx.strokeStyle = `hsla(${hue}, 95%, 80%, 0.6)`
    ctx.lineWidth = 1 * dpr
    ctx.shadowBlur = 5 * dpr
    ctx.stroke()
  }

  ctx.shadowBlur = 0

  // Center circle
  const centerRadius = baseRadius * 0.5
  const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius)
  const centerHue = (Date.now() * 0.1) % 360
  centerGradient.addColorStop(0, `hsl(${centerHue}, 100%, 70%)`)
  centerGradient.addColorStop(0.6, `hsl(${centerHue}, 90%, 50%)`)
  centerGradient.addColorStop(1, `hsl(${centerHue}, 80%, 30%)`)
  
  ctx.fillStyle = centerGradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, centerRadius * (0.8 + audioStore.levels.bass * 0.4), 0, Math.PI * 2)
  ctx.fill()

  // Center ring
  ctx.strokeStyle = `hsla(${centerHue}, 100%, 80%, 0.8)`
  ctx.lineWidth = 2 * dpr
  ctx.shadowBlur = 10 * dpr
  ctx.shadowColor = `hsl(${centerHue}, 100%, 80%)`
  ctx.stroke()
  ctx.shadowBlur = 0
})
</script>

