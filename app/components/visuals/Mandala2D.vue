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

// Mandala/Flower pattern with frequency-reactive petals
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return

  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Background with radial gradient
  const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(W, H) / 2)
  bgGradient.addColorStop(0, '#1a0a2e')
  bgGradient.addColorStop(1, '#0a0515')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, W, H)

  // Slow rotation
  rotation += 0.002 + audioStore.levels.bass * 0.01

  // Draw multiple mandala layers
  const layers = 5
  const petalsPerLayer = [6, 8, 12, 16, 24]

  for (let layer = 0; layer < layers; layer++) {
    const petals = petalsPerLayer[layer]
    const baseRadius = (layer + 1) * Math.min(W, H) * 0.08
    const maxPetalSize = Math.min(W, H) * 0.06

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation * (layer % 2 === 0 ? 1 : -1))

    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2
      
      // Get frequency data for this petal
      const freqIndex = Math.floor((i / petals) * data.length)
      const intensity = data[freqIndex] / 255

      // Petal size based on frequency
      const petalSize = maxPetalSize * (0.4 + intensity * 0.6)
      
      // Color based on layer and frequency
      const hue = (layer * 72 + i * (360 / petals) + Date.now() * 0.05) % 360
      const saturation = 70 + intensity * 30
      const lightness = 50 + intensity * 20

      ctx.save()
      ctx.rotate(angle)
      ctx.translate(baseRadius, 0)

      // Draw petal shape
      ctx.beginPath()
      
      // Petal as a teardrop/leaf shape
      const petalWidth = petalSize * 0.6
      const petalHeight = petalSize * 1.2
      
      // Use bezier curves for organic petal shape
      ctx.moveTo(0, -petalHeight / 2)
      ctx.bezierCurveTo(
        petalWidth / 2, -petalHeight / 3,
        petalWidth / 2, petalHeight / 3,
        0, petalHeight / 2
      )
      ctx.bezierCurveTo(
        -petalWidth / 2, petalHeight / 3,
        -petalWidth / 2, -petalHeight / 3,
        0, -petalHeight / 2
      )
      ctx.closePath()

      // Fill with gradient
      const petalGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petalSize)
      petalGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 15}%, 0.9)`)
      petalGradient.addColorStop(0.6, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`)
      petalGradient.addColorStop(1, `hsla(${hue}, ${saturation - 20}%, ${lightness - 15}%, 0.4)`)
      
      ctx.fillStyle = petalGradient
      ctx.fill()

      // Outline with glow
      ctx.strokeStyle = `hsla(${hue}, ${saturation + 10}%, ${lightness + 20}%, ${0.6 + intensity * 0.4})`
      ctx.lineWidth = 1.5 * dpr
      ctx.shadowBlur = 8 * dpr
      ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      ctx.stroke()

      // Inner detail line
      if (intensity > 0.3) {
        ctx.strokeStyle = `hsla(${(hue + 180) % 360}, 90%, 80%, 0.5)`
        ctx.lineWidth = 0.5 * dpr
        ctx.shadowBlur = 4 * dpr
        ctx.beginPath()
        ctx.moveTo(0, -petalHeight / 2)
        ctx.lineTo(0, petalHeight / 2)
        ctx.stroke()
      }

      ctx.restore()
    }

    ctx.restore()

    // Draw connecting circle for this layer
    ctx.strokeStyle = `hsla(${layer * 72 + Date.now() * 0.05}, 75%, 60%, 0.3)`
    ctx.lineWidth = 1 * dpr
    ctx.shadowBlur = 5 * dpr
    ctx.shadowColor = `hsl(${layer * 72}, 75%, 60%)`
    ctx.beginPath()
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.shadowBlur = 0

  // Central core with pulsing effect
  const coreRadius = Math.min(W, H) * 0.04 * (1 + audioStore.levels.bass * 0.5)
  const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius)
  const coreHue = (Date.now() * 0.1) % 360
  
  coreGradient.addColorStop(0, `hsl(${coreHue}, 100%, 80%)`)
  coreGradient.addColorStop(0.4, `hsl(${coreHue}, 90%, 65%)`)
  coreGradient.addColorStop(0.8, `hsl(${coreHue}, 80%, 50%)`)
  coreGradient.addColorStop(1, `hsl(${coreHue}, 70%, 30%)`)
  
  ctx.fillStyle = coreGradient
  ctx.shadowBlur = 20 * dpr
  ctx.shadowColor = `hsl(${coreHue}, 100%, 70%)`
  ctx.beginPath()
  ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
  ctx.fill()

  // Outer ring on core
  ctx.strokeStyle = `hsla(${coreHue}, 100%, 90%, 0.8)`
  ctx.lineWidth = 2 * dpr
  ctx.shadowBlur = 15 * dpr
  ctx.stroke()
  
  ctx.shadowBlur = 0
})
</script>

