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
  
  time += 0.02
  
  // Dark gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#0a0a15')
  grad.addColorStop(1, '#1a0a20')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  
  // Draw multiple flowing waves
  const numWaves = 5
  const points = 100
  
  for (let wave = 0; wave < numWaves; wave++) {
    ctx.beginPath()
    
    const baseY = (H / (numWaves + 1)) * (wave + 1)
    const hue = (wave / numWaves) * 260 + 180
    const phaseOffset = wave * 0.5
    
    for (let i = 0; i <= points; i++) {
      const x = (W / points) * i
      const dataIndex = Math.floor((i / points) * data.length)
      const value = data[dataIndex] / 255
      
      const waveOffset = Math.sin(i * 0.05 + time + phaseOffset) * 30
      const audioOffset = value * 80
      const y = baseY + waveOffset + audioOffset
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    
    // Neon glow effect
    ctx.strokeStyle = `hsla(${hue}, 90%, 60%, 0.8)`
    ctx.lineWidth = 3
    ctx.shadowBlur = 25
    ctx.shadowColor = `hsl(${hue}, 90%, 60%)`
    ctx.stroke()
    
    // Inner bright line
    ctx.strokeStyle = `hsla(${hue}, 90%, 80%, 1)`
    ctx.lineWidth = 1
    ctx.shadowBlur = 15
    ctx.stroke()
  }
})
</script>

