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
  
  // Dark background
  ctx.fillStyle = '#050508'
  ctx.fillRect(0, 0, W, H)
  
  // Grid parameters
  const cols = 20
  const rows = 15
  const cellW = W / cols
  const cellH = H / rows
  
  // Draw pulsing grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const dataIndex = Math.floor(((i * cols + j) / (rows * cols)) * data.length)
      const value = data[dataIndex] / 255
      
      const x = j * cellW + cellW / 2
      const y = i * cellH + cellH / 2
      
      const size = Math.max(5, value * cellW * 0.8)
      
      // Color gradient based on position and value
      const hue = (j / cols) * 180 + 180
      const lightness = 40 + value * 40
      
      ctx.fillStyle = `hsla(${hue}, 80%, ${lightness}%, ${0.6 + value * 0.4})`
      ctx.shadowBlur = 15 + value * 20
      ctx.shadowColor = `hsl(${hue}, 80%, ${lightness}%)`
      
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Connection lines
      if (j < cols - 1 && value > 0.2) {
        ctx.strokeStyle = `hsla(${hue}, 70%, ${lightness - 10}%, ${value * 0.3})`
        ctx.lineWidth = 1 + value * 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + cellW, y)
        ctx.stroke()
      }
    }
  }
})
</script>

