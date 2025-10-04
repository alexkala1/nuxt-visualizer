export default defineNuxtPlugin(() => {
  const presetStore = usePresetStore()

  // Import preset components (markRaw to avoid making them reactive)
  // 2D Visualizations
  const Wave2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Wave2D.vue')))
  const CircularSpectrum2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/CircularSpectrum2D.vue')))
  const Scope2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Scope2D.vue')))
  const Ripple2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Ripple2D.vue')))
  const Battery2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Battery2D.vue')))
  const Psychedelic2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Psychedelic2D.vue')))
  const RadialWaveform2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/RadialWaveform2D.vue')))
  const Equalizer2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Equalizer2D.vue')))
  const Mandala2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Mandala2D.vue')))
  const NeonRings2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/NeonRings2D.vue')))
  const PulseGrid2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/PulseGrid2D.vue')))
  const NeonWaves2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/NeonWaves2D.vue')))
  
  // 3D Visualizations
  const Particles3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Particles3D.vue')))
  const SpectrumTunnel3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/SpectrumTunnel3D.vue')))
  const GeometricWaves3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/GeometricWaves3D.vue')))
  const AudioSphere3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/AudioSphere3D.vue')))
  const WaveformTerrain3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/WaveformTerrain3D.vue')))
  const Crystal3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Crystal3D.vue')))
  const Helix3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Helix3D.vue')))
  const Prism3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Prism3D.vue')))

  // Register 2D presets
  presetStore.registerPreset({
    id: 'wave-2d',
    name: 'Waveform',
    description: 'Smooth waveform with mirrored reflection',
    kind: '2d',
    component: Wave2D,
    defaults: {},
    tags: ['waveform', 'smooth', 'classic']
  })

  presetStore.registerPreset({
    id: 'neon-rings-2d',
    name: 'Neon Rings',
    description: 'Concentric glowing rings with vibrant colors',
    kind: '2d',
    component: NeonRings2D,
    defaults: {},
    tags: ['modern', 'neon', 'rings', 'glow']
  })

  presetStore.registerPreset({
    id: 'neon-waves-2d',
    name: 'Neon Waves',
    description: 'Flowing neon waves with smooth animations',
    kind: '2d',
    component: NeonWaves2D,
    defaults: {},
    tags: ['modern', 'neon', 'waves', 'smooth']
  })

  presetStore.registerPreset({
    id: 'circular-spectrum-2d',
    name: 'Circular Spectrum',
    description: 'Radial frequency bars arranged in a circle',
    kind: '2d',
    component: CircularSpectrum2D,
    defaults: {},
    tags: ['circular', 'spectrum', 'radial']
  })

  presetStore.registerPreset({
    id: 'scope-2d',
    name: 'Oscilloscope',
    description: 'Multi-layered circular oscilloscope with rotation and trails',
    kind: '2d',
    component: Scope2D,
    defaults: {},
    tags: ['oscilloscope', 'circular', 'enhanced']
  })

  presetStore.registerPreset({
    id: 'ripple-2d',
    name: 'Sound Ripples',
    description: 'Rippling waves that pulse with bass frequencies',
    kind: '2d',
    component: Ripple2D,
    defaults: {},
    tags: ['ripples', 'waves', 'bass']
  })

  presetStore.registerPreset({
    id: 'battery-2d',
    name: 'Battery',
    description: 'Circular frequency analyzer with smooth animations and peak indicators',
    kind: '2d',
    component: Battery2D,
    defaults: {},
    tags: ['wmp', 'classic', 'circular', 'analyzer']
  })

  presetStore.registerPreset({
    id: 'psychedelic-2d',
    name: 'Psychedelic',
    description: 'Enhanced kaleidoscope with dual rotation and particle effects',
    kind: '2d',
    component: Psychedelic2D,
    defaults: {},
    tags: ['wmp', 'kaleidoscope', 'psychedelic', 'enhanced']
  })

  presetStore.registerPreset({
    id: 'pulse-grid-2d',
    name: 'Pulse Grid',
    description: 'Interactive grid that pulses with the music',
    kind: '2d',
    component: PulseGrid2D,
    defaults: {},
    tags: ['modern', 'grid', 'pulse', 'interactive']
  })

  presetStore.registerPreset({
    id: 'radial-waveform-2d',
    name: 'Radial Waveform',
    description: 'Waveform drawn as expanding circles from center',
    kind: '2d',
    component: RadialWaveform2D,
    defaults: {},
    tags: ['waveform', 'radial', 'circular']
  })

  presetStore.registerPreset({
    id: 'equalizer-2d',
    name: 'Equalizer',
    description: 'Modern equalizer with peak indicators and frequency bands',
    kind: '2d',
    component: Equalizer2D,
    defaults: {},
    tags: ['equalizer', 'professional', 'analyzer', 'modern']
  })

  presetStore.registerPreset({
    id: 'mandala-2d',
    name: 'Mandala',
    description: 'Organic flower patterns with frequency-reactive petals',
    kind: '2d',
    component: Mandala2D,
    defaults: {},
    tags: ['mandala', 'flower', 'organic', 'artistic']
  })

  // Register 3D presets
  presetStore.registerPreset({
    id: 'particles-3d',
    name: '3D Particle Cloud',
    description: 'Dynamic particle system reacting to audio frequencies',
    kind: '3d',
    component: Particles3D,
    defaults: {},
    tags: ['particles', 'space', 'dynamic']
  })

  presetStore.registerPreset({
    id: 'tunnel-3d',
    name: 'Spectrum Tunnel',
    description: 'Journey through an infinite frequency tunnel',
    kind: '3d',
    component: SpectrumTunnel3D,
    defaults: {},
    tags: ['tunnel', 'spectrum', 'immersive']
  })

  presetStore.registerPreset({
    id: 'helix-3d',
    name: 'DNA Helix',
    description: 'Double helix structure that reacts to frequencies',
    kind: '3d',
    component: Helix3D,
    defaults: {},
    tags: ['modern', 'helix', 'dna', 'organic']
  })

  presetStore.registerPreset({
    id: 'prism-3d',
    name: 'Prismatic',
    description: 'Floating prisms with light refraction effects',
    kind: '3d',
    component: Prism3D,
    defaults: {},
    tags: ['modern', 'prism', 'geometric', 'elegant']
  })

  presetStore.registerPreset({
    id: 'geometric-waves-3d',
    name: 'Geometric Waves',
    description: 'Flowing geometric grid inspired by WMP Plenoptic visualizer',
    kind: '3d',
    component: GeometricWaves3D,
    defaults: {},
    tags: ['wmp', 'geometric', 'waves', 'grid']
  })

  presetStore.registerPreset({
    id: 'audio-sphere-3d',
    name: 'Audio Sphere',
    description: 'Frequency-reactive sphere with dynamic displacement',
    kind: '3d',
    component: AudioSphere3D,
    defaults: {},
    tags: ['sphere', 'reactive', 'modern']
  })

  presetStore.registerPreset({
    id: 'waveform-terrain-3d',
    name: 'Waveform Terrain',
    description: 'Infinite scrolling terrain generated from audio waveforms',
    kind: '3d',
    component: WaveformTerrain3D,
    defaults: {},
    tags: ['terrain', 'waveform', 'landscape', 'scrolling']
  })

  presetStore.registerPreset({
    id: 'crystal-3d',
    name: 'Crystal',
    description: 'Rotating crystalline structures reacting to frequencies',
    kind: '3d',
    component: Crystal3D,
    defaults: {},
    tags: ['crystal', 'geometric', 'elegant']
  })

  // Set default preset if none selected
  if (!presetStore.activePresetId && presetStore.presets.length > 0) {
    const firstPreset = presetStore.presets[0]!
    presetStore.setActivePreset(firstPreset.id)
  }
})

