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
let prisms: THREE.Mesh[] = []
let particles: THREE.Points | null = null
let handleResize: (() => void) | null = null

onMounted(() => {
  if (!container.value) return

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.FogExp2(0x000000, 0.002)

    // Camera
    camera = new THREE.PerspectiveCamera(
      70,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 100

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.value.appendChild(renderer.domElement)

    // Create floating prisms
    const numPrisms = 15
    for (let i = 0; i < numPrisms; i++) {
      const geometry = new THREE.OctahedronGeometry(8, 0)
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / numPrisms, 0.8, 0.5),
        transparent: true,
        opacity: 0.8,
        wireframe: false,
        shininess: 100,
        specular: 0xffffff
      })
      
      const prism = new THREE.Mesh(geometry, material)
      prism.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 60
      )
      prism.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      
      prisms.push(prism)
      scene.add(prism)
    }

    // Add light particles
    const particleCount = 500
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      
      const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })
    
    particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    
    const backLight = new THREE.DirectionalLight(0x8888ff, 0.5)
    backLight.position.set(-1, -1, -1)
    scene.add(backLight)

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

  // Rotate and scale prisms based on audio
  prisms.forEach((prism, index) => {
    const dataIndex = Math.floor((index / prisms.length) * data.length)
    const value = data[dataIndex] / 255
    
    prism.rotation.x += 0.01 + value * 0.02
    prism.rotation.y += 0.01 + value * 0.02
    
    const scale = 1 + value * 0.5
    prism.scale.setScalar(scale)
    
    if (prism.material instanceof THREE.MeshPhongMaterial) {
      prism.material.emissive.setHSL(index / prisms.length, 0.8, value * 0.3)
    }
  })
  
  // Rotate particle field
  if (particles) {
    particles.rotation.y += 0.001
    particles.rotation.x += 0.0005
  }

  renderer.render(scene, camera)
})
</script>

