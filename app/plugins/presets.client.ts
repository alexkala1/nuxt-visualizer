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
  const Spectrogram2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Spectrogram2D.vue')))
  const RadialWaveform2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/RadialWaveform2D.vue')))
  const Equalizer2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Equalizer2D.vue')))
  const Mandala2D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Mandala2D.vue')))
  const Particles3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Particles3D.vue')))
  const SpectrumTunnel3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/SpectrumTunnel3D.vue')))
  const Spiral3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Spiral3D.vue')))
  const FluidBlobs3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/FluidBlobs3D.vue')))
  const GeometricWaves3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/GeometricWaves3D.vue')))
  const AudioSphere3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/AudioSphere3D.vue')))
  const WaveformTerrain3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/WaveformTerrain3D.vue')))
  const Crystal3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Crystal3D.vue')))
  const Vortex3D = markRaw(defineAsyncComponent(() => import('~/components/visuals/Vortex3D.vue')))

  // Register 2D presets
  presetStore.registerPreset({
    id: 'bars-2d',
    name: 'Frequency Bars',
    description: 'Classic frequency spectrum bars visualization',
    kind: '2d',
    component: Bars2D,
    defaults: {},
    tags: ['classic', 'spectrum', 'bars']
  })

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
    id: 'spectrogram-2d',
    name: 'Spectrogram',
    description: 'Scrolling frequency-time display with color mapping',
    kind: '2d',
    component: Spectrogram2D,
    defaults: {},
    tags: ['spectrogram', 'analysis', 'professional']
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
    id: 'spiral-3d',
    name: 'Galaxy Spiral',
    description: 'A rotating galaxy of particles responding to sound',
    kind: '3d',
    component: Spiral3D,
    defaults: {},
    tags: ['galaxy', 'spiral', 'space', 'particles']
  })

  presetStore.registerPreset({
    id: 'fluid-blobs-3d',
    name: 'Fluid Blobs',
    description: 'Morphing liquid spheres inspired by WMP Alchemy visualizer',
    kind: '3d',
    component: FluidBlobs3D,
    defaults: {},
    tags: ['wmp', 'fluid', 'organic', 'blobs']
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

  presetStore.registerPreset({
    id: 'vortex-3d',
    name: 'Vortex',
    description: 'Spiraling particle vortex with dynamic colors',
    kind: '3d',
    component: Vortex3D,
    defaults: {},
    tags: ['vortex', 'spiral', 'particles', 'dynamic']
  })

  // Set default preset if none selected
  if (!presetStore.activePresetId && presetStore.presets.length > 0) {
    const firstPreset = presetStore.presets[0]!
    presetStore.setActivePreset(firstPreset.id)
  }
})

