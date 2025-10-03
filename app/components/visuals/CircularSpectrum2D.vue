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

  // Background with trail effect
  ctx.fillStyle = 'rgba(11, 15, 26, 0.15)'
  ctx.fillRect(0, 0, W, H)

  // Circular spectrum (reduced for performance)
  const bins = 96
  const step = Math.floor(data.length / bins)
  const radius = Math.min(W, H) * 0.2
  const maxBarLength = Math.min(W, H) * 0.35

  for (let i = 0; i < bins; i++) {
    let sum = 0
    for (let j = 0; j < step; j++) {
      sum += data[i * step + j] || 0
    }
    const v = sum / step / 255
    const barLength = v * maxBarLength

    const angle = (i / bins) * Math.PI * 2 - Math.PI / 2
    const x1 = centerX + Math.cos(angle) * radius
    const y1 = centerY + Math.sin(angle) * radius
    const x2 = centerX + Math.cos(angle) * (radius + barLength)
    const y2 = centerY + Math.sin(angle) * (radius + barLength)

    // Rainbow gradient
    const hue = (i / bins) * 360
    const lightness = 50 + v * 30
    
    ctx.strokeStyle = `hsl(${hue}, 80%, ${lightness}%)`
    ctx.lineWidth = (W / bins) * 0.6 * dpr
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // Center circle
  ctx.fillStyle = 'rgba(100, 100, 200, 0.3)'
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2)
  ctx.fill()
})
</script>

