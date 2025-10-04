<template>
  <div class="w-full h-full">
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
let time = 0

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

useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return
  
  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2
  
  time += 0.01
  
  // Dark background with fade
  ctx.fillStyle = 'rgba(8, 10, 18, 0.15)'
  ctx.fillRect(0, 0, W, H)
  
  // Draw multiple concentric rings
  const numRings = 12
  const maxRadius = Math.min(W, H) * 0.45
  
  for (let i = 0; i < numRings; i++) {
    const ringIndex = Math.floor((i / numRings) * data.length)
    const value = data[ringIndex] / 255
    const baseRadius = (maxRadius / numRings) * (i + 1)
    const radius = baseRadius + value * 50
    
    // Color based on frequency (rainbow neon)
    const hue = (i / numRings) * 360 + time * 20
    const saturation = 85 + value * 15
    const lightness = 50 + value * 20
    
    // Outer glow
    ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.3 + value * 0.3})`
    ctx.lineWidth = 15 + value * 10
    ctx.shadowBlur = 30 + value * 20
    ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()
    
    // Inner bright line
    ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${0.8 + value * 0.2})`
    ctx.lineWidth = 2 + value * 3
    ctx.shadowBlur = 15 + value * 10
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()
  }
  
  // Center pulse
  const bassAvg = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255
  ctx.fillStyle = `hsla(${time * 30}, 90%, 70%, ${0.3 + bassAvg * 0.5})`
  ctx.shadowBlur = 40 + bassAvg * 40
  ctx.shadowColor = `hsl(${time * 30}, 90%, 70%)`
  ctx.beginPath()
  ctx.arc(centerX, centerY, 20 + bassAvg * 40, 0, Math.PI * 2)
  ctx.fill()
})
</script>
