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

let barHeights: number[] = []
let rotation = 0

// WMP Battery-style circular frequency analyzer with smooth animations
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return

  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Background with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.fillRect(0, 0, W, H)

  // Slow rotation for visual interest
  rotation += 0.002

  // Battery segments
  const segments = 64
  const step = Math.floor(data.length / segments)
  const innerRadius = Math.min(W, H) * 0.15
  const maxBarLength = Math.min(W, H) * 0.38

  // Initialize bar heights array
  if (barHeights.length !== segments) {
    barHeights = new Array(segments).fill(0)
  }

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(rotation)

  // Draw segments (battery cells) with smooth interpolation
  for (let i = 0; i < segments; i++) {
    // Average frequency data
    let sum = 0
    for (let j = 0; j < step; j++) {
      sum += data[i * step + j] || 0
    }
    const targetIntensity = sum / step / 255
    
    // Smooth interpolation for animations
    barHeights[i] = barHeights[i] + (targetIntensity - barHeights[i]) * 0.25
    const intensity = barHeights[i]
    const barLength = intensity * maxBarLength

    const angle = (i / segments) * Math.PI * 2

    // Color based on intensity with better gradients
    let r, g, b
    if (intensity < 0.4) {
      // Green to cyan
      r = 0
      g = 255
      b = Math.floor(intensity * 255 * 2.5)
    } else if (intensity < 0.7) {
      // Cyan to yellow
      const t = (intensity - 0.4) / 0.3
      r = Math.floor(t * 255)
      g = 255
      b = Math.floor((1 - t) * 255)
    } else {
      // Yellow to red
      const t = (intensity - 0.7) / 0.3
      r = 255
      g = Math.floor((1 - t) * 255)
      b = 0
    }

    ctx.save()
    ctx.rotate(angle)

    const barWidth = Math.max(3, Math.min(W, H) * 0.012)
    
    // Gradient for each bar
    const gradient = ctx.createLinearGradient(0, innerRadius, 0, innerRadius + barLength)
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`)
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`)
    
    // Draw bar with rounded caps
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(-barWidth / 2, innerRadius, barWidth, barLength, barWidth / 2)
    ctx.fill()
    
    // Enhanced glow effect
    ctx.shadowBlur = 20 * dpr
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Peak dot
    if (intensity > 0.3) {
      const peakY = innerRadius + barLength + 5
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
      ctx.beginPath()
      ctx.arc(0, peakY, barWidth * 0.6, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.shadowBlur = 15 * dpr
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`
      ctx.fill()
      ctx.shadowBlur = 0
    }
    
    ctx.restore()
  }

  ctx.restore()

  // Center circle with gradient
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius)
  gradient.addColorStop(0, 'rgba(20, 25, 35, 1)')
  gradient.addColorStop(0.7, 'rgba(10, 15, 25, 1)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
  ctx.fill()

  // Center ring
  ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)'
  ctx.lineWidth = 2 * dpr
  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius * 0.9, 0, Math.PI * 2)
  ctx.stroke()

  // Average level indicator in center
  const avgLevel = audioStore.levels.rms
  const levelText = Math.floor(avgLevel * 100) + '%'
  
  // Color based on level
  let textColor
  if (avgLevel > 0.7) textColor = '#ff4444'
  else if (avgLevel > 0.4) textColor = '#ffff44'
  else textColor = '#44ff88'
  
  ctx.fillStyle = textColor
  ctx.font = `bold ${innerRadius * 0.45}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowBlur = 10 * dpr
  ctx.shadowColor = textColor
  ctx.fillText(levelText, centerX, centerY)
  ctx.shadowBlur = 0
  
  // Sub-label
  ctx.fillStyle = 'rgba(150, 170, 200, 0.8)'
  ctx.font = `${innerRadius * 0.15}px sans-serif`
  ctx.fillText('LEVEL', centerX, centerY + innerRadius * 0.35)
})
</script>

