export default defineNuxtPlugin(() => {
  const presetStore = usePresetStore()

  // Import preset components (markRaw to avoid making them reactive)
  const Bars2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Bars2D.vue')))
  const Wave2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Wave2D.vue')))
  const CircularSpectrum2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/CircularSpectrum2D.vue')))
  const Scope2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Scope2D.vue')))
  const Ripple2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Ripple2D.vue')))
  const Battery2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Battery2D.vue')))
  const Psychedelic2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Psychedelic2D.vue')))
  const Particles3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Particles3D.vue')))
  const SpectrumTunnel3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/SpectrumTunnel3D.vue')))
  const Spiral3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Spiral3D.vue')))
  const FluidBlobs3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/FluidBlobs3D.vue')))
  const GeometricWaves3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/GeometricWaves3D.vue')))

  // Register 2D presets
  presetStore.registerPreset({
    id: 'bars-2d',
    name: 'Frequency Bars',
    description: 'Classic frequency spectrum bars visualization',
    kind: '2d',
    component: Bars2D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'wave-2d',
    name: 'Waveform',
    description: 'Smooth waveform with mirrored reflection',
    kind: '2d',
    component: Wave2D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'circular-spectrum-2d',
    name: 'Circular Spectrum',
    description: 'Radial frequency bars arranged in a circle',
    kind: '2d',
    component: CircularSpectrum2D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'scope-2d',
    name: 'Oscilloscope',
    description: 'Multi-layered circular oscilloscope visualization',
    kind: '2d',
    component: Scope2D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'ripple-2d',
    name: 'Sound Ripples',
    description: 'Rippling waves that pulse with bass frequencies',
    kind: '2d',
    component: Ripple2D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'battery-2d',
    name: 'Battery (WMP Classic)',
    description: 'Iconic circular frequency analyzer inspired by Windows Media Player',
    kind: '2d',
    component: Battery2D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'psychedelic-2d',
    name: 'Psychedelic (WMP Classic)',
    description: 'Kaleidoscope patterns inspired by WMP Psychedelia visualizer',
    kind: '2d',
    component: Psychedelic2D,
    defaults: {}
  })

  // Register 3D presets
  presetStore.registerPreset({
    id: 'particles-3d',
    name: '3D Particle Cloud',
    description: 'Dynamic particle system reacting to audio frequencies',
    kind: '3d',
    component: Particles3D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'tunnel-3d',
    name: 'Spectrum Tunnel',
    description: 'Journey through an infinite frequency tunnel',
    kind: '3d',
    component: SpectrumTunnel3D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'spiral-3d',
    name: 'Galaxy Spiral',
    description: 'A rotating galaxy of particles responding to sound',
    kind: '3d',
    component: Spiral3D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'fluid-blobs-3d',
    name: 'Fluid Blobs (WMP Alchemy)',
    description: 'Morphing liquid spheres inspired by WMP Alchemy visualizer',
    kind: '3d',
    component: FluidBlobs3D,
    defaults: {}
  })

  presetStore.registerPreset({
    id: 'geometric-waves-3d',
    name: 'Geometric Waves (WMP Plenoptic)',
    description: 'Flowing geometric grid inspired by WMP Plenoptic visualizer',
    kind: '3d',
    component: GeometricWaves3D,
    defaults: {}
  })

  // Set default preset if none selected
  if (!presetStore.activePresetId && presetStore.presets.length > 0) {
    const firstPreset = presetStore.presets[0]!
    presetStore.setActivePreset(firstPreset.id)
  }
})

