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
let crystals: THREE.Group | null = null
let handleResize: (() => void) | null = null

const crystalCount = 20

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0520)
    scene.fog = new THREE.Fog(0x0a0520, 50, 200)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 20, 80)
    camera.lookAt(0, 0, 0)

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Create crystal group
    crystals = new THREE.Group()
    scene.add(crystals)

    // Create individual crystals
    for (let i = 0; i < crystalCount; i++) {
      const angle = (i / crystalCount) * Math.PI * 2
      const radius = 30 + (i % 3) * 15
      
      // Crystal geometry (elongated octahedron)
      const geometry = new THREE.OctahedronGeometry(3 + Math.random() * 2, 0)
      geometry.scale(1, 2 + Math.random() * 2, 1)
      
      const material = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
        emissive: 0x112244
      })

      const crystal = new THREE.Mesh(geometry, material)
      
      // Position in circle
      crystal.position.x = Math.cos(angle) * radius
      crystal.position.z = Math.sin(angle) * radius
      crystal.position.y = (Math.random() - 0.5) * 20
      
      // Random rotation
      crystal.rotation.x = Math.random() * Math.PI
      crystal.rotation.z = Math.random() * Math.PI
      
      // Store original position for animation
      crystal.userData = {
        originalY: crystal.position.y,
        angle: angle,
        radius: radius,
        rotationSpeed: 0.01 + Math.random() * 0.02,
        index: i
      }

      crystals.add(crystal)

      // Add wireframe outline
      const edges = new THREE.EdgesGeometry(geometry)
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x88ccff,
        transparent: true,
        opacity: 0.8
      })
      const wireframe = new THREE.LineSegments(edges, lineMaterial)
      crystal.add(wireframe)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333355)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x4488ff, 1, 100)
    pointLight1.position.set(0, 50, 0)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xff44ff, 0.5, 100)
    pointLight2.position.set(50, 0, 50)
    scene.add(pointLight2)

    // Resize handler with mobile orientation fix
    handleResize = () => {
      if (!container.value || !camera || !renderer) return
      
      const width = container.value.clientWidth
      const height = container.value.clientHeight
      
      // Validate dimensions (fix for mobile orientation change)
      if (width === 0 || height === 0) return
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
  } catch (err) {
    console.error('Failed to initialize crystal:', err)
  }
})

// Use the improved resize handler for mobile
useVisualizerResize(() => handleResize?.())

onBeforeUnmount(() => {
  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }
  if (crystals) {
    crystals.children.forEach(crystal => {
      if (crystal instanceof THREE.Mesh) {
        crystal.geometry.dispose()
        if (Array.isArray(crystal.material)) {
          crystal.material.forEach(m => m.dispose())
        } else {
          crystal.material.dispose()
        }
      }
    })
  }
  
  scene = null
  camera = null
  renderer = null
  crystals = null
})

// Animation loop
useRafFn(() => {
  if (!crystals || !camera || !renderer || !scene) return

  const data = getFrequencyData()
  const levels = audioStore.levels

  if (data && data.length > 0) {
    crystals.children.forEach((crystal, index) => {
      if (crystal instanceof THREE.Mesh && crystal.userData) {
        const userData = crystal.userData
        
        // Get frequency for this crystal
        const freqIndex = Math.floor((userData.index / crystalCount) * data.length)
        const intensity = data[freqIndex] / 255

        // Animate height based on frequency
        const targetY = userData.originalY + intensity * 20
        crystal.position.y += (targetY - crystal.position.y) * 0.1

        // Rotate crystal
        crystal.rotation.y += userData.rotationSpeed + intensity * 0.05
        crystal.rotation.x += userData.rotationSpeed * 0.5

        // Scale based on intensity
        const scale = 1 + intensity * 0.5
        crystal.scale.set(scale, scale, scale)

        // Update material color based on frequency
        const hue = (userData.index / crystalCount + intensity) * 360
        const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.5 + intensity * 0.2)
        if (crystal.material instanceof THREE.MeshPhongMaterial) {
          crystal.material.color = color
          crystal.material.emissive.copy(color).multiplyScalar(0.3)
        }
      }
    })
  }

  // Rotate entire crystal group
  crystals.rotation.y += 0.003 + levels.mid * 0.01

  // Camera orbit
  const time = Date.now() * 0.0003
  camera.position.x = Math.sin(time) * 80
  camera.position.z = Math.cos(time) * 80
  camera.position.y = 20 + Math.sin(time * 2) * 10
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
})
</script>

