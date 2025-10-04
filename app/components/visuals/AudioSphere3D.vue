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
let sphere: THREE.Mesh | null = null
let wireframe: THREE.LineSegments | null = null
let handleResize: (() => void) | null = null

const segments = 64

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000510)
    scene.fog = new THREE.FogExp2(0x000510, 0.002)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 150

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(50, segments, segments)
    
    // Material with vertex colors
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    })

    // Initialize colors
    const colors = new Float32Array(geometry.attributes.position.count * 3)
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = 0.2
      colors[i + 1] = 0.5
      colors[i + 2] = 0.8
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    // Wireframe
    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x4488ff,
      transparent: true,
      opacity: 0.3
    })
    wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    scene.add(wireframe)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x4488ff, 1, 200)
    pointLight.position.set(0, 50, 50)
    scene.add(pointLight)

    // Resize handler
    handleResize = () => {
      if (!container.value || !camera || !renderer) return
      camera.aspect = container.value.clientWidth / container.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    }
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('Failed to initialize audio sphere:', err)
  }
})

onBeforeUnmount(() => {
  if (handleResize) window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }
  if (sphere) {
    sphere.geometry.dispose()
    if (Array.isArray(sphere.material)) {
      sphere.material.forEach(m => m.dispose())
    } else {
      sphere.material.dispose()
    }
  }
  if (wireframe) {
    wireframe.geometry.dispose()
    if (Array.isArray(wireframe.material)) {
      wireframe.material.forEach(m => m.dispose())
    } else {
      wireframe.material.dispose()
    }
  }
  
  scene = null
  camera = null
  renderer = null
  sphere = null
  wireframe = null
})

// Animation loop
useRafFn(() => {
  if (!sphere || !wireframe || !camera || !renderer || !scene) return

  const data = getFrequencyData()
  const levels = audioStore.levels

  if (data && data.length > 0) {
    const positions = sphere.geometry.attributes.position
    const colors = sphere.geometry.attributes.color
    const originalPositions = new THREE.SphereGeometry(50, segments, segments).attributes.position

    for (let i = 0; i < positions.count; i++) {
      // Get original position
      const x = originalPositions.getX(i)
      const y = originalPositions.getY(i)
      const z = originalPositions.getZ(i)

      // Calculate frequency for this vertex based on angle
      const angle = Math.atan2(z, x) + Math.PI
      const freqIndex = Math.floor((angle / (Math.PI * 2)) * data.length)
      const intensity = data[freqIndex] / 255

      // Displace vertex outward based on frequency
      const displacement = 1 + intensity * 0.8
      positions.setXYZ(i, x * displacement, y * displacement, z * displacement)

      // Update colors
      const hue = (intensity * 0.7 + angle / (Math.PI * 2)) * 360
      const r = Math.sin((hue / 360) * Math.PI * 2) * 0.5 + 0.5
      const g = Math.sin((hue / 360 + 0.33) * Math.PI * 2) * 0.5 + 0.5
      const b = Math.sin((hue / 360 + 0.66) * Math.PI * 2) * 0.5 + 0.5
      colors.setXYZ(i, r, g, b)
    }

    positions.needsUpdate = true
    colors.needsUpdate = true

    // Update wireframe
    wireframe.geometry.dispose()
    wireframe.geometry = new THREE.WireframeGeometry(sphere.geometry)
  }

  // Rotate
  sphere.rotation.y += 0.005 + levels.mid * 0.01
  sphere.rotation.x += 0.002 + levels.treble * 0.005
  wireframe.rotation.copy(sphere.rotation)

  // Pulse camera
  camera.position.z = 150 - levels.bass * 30

  renderer.render(scene, camera)
})
</script>

