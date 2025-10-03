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
let blobs: THREE.Mesh[] = []
let geometries: THREE.SphereGeometry[] = []
let materials: THREE.MeshPhongMaterial[] = []

const blobCount = 6 // Reduced for better performance
let handleResize: (() => void) | null = null
let frameCount = 0

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000510)
    scene.fog = new THREE.Fog(0x000510, 20, 100)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 30

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00ffff, 2, 100)
    pointLight.position.set(0, 0, 30)
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0xff00ff, 2, 100)
    pointLight2.position.set(20, 20, 20)
    scene.add(pointLight2)

    // Create fluid blobs
    for (let i = 0; i < blobCount; i++) {
      const geo = new THREE.SphereGeometry(2, 12, 12) // Lower poly count
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${(i / blobCount) * 360}, 80%, 60%)`),
        shininess: 100,
        transparent: true,
        opacity: 0.8
      })
      const blob = new THREE.Mesh(geo, mat)
      
      // Random positions
      const angle = (i / blobCount) * Math.PI * 2
      const radius = 10
      blob.position.x = Math.cos(angle) * radius
      blob.position.y = Math.sin(angle) * radius
      blob.position.z = (Math.random() - 0.5) * 10
      
      scene.add(blob)
      blobs.push(blob)
      geometries.push(geo)
      materials.push(mat)
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
    console.error('Failed to initialize fluid blobs:', err)
  }
})

onBeforeUnmount(() => {
  if (handleResize) window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }
  geometries.forEach(g => g.dispose())
  materials.forEach(m => m.dispose())
  
  scene = null
  camera = null
  renderer = null
  blobs = []
  geometries = []
  materials = []
})

// WMP Alchemy-style fluid blob animation
useRafFn(() => {
  if (!scene || !camera || !renderer || blobs.length === 0) return

  frameCount++
  const data = getFrequencyData()
  const levels = audioStore.levels
  const time = Date.now() * 0.001

  // Update each blob
  blobs.forEach((blob, i) => {
    const freqIdx = Math.floor((i / blobCount) * (data?.length || 128))
    const intensity = data ? (data[freqIdx] || 0) / 255 : 0

    // Fluid motion
    const angle = time * 0.5 + (i / blobCount) * Math.PI * 2
    const radius = 10 + Math.sin(time + i) * 3
    
    blob.position.x = Math.cos(angle) * radius
    blob.position.y = Math.sin(angle) * radius
    blob.position.z = Math.sin(time * 0.3 + i) * 8

    // Scale based on frequency
    const scale = 1 + intensity * 1.5 + levels.bass * 0.5
    blob.scale.set(scale, scale, scale)

    // Rotate
    blob.rotation.x += 0.01 + intensity * 0.05
    blob.rotation.y += 0.015 + levels.mid * 0.05

    // Update color - Only every 3 frames
    if (frameCount % 3 === 0) {
      const hue = ((i / blobCount) * 360 + time * 30) % 360
      const lightness = 50 + intensity * 30
      materials[i].color.setHSL(hue / 360, 0.8, lightness / 100)
      materials[i].opacity = 0.6 + intensity * 0.3
    }
  })

  // Camera orbit
  camera.position.x = Math.sin(time * 0.2) * 30
  camera.position.y = Math.cos(time * 0.15) * 15
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
})
</script>

