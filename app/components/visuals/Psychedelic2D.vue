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
let rotation = 0
let secondaryRotation = 0
let particlePositions: Array<{x: number, y: number, age: number}> = []

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

// Enhanced WMP Psychedelia-style kaleidoscope visualization  
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return

  const W = el.width
  const H = el.height
  const centerX = W / 2
  const centerY = H / 2

  // Trail effect with varying opacity
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  ctx.fillRect(0, 0, W, H)

  // Dual rotation system for more complex patterns
  rotation += (0.005 + audioStore.levels.mid * 0.02)
  secondaryRotation -= (0.003 + audioStore.levels.treble * 0.015)

  // Primary kaleidoscope mirrors
  const mirrors = 12
  const segments = 40

  for (let m = 0; m < mirrors; m++) {
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((m / mirrors) * Math.PI * 2 + rotation)

    // Draw frequency patterns with enhanced effects
    for (let i = 0; i < segments; i++) {
      const freqIdx = Math.floor((i / segments) * data.length)
      const intensity = data[freqIdx] / 255
      const nextIntensity = data[Math.min(freqIdx + 1, data.length - 1)] / 255
      
      const baseRadius = 40 + i * 7
      const radius = baseRadius + intensity * 60

      // Enhanced color cycling
      const hue = ((i / segments) * 360 + Date.now() * 0.08 + m * 30) % 360
      const saturation = 85 + intensity * 15
      const lightness = 45 + intensity * 35

      // Main circle with gradient
      const circleSize = 2 + intensity * 10
      const gradient = ctx.createRadialGradient(radius, 0, 0, radius, 0, circleSize)
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 1)`)
      gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.7 + intensity * 0.3})`)
      
      ctx.fillStyle = gradient
      ctx.shadowBlur = 15 + intensity * 25
      ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      
      // Draw symmetric points
      ctx.beginPath()
      ctx.arc(radius, 0, circleSize, 0, Math.PI * 2)
      ctx.fill()

      // Connecting lines between high-intensity points
      if (intensity > 0.6 && nextIntensity > 0.6) {
        const nextRadius = 40 + (i + 1) * 7 + nextIntensity * 60
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`
        ctx.lineWidth = 1 + intensity * 2
        ctx.beginPath()
        ctx.moveTo(radius, 0)
        ctx.lineTo(nextRadius, 0)
        ctx.stroke()
      }

      // Additional smaller decorative circles
      if (intensity > 0.5) {
        ctx.fillStyle = `hsla(${(hue + 180) % 360}, ${saturation}%, ${lightness + 10}%, 0.6)`
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(radius, 0, circleSize * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }

  // Secondary layer with opposite rotation
  const secondaryMirrors = 6
  for (let m = 0; m < secondaryMirrors; m++) {
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((m / secondaryMirrors) * Math.PI * 2 + secondaryRotation)

    for (let i = 0; i < segments; i += 3) {
      const freqIdx = Math.floor((i / segments) * data.length)
      const intensity = data[freqIdx] / 255
      
      if (intensity > 0.4) {
        const radius = 60 + i * 8 + intensity * 40
        const hue = ((i / segments) * 360 + Date.now() * 0.12) % 360
        
        ctx.fillStyle = `hsla(${hue}, 90%, 65%, ${intensity * 0.3})`
        ctx.shadowBlur = 20
        ctx.shadowColor = `hsl(${hue}, 90%, 65%)`
        ctx.beginPath()
        ctx.arc(radius, 0, 4 + intensity * 6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }

  ctx.shadowBlur = 0

  // Enhanced center orb with pulsing rings
  const bassIntensity = audioStore.levels.bass
  const orbRadius = 25 + bassIntensity * 50
  
  // Multiple gradient rings
  for (let ring = 0; ring < 3; ring++) {
    const ringRadius = orbRadius * (1 + ring * 0.3)
    const gradient = ctx.createRadialGradient(centerX, centerY, ringRadius * 0.3, centerX, centerY, ringRadius)
    const hue = (Date.now() * 0.1 + ring * 120) % 360
    gradient.addColorStop(0, `hsla(${hue}, 100%, 75%, ${0.8 - ring * 0.2})`)
    gradient.addColorStop(0.5, `hsla(${hue}, 100%, 60%, ${0.5 - ring * 0.15})`)
    gradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
    ctx.fill()
  }

  // Add particle trails for extra pizzazz
  if (bassIntensity > 0.6 && particlePositions.length < 50) {
    const angle = Math.random() * Math.PI * 2
    const distance = 30 + Math.random() * 100
    particlePositions.push({
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      age: 0
    })
  }

  // Draw and update particles
  particlePositions = particlePositions.filter(p => {
    p.age++
    const alpha = 1 - (p.age / 30)
    if (alpha <= 0) return false
    
    const hue = (Date.now() * 0.15 + p.age * 12) % 360
    ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha})`
    ctx.shadowBlur = 10
    ctx.shadowColor = `hsl(${hue}, 100%, 70%)`
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3 - (p.age / 15), 0, Math.PI * 2)
    ctx.fill()
    
    return true
  })
  
  ctx.shadowBlur = 0
})
</script>

