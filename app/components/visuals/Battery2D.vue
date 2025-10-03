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

// WMP Battery-style circular frequency analyzer
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return

  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Background
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, W, H)

  // Battery segments
  const segments = 64
  const step = Math.floor(data.length / segments)
  const innerRadius = Math.min(W, H) * 0.15
  const maxBarLength = Math.min(W, H) * 0.35

  // Draw segments (battery cells)
  for (let i = 0; i < segments; i++) {
    // Average frequency data
    let sum = 0
    for (let j = 0; j < step; j++) {
      sum += data[i * step + j] || 0
    }
    const intensity = sum / step / 255
    const barLength = intensity * maxBarLength

    const angle = (i / segments) * Math.PI * 2 - Math.PI / 2
    const segmentWidth = (Math.PI * 2 / segments) * 0.8

    // Create gradient for each segment
    const x1 = centerX + Math.cos(angle) * innerRadius
    const y1 = centerY + Math.sin(angle) * innerRadius
    const x2 = centerX + Math.cos(angle) * (innerRadius + barLength)
    const y2 = centerY + Math.sin(angle) * (innerRadius + barLength)

    // Battery bar with glow
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angle + Math.PI / 2)

    // Color based on intensity (green when low, yellow, red when high)
    let color
    if (intensity < 0.33) {
      color = `rgba(0, 255, 100, ${0.6 + intensity})`
    } else if (intensity < 0.66) {
      color = `rgba(255, 255, 0, ${0.6 + intensity})`
    } else {
      color = `rgba(255, 50, 50, ${0.6 + intensity})`
    }

    // Draw bar with rounded cap
    const barWidth = (Math.min(W, H) * 0.01)
    ctx.fillStyle = color
    ctx.fillRect(-barWidth / 2, innerRadius, barWidth, barLength)
    
    // Glow effect
    ctx.shadowBlur = 15
    ctx.shadowColor = color
    ctx.fillRect(-barWidth / 2, innerRadius, barWidth, barLength)
    
    ctx.restore()
  }

  // Center circle
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius)
  gradient.addColorStop(0, 'rgba(20, 20, 40, 1)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
  ctx.fill()

  // Average level indicator in center
  const avgLevel = audioStore.levels.rms
  const levelText = Math.floor(avgLevel * 100) + '%'
  ctx.fillStyle = avgLevel > 0.7 ? '#ff3333' : avgLevel > 0.4 ? '#ffff00' : '#00ff66'
  ctx.font = `bold ${innerRadius * 0.4}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(levelText, centerX, centerY)
})
</script>

