<template>
  <div ref="container" class="w-full h-full absolute inset-0" />
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

const particleCount = 1500 // Heavily optimized for laptops
const arms = 5
let handleResize: (() => void) | null = null
let frameCount = 0

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000510)
    scene.fog = new THREE.Fog(0x000510, 50, 200)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 50, 50)
    camera.lookAt(0, 0, 0)

    // Renderer - Performance optimized
    renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Create spiral galaxy particles
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const armIndex = i % arms
      const progress = i / particleCount
      
      // Spiral formula
      const angle = (armIndex / arms) * Math.PI * 2 + progress * Math.PI * 4
      const radius = progress * 50
      
      positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2
      positions[i3 + 1] = (Math.random() - 0.5) * 3
      positions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2

      // Color: blue to purple to pink
      const hue = 180 + progress * 100
      colors[i3] = 0.5 + progress * 0.5     // R
      colors[i3 + 1] = 0.3 - progress * 0.2 // G
      colors[i3 + 2] = 0.8                  // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
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
    console.error('Failed to initialize spiral:', err)
  }
})

onBeforeUnmount(() => {
  if (handleResize) window.removeEventListener('resize', handleResize)
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
})

// Animation loop - Performance optimized
useRafFn(() => {
  if (!particles || !camera || !renderer || !scene) return

  frameCount++
  const data = getFrequencyData()
  const levels = audioStore.levels

  // Rotate galaxy
  particles.rotation.y += 0.001 + levels.mid * 0.005
  
  // Pulse based on bass
  const scale = 1 + levels.bass * 0.3
  particles.scale.set(scale, scale, scale)

  // Update colors based on audio - OPTIMIZED: Only every 4 frames
  if (frameCount % 4 === 0 && data && data.length > 0) {
    const colors = particles.geometry.attributes.color.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const freqIdx = Math.floor((i / particleCount) * data.length)
      const intensity = data[freqIdx] / 255
      
      // Brighten colors based on audio
      colors[i3] = 0.5 + intensity * 0.5
      colors[i3 + 1] = 0.3 + intensity * 0.3
      colors[i3 + 2] = 0.8 + intensity * 0.2
    }
    
    particles.geometry.attributes.color.needsUpdate = true
  }

  // Orbit camera
  const time = Date.now() * 0.0001
  camera.position.x = Math.sin(time) * 60
  camera.position.z = Math.cos(time) * 60
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
})
</script>

