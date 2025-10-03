<template>
  <div ref="container" class="w-full h-full absolute inset-0" style="background: #0b0f1a;" />
</template>

<script setup lang="ts">
import { useRafFn } from '@vueuse/core'
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)
const { getFrequencyData } = useAnalyser()
const audioStore = useAudioStore()

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let particles: THREE.Points | null = null
let geometry: THREE.BufferGeometry | null = null
let material: THREE.PointsMaterial | null = null
let initialPositions: Float32Array | null = null
const particleCount = 2000 // Heavily optimized for laptops

let handleResize: (() => void) | null = null
let frameCount = 0

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b0f1a)
    scene.fog = new THREE.Fog(0x0b0f1a, 100, 300)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 100

    // Renderer - Performance optimized
    renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disabled for better performance
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Lower pixel ratio
    container.value.appendChild(renderer.domElement)

    // Particles
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Spread particles in a larger area
      positions[i3] = (Math.random() - 0.5) * 200
      positions[i3 + 1] = (Math.random() - 0.5) * 200
      positions[i3 + 2] = (Math.random() - 0.5) * 200

      // Brighter initial colors
      colors[i3] = 0.5 + Math.random() * 0.5
      colors[i3 + 1] = 0.5 + Math.random() * 0.5
      colors[i3 + 2] = 0.5 + Math.random() * 0.5
    }

    // Store initial positions
    initialPositions = new Float32Array(positions)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
      size: 2.0,  // Larger particles
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Resize handler
    handleResize = () => {
      if (!container.value || !camera || !renderer) return
      camera.aspect = container.value.clientWidth / container.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    }
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('Failed to initialize 3D particles:', err)
  }
})

onBeforeUnmount(() => {
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
  
  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }
  
  if (geometry) geometry.dispose()
  if (material) material.dispose()
  
  scene = null
  camera = null
  renderer = null
  particles = null
  geometry = null
  material = null
  initialPositions = null
})

// Animation loop - Performance optimized
useRafFn(() => {
  if (!particles || !camera || !renderer || !scene || !initialPositions) return

  frameCount++
  const data = getFrequencyData()
  const levels = audioStore.levels

  // Always animate, even without audio capture
  const audioMultiplier = audioStore.isCapturing ? 1 : 0.1

  // Rotate particles based on audio
  particles.rotation.x += (0.001 + levels.mid * 0.01) * audioMultiplier
  particles.rotation.y += (0.002 + levels.treble * 0.01) * audioMultiplier

  // Scale based on bass
  const scale = 1 + levels.bass * 0.5 * audioMultiplier
  particles.scale.set(scale, scale, scale)

  // Update particle attributes - OPTIMIZED: Only every 3 frames
  if (frameCount % 3 === 0) {
    const colorAttr = particles.geometry.attributes.color
    const positionAttr = particles.geometry.attributes.position
    
    if (colorAttr && positionAttr) {
      const colors = colorAttr.array as Float32Array
      const positions = positionAttr.array as Float32Array
      const time = Date.now() * 0.001
      
      // Process in batches for better cache locality
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        // Get intensity (cached calculation)
        let intensity = 0
        if (data && data.length > 0) {
          const freqIdx = Math.floor((i / particleCount) * data.length)
          intensity = (data[freqIdx] || 0) / 255
        }

        // Update colors only when capturing
        if (audioStore.isCapturing && data) {
          colors[i3] = 0.2 + intensity * 0.8     // R
          colors[i3 + 1] = 0.4 + intensity * 0.6 // G
          colors[i3 + 2] = 0.8 + intensity * 0.4 // B
        }

        // Pulse positions (optimized calculation)
        const angle = time + i * 0.1
        const baseY = initialPositions[i3 + 1]
        if (baseY !== undefined) {
          positions[i3 + 1] = baseY + Math.sin(angle) * (intensity * 10 + 2) * audioMultiplier
        }
      }

      if (audioStore.isCapturing) {
        colorAttr.needsUpdate = true
      }
      positionAttr.needsUpdate = true
    }
  }

  // Camera movement (smoother, less frequent trig calculations)
  const camTime = Date.now() * 0.0002
  camera.position.x = Math.sin(camTime) * 20
  camera.position.y = Math.cos(camTime) * 20
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
})
</script>

