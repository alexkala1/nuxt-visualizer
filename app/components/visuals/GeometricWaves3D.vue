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
let plane: THREE.Mesh | null = null
let geometry: THREE.PlaneGeometry | null = null
let material: THREE.MeshBasicMaterial | null = null
let originalPositions: Float32Array | null = null

const gridSize = 40
let handleResize: (() => void) | null = null
let frameCount = 0

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a1a)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 15, 25)
    camera.lookAt(0, 0, 0)

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Create wave plane
    geometry = new THREE.PlaneGeometry(50, 50, gridSize, gridSize)
    material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    })
    plane = new THREE.Mesh(geometry, material)
    plane.rotation.x = -Math.PI / 3
    scene.add(plane)

    // Store original positions
    const positions = geometry.attributes.position.array as Float32Array
    originalPositions = new Float32Array(positions)

    // Resize handler
    handleResize = () => {
      if (!container.value || !camera || !renderer) return
      camera.aspect = container.value.clientWidth / container.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    }
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('Failed to initialize geometric waves:', err)
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
  plane = null
  geometry = null
  material = null
  originalPositions = null
})

// WMP Plenoptic-style geometric wave visualization
useRafFn(() => {
  if (!plane || !camera || !renderer || !scene || !geometry || !originalPositions) return

  frameCount++
  const data = getFrequencyData()
  const levels = audioStore.levels
  const time = Date.now() * 0.001

  // Update wave geometry - every 2 frames
  if (frameCount % 2 === 0) {
    const positions = geometry.attributes.position.array as Float32Array
    const vertexCount = positions.length / 3

    for (let i = 0; i < vertexCount; i++) {
      const i3 = i * 3
      const x = originalPositions[i3]
      const y = originalPositions[i3 + 1]

      // Calculate frequency index based on position
      const dist = Math.sqrt(x * x + y * y)
      const freqIdx = Math.floor((dist / 35) * (data?.length || 128))
      const intensity = data ? (data[freqIdx % (data.length - 1)] || 0) / 255 : 0

      // Create wave effect
      const wave1 = Math.sin(dist * 0.2 - time * 2) * 2
      const wave2 = Math.cos(x * 0.1 + time) * Math.sin(y * 0.1 + time) * 1
      const audioWave = intensity * 5 * (1 + levels.bass)

      positions[i3 + 2] = wave1 + wave2 + audioWave
    }

    geometry.attributes.position.needsUpdate = true

    // Update color
    const hue = (time * 30 + levels.mid * 180) % 360
    material.color.setHSL(hue / 360, 0.8, 0.5 + levels.treble * 0.3)
  }

  // Rotate plane
  plane.rotation.z += 0.001 + levels.mid * 0.01

  renderer.render(scene, camera)
})
</script>

