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
let handleResize: (() => void) | null = null

const particleCount = 2000

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 50, 400)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 150)
    camera.lookAt(0, 0, 0)

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Create vortex particles
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const t = i / particleCount
      
      // Spiral/vortex formula
      const angle = t * Math.PI * 10
      const radius = t * 80
      const height = (t - 0.5) * 100
      
      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = height
      positions[i3 + 2] = Math.sin(angle) * radius

      // Color gradient from center to edge
      const hue = t * 0.8
      colors[i3] = Math.sin(hue * Math.PI * 2) * 0.5 + 0.5
      colors[i3 + 1] = Math.sin((hue + 0.33) * Math.PI * 2) * 0.5 + 0.5
      colors[i3 + 2] = Math.sin((hue + 0.66) * Math.PI * 2) * 0.5 + 0.5

      // Size variation
      sizes[i] = 2 + Math.random() * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add some point lights for effect
    const light1 = new THREE.PointLight(0xff00ff, 1, 200)
    light1.position.set(0, 50, 0)
    scene.add(light1)

    const light2 = new THREE.PointLight(0x00ffff, 1, 200)
    light2.position.set(0, -50, 0)
    scene.add(light2)

    // Resize handler
    handleResize = () => {
      if (!container.value || !camera || !renderer) return
      camera.aspect = container.value.clientWidth / container.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    }
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('Failed to initialize vortex:', err)
  }
})

onBeforeUnmount(() => {
  if (handleResize) window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }
  if (geometry) geometry.dispose()
  if (particles) {
    if (Array.isArray(particles.material)) {
      particles.material.forEach(m => m.dispose())
    } else {
      particles.material.dispose()
    }
  }
  
  scene = null
  camera = null
  renderer = null
  particles = null
  geometry = null
})

let rotationSpeed = 0

// Animation loop
useRafFn(() => {
  if (!particles || !camera || !renderer || !scene) return

  const data = getFrequencyData()
  const levels = audioStore.levels

  if (data && data.length > 0) {
    const positions = particles.geometry.attributes.position
    const colors = particles.geometry.attributes.color

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const t = i / particleCount
      
      // Get frequency for this particle
      const freqIndex = Math.floor(t * data.length)
      const intensity = data[freqIndex] / 255

      // Update spiral with audio reactivity
      const angle = t * Math.PI * 10 + Date.now() * 0.001
      const radius = t * 80 + intensity * 20
      const height = (t - 0.5) * 100

      positions.setX(i3 / 3, Math.cos(angle) * radius)
      positions.setY(i3 / 3, height + Math.sin(angle * 2) * intensity * 10)
      positions.setZ(i3 / 3, Math.sin(angle) * radius)

      // Pulse colors
      const hue = (t + levels.mid) * 0.8
      const brightness = 0.5 + intensity * 0.5
      colors.setX(i3 / 3, Math.sin(hue * Math.PI * 2) * brightness)
      colors.setY(i3 / 3, Math.sin((hue + 0.33) * Math.PI * 2) * brightness)
      colors.setZ(i3 / 3, Math.sin((hue + 0.66) * Math.PI * 2) * brightness)
    }

    positions.needsUpdate = true
    colors.needsUpdate = true
  }

  // Rotate vortex
  rotationSpeed = 0.01 + levels.bass * 0.05
  particles.rotation.y += rotationSpeed

  // Camera movement
  const time = Date.now() * 0.0002
  camera.position.x = Math.sin(time) * 30
  camera.position.z = 150 + Math.cos(time * 0.5) * 30
  camera.position.y = Math.sin(time * 0.7) * 20
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
})
</script>

