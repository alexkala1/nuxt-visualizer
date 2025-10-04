<template>
  <div class="w-full h-full">
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

// Render loop - Performance optimized
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getTimeDomainData()
  if (!data) return
  const W = el.width
  const H = el.height

  // Background with fade
  ctx.fillStyle = 'rgba(11, 15, 26, 0.1)'
  ctx.fillRect(0, 0, W, H)

  // Waveform
  ctx.beginPath()
  ctx.lineWidth = 2 * dpr
  ctx.strokeStyle = '#60a5fa' // blue-400

  const sliceWidth = W / data.length
  let x = 0

  for (let i = 0; i < data.length; i++) {
    const v = data[i] / 128.0 // 0-2
    const y = (v * H) / 2

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }

    x += sliceWidth
  }

  ctx.stroke()

  // Mirror waveform
  ctx.save()
  ctx.globalAlpha = 0.5
  ctx.scale(1, -1)
  ctx.translate(0, -H)
  ctx.strokeStyle = '#a78bfa' // purple-400
  
  ctx.beginPath()
  x = 0
  for (let i = 0; i < data.length; i++) {
    const v = data[i] / 128.0
    const y = (v * H) / 2

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }

    x += sliceWidth
  }
  ctx.stroke()
  ctx.restore()
})
</script>

