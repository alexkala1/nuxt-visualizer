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
let tunnel: THREE.Mesh[] = []
let geometry: THREE.RingGeometry[] = []
let material: THREE.MeshBasicMaterial[] = []

const segmentCount = 28 // Heavily optimized for laptops
let handleResize: (() => void) | null = null
let frameCount = 0

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 1, 100)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

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

    // Create tunnel segments (lower poly count)
    for (let i = 0; i < segmentCount; i++) {
      const geo = new THREE.RingGeometry(2, 3, 20) // Heavily optimized for laptops
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        wireframe: true
      })
      const mesh = new THREE.Mesh(geo, mat)
      
      mesh.position.z = -i * 2
      scene.add(mesh)
      
      tunnel.push(mesh)
      geometry.push(geo)
      material.push(mat)
    }

    // Resize handler
    handleResize = () => {
      if (!container.value || !camera || !renderer) return
      camera.aspect = container.value.clientWidth / container.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    }
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('Failed to initialize tunnel:', err)
  }
})

onBeforeUnmount(() => {
  if (handleResize) window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }
  geometry.forEach(g => g.dispose())
  material.forEach(m => m.dispose())
  
  scene = null
  camera = null
  renderer = null
  tunnel = []
  geometry = []
  material = []
})

// Animation loop - Performance optimized
useRafFn(() => {
  if (!scene || !camera || !renderer || tunnel.length === 0) return

  frameCount++
  const data = getFrequencyData()
  const levels = audioStore.levels
  const time = Date.now()

  // Move tunnel forward
  tunnel.forEach((segment, i) => {
    segment.position.z += 0.1 + levels.bass * 0.2

    // Reset segment when it's too close
    if (segment.position.z > 5) {
      segment.position.z = -(segmentCount - 1) * 2
    }

    // Scale based on frequency
    const freqIdx = Math.floor((i / segmentCount) * (data?.length || 128))
    const intensity = data ? (data[freqIdx] || 0) / 255 : 0
    const scale = 1 + intensity * 0.5
    segment.scale.set(scale, scale, 1)

    // Color update - Only every 3 frames
    if (frameCount % 3 === 0) {
      const hue = ((i / segmentCount) * 360 + time * 0.05) % 360
      const lightness = 50 + intensity * 30
      material[i].color.setHSL(hue / 360, 0.8, lightness / 100)
    }
  })

  // Camera sway (cached time calculation)
  camera.rotation.z = Math.sin(time * 0.001) * 0.1

  renderer.render(scene, camera)
})
</script>

