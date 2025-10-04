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
let spectrogramData: ImageData | null = null

function resize() {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  canvas.value.width = Math.floor(rect.width * dpr)
  canvas.value.height = Math.floor(rect.height * dpr)
  ctx = canvas.value.getContext('2d', { 
    alpha: false,
    desynchronized: true
  })
  spectrogramData = null // Reset on resize
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

// Spectrogram visualization - scrolling frequency display over time
useRafFn(() => {
  const el = canvas.value
  if (!el || !ctx || !audioStore.isCapturing) return

  const data = getFrequencyData()
  if (!data) return

  const W = el.width
  const H = el.height

  // Initialize or shift existing spectrogram data
  if (!spectrogramData || spectrogramData.width !== W || spectrogramData.height !== H) {
    spectrogramData = ctx.createImageData(W, H)
  } else {
    // Shift all pixels left by 1
    const newData = ctx.createImageData(W, H)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W - 1; x++) {
        const oldIdx = ((y * W) + x + 1) * 4
        const newIdx = ((y * W) + x) * 4
        newData.data[newIdx] = spectrogramData.data[oldIdx]
        newData.data[newIdx + 1] = spectrogramData.data[oldIdx + 1]
        newData.data[newIdx + 2] = spectrogramData.data[oldIdx + 2]
        newData.data[newIdx + 3] = 255
      }
    }
    spectrogramData = newData
  }

  // Draw new column on the right
  const bins = 128
  const step = Math.floor(data.length / bins)
  
  for (let i = 0; i < bins; i++) {
    let sum = 0
    for (let j = 0; j < step; j++) {
      sum += data[i * step + j] || 0
    }
    const intensity = sum / step / 255

    // Map frequency bin to y position (low freq at bottom)
    const y = Math.floor(H - (i / bins) * H)
    
    // Color mapping: blue (low) -> cyan -> green -> yellow -> red (high)
    let r, g, b
    if (intensity < 0.2) {
      r = 0
      g = Math.floor(intensity * 5 * 128)
      b = Math.floor(128 + intensity * 5 * 127)
    } else if (intensity < 0.4) {
      const t = (intensity - 0.2) / 0.2
      r = 0
      g = Math.floor(128 + t * 127)
      b = Math.floor(255 - t * 155)
    } else if (intensity < 0.6) {
      const t = (intensity - 0.4) / 0.2
      r = Math.floor(t * 255)
      g = 255
      b = Math.floor(100 - t * 100)
    } else if (intensity < 0.8) {
      const t = (intensity - 0.6) / 0.2
      r = 255
      g = Math.floor(255 - t * 155)
      b = 0
    } else {
      const t = (intensity - 0.8) / 0.2
      r = 255
      g = Math.floor(100 - t * 100)
      b = 0
    }

    // Set pixel in the rightmost column
    const idx = ((y * W) + (W - 1)) * 4
    spectrogramData.data[idx] = r
    spectrogramData.data[idx + 1] = g
    spectrogramData.data[idx + 2] = b
    spectrogramData.data[idx + 3] = 255
  }

  // Draw the image data
  ctx.putImageData(spectrogramData, 0, 0)

  // Draw frequency labels on the left
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.fillRect(0, 0, 60 * dpr, H)
  
  ctx.fillStyle = '#ffffff'
  ctx.font = `${10 * dpr}px monospace`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  
  const freqLabels = ['20k', '10k', '5k', '2k', '1k', '500', '200', '100', '50']
  freqLabels.forEach((label, i) => {
    const y = (i / (freqLabels.length - 1)) * H
    ctx.fillText(label + 'Hz', 5 * dpr, y)
  })

  // Draw time grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 50 * dpr) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
})
</script>

