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
let helices: THREE.Group[] = []
let handleResize: (() => void) | null = null

const numHelices = 2
const spheresPerHelix = 60
const radius = 30

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x05050a)
    scene.fog = new THREE.Fog(0x05050a, 50, 300)

    // Camera
    camera = new THREE.PerspectiveCamera(
      60,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 120)

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Create double helix
    for (let h = 0; h < numHelices; h++) {
      const helixGroup = new THREE.Group()
      
      for (let i = 0; i < spheresPerHelix; i++) {
        const angle = (i / spheresPerHelix) * Math.PI * 8 + (h * Math.PI)
        const y = (i / spheresPerHelix) * 200 - 100
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        const geometry = new THREE.SphereGeometry(2, 16, 16)
        const material = new THREE.MeshBasicMaterial({ 
          color: h === 0 ? 0x00ffff : 0xff00ff,
          transparent: true,
          opacity: 0.8
        })
        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.set(x, y, z)
        helixGroup.add(sphere)
        
        // Add connecting tubes
        if (i > 0) {
          const prevAngle = ((i - 1) / spheresPerHelix) * Math.PI * 8 + (h * Math.PI)
          const prevY = ((i - 1) / spheresPerHelix) * 200 - 100
          const prevX = Math.cos(prevAngle) * radius
          const prevZ = Math.sin(prevAngle) * radius
          
          const points = [
            new THREE.Vector3(prevX, prevY, prevZ),
            new THREE.Vector3(x, y, z)
          ]
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
          const lineMaterial = new THREE.LineBasicMaterial({ 
            color: h === 0 ? 0x0088ff : 0xff0088,
            transparent: true,
            opacity: 0.5
          })
          const line = new THREE.Line(lineGeometry, lineMaterial)
          helixGroup.add(line)
        }
      }
      
      helices.push(helixGroup)
      scene.add(helixGroup)
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)
    
    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(0, 50, 50)
    scene.add(pointLight)

    // Handle resize with mobile orientation fix
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

  } catch (error) {
    console.error('Failed to initialize 3D scene:', error)
  }
})

// Use the improved resize handler for mobile
useVisualizerResize(() => handleResize?.())

onBeforeUnmount(() => {
  if (renderer) {
    renderer.dispose()
    container.value?.removeChild(renderer.domElement)
  }
  scene?.clear()
})

useRafFn(() => {
  if (!renderer || !scene || !camera || !audioStore.isCapturing) return
  
  const data = getFrequencyData()
  if (!data) return

  // Rotate helices
  helices.forEach((helix, index) => {
    helix.rotation.y += 0.005 * (index === 0 ? 1 : -1)
    
    // Update sphere sizes based on audio
    helix.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
        const dataIndex = Math.floor((i / spheresPerHelix) * data.length)
        const value = data[dataIndex] / 255
        const scale = 1 + value * 2
        child.scale.setScalar(scale)
        
        if (child.material instanceof THREE.MeshBasicMaterial) {
          child.material.opacity = 0.6 + value * 0.4
        }
      }
    })
  })

  renderer.render(scene, camera)
})
</script>

