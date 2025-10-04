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

let rotation = 0
let history: number[][] = []
const maxHistory = 5

// Render loop - Performance optimized with improvements
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getTimeDomainData()
  if (!data) return
  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Trail effect for smoother animation
  ctx.fillStyle = 'rgba(11, 15, 26, 0.15)'
  ctx.fillRect(0, 0, W, H)

  // Add current data to history
  history.push([...data])
  if (history.length > maxHistory) history.shift()

  // Slight rotation based on audio
  rotation += audioStore.levels.mid * 0.01

  // Oscilloscope circles with improvements
  const radius = Math.min(W, H) * 0.28
  const numCircles = 4

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(rotation)
  ctx.translate(-centerX, -centerY)

  for (let c = 0; c < numCircles; c++) {
    // Use historical data for trailing effect
    const dataIndex = Math.min(c, history.length - 1)
    const circleData = history[dataIndex] || data
    
    ctx.beginPath()
    const circleRadius = radius * (0.8 + c * 0.25)
    const offset = c * Math.floor(data.length / numCircles)

    for (let i = 0; i < circleData.length; i += 2) { // Skip every other for performance
      const angle = (i / circleData.length) * Math.PI * 2
      const v = ((circleData[(i + offset) % circleData.length] || 128) - 128) / 128
      const amplification = 1 + audioStore.levels.bass * 0.5
      const r = circleRadius + v * 40 * amplification

      const x = centerX + Math.cos(angle) * r
      const y = centerY + Math.sin(angle) * r

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    
    // Color based on circle and frequency
    const hue = (c * 90 + Date.now() * 0.03 + audioStore.levels.treble * 60) % 360
    const alpha = 1 - (c * 0.15)
    
    // Main line
    ctx.strokeStyle = `hsla(${hue}, 75%, 65%, ${alpha})`
    ctx.lineWidth = 2.5 * dpr
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.stroke()

    // Outer glow
    ctx.shadowBlur = 12 * dpr
    ctx.shadowColor = `hsl(${hue}, 80%, 60%)`
    ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${alpha * 0.4})`
    ctx.lineWidth = 5 * dpr
    ctx.stroke()
    ctx.shadowBlur = 0

    // Inner glow
    ctx.strokeStyle = `hsla(${hue}, 90%, 80%, ${alpha * 0.3})`
    ctx.lineWidth = 1 * dpr
    ctx.stroke()
  }

  ctx.restore()

  // Center pulse
  const bassIntensity = audioStore.levels.bass
  const pulseRadius = 15 + bassIntensity * 35
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius)
  gradient.addColorStop(0, `hsla(${Date.now() * 0.1 % 360}, 100%, 80%, 0.8)`)
  gradient.addColorStop(0.5, `hsla(${Date.now() * 0.1 % 360}, 100%, 60%, 0.4)`)
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
  ctx.fill()
})
</script>

