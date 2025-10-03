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

// Render loop - Performance optimized
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getTimeDomainData()
  if (!data) return
  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Background
  ctx.fillStyle = '#0b0f1a'
  ctx.fillRect(0, 0, W, H)

  // Oscilloscope circles
  const radius = Math.min(W, H) * 0.3
  const numCircles = 3

  for (let c = 0; c < numCircles; c++) {
    ctx.beginPath()
    const circleRadius = radius * (1 + c * 0.2)
    const offset = c * 256 / numCircles

    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2
      const v = ((data[(i + offset) % data.length] || 128) - 128) / 128
      const r = circleRadius + v * 30

      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    
    // Color based on circle
    const hue = (c * 120 + Date.now() * 0.05) % 360
    ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`
    ctx.lineWidth = 2 * dpr
    ctx.stroke()

    // Glow effect
    ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.3)`
    ctx.lineWidth = 6 * dpr
    ctx.stroke()
  }
})
</script>

