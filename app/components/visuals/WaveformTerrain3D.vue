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
let terrain: THREE.Mesh | null = null
let wireframe: THREE.LineSegments | null = null
let handleResize: (() => void) | null = null

const gridSize = 80
const gridSpacing = 2

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000208)
    scene.fog = new THREE.Fog(0x000208, 50, 200)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      500
    )
    camera.position.set(0, 40, 50)
    camera.lookAt(0, 0, -20)

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Create terrain geometry
    const geometry = new THREE.PlaneGeometry(
      gridSize * gridSpacing,
      gridSize * gridSpacing,
      gridSize - 1,
      gridSize - 1
    )
    geometry.rotateX(-Math.PI / 2)

    // Material with vertex colors
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide
    })

    // Initialize colors
    const colors = new Float32Array(geometry.attributes.position.count * 3)
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = 0
      colors[i + 1] = 0.3
      colors[i + 2] = 0.6
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    terrain = new THREE.Mesh(geometry, material)
    scene.add(terrain)

    // Wireframe
    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    })
    wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    wireframe.position.copy(terrain.position)
    scene.add(wireframe)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222244)
    scene.add(ambientLight)

    // Resize handler
    handleResize = () => {
      if (!container.value || !camera || !renderer) return
      camera.aspect = container.value.clientWidth / container.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    }
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('Failed to initialize waveform terrain:', err)
  }
})

onBeforeUnmount(() => {
  if (handleResize) window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }
  if (terrain) {
    terrain.geometry.dispose()
    if (Array.isArray(terrain.material)) {
      terrain.material.forEach(m => m.dispose())
    } else {
      terrain.material.dispose()
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
  terrain = null
  wireframe = null
})

let offset = 0

// Animation loop
useRafFn(() => {
  if (!terrain || !wireframe || !camera || !renderer || !scene) return

  const data = getFrequencyData()
  const levels = audioStore.levels

  if (data && data.length > 0) {
    const positions = terrain.geometry.attributes.position
    const colors = terrain.geometry.attributes.color

    // Scroll terrain forward
    offset += 0.5 + levels.bass * 2

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = i * gridSize + j
        
        // Get frequency data based on x position
        const freqIndex = Math.floor((j / gridSize) * data.length)
        const intensity = data[freqIndex] / 255

        // Calculate height with scrolling effect
        const scrolledRow = (i + offset / gridSpacing) % gridSize
        const heightFalloff = Math.max(0, 1 - scrolledRow / gridSize)
        const height = intensity * 30 * heightFalloff

        positions.setY(index, height)

        // Color based on height
        const colorIntensity = intensity * heightFalloff
        const r = colorIntensity * 0.8
        const g = colorIntensity * 0.4 + 0.2
        const b = 0.6 + colorIntensity * 0.4
        colors.setXYZ(index, r, g, b)
      }
    }

    positions.needsUpdate = true
    colors.needsUpdate = true

    // Update wireframe
    wireframe.geometry.dispose()
    wireframe.geometry = new THREE.WireframeGeometry(terrain.geometry)
  }

  // Move terrain backward to create infinite scroll effect
  terrain.position.z = -(offset % gridSpacing)
  wireframe.position.z = terrain.position.z

  // Camera sway
  const time = Date.now() * 0.0005
  camera.position.x = Math.sin(time) * 10
  camera.lookAt(0, 0, -20)

  renderer.render(scene, camera)
})
</script>

