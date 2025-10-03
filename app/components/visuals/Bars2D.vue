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

// Lower DPR for better performance on high-res displays
const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
let ctx: CanvasRenderingContext2D | null = null

function resize() {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  canvas.value.width = Math.floor(rect.width * dpr)
  canvas.value.height = Math.floor(rect.height * dpr)
  // Cache context
  ctx = canvas.value.getContext('2d', { 
    alpha: false,
    desynchronized: true // Better performance for animations
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

  // Background - Use clearRect for better performance
  ctx.fillStyle = '#0b0f1a'
  ctx.fillRect(0, 0, W, H)

  // Bars (reduced from 96 for better performance)
  const bins = 64
  const step = Math.floor(data.length / bins)
  const barW = (W / bins) * 0.8
  const gap = (W / bins) * 0.2

  for (let i = 0; i < bins; i++) {
    // Average within step for smoother bars
    let sum = 0
    for (let j = 0; j < step; j++) {
      sum += data[i * step + j] || 0
    }
    const v = sum / step
    const h = (v / 255) * (H * 0.9)
    const x = i * (W / bins) + gap / 2
    const y = H - h

    // Color gradient based on frequency (low = blue, high = purple)
    const hue = 220 + (i / bins) * 100
    const lightness = 50 + (v / 255) * 20
    ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`
    ctx.fillRect(x, y, barW, h)
  }
})
</script>

