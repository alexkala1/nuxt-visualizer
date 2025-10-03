# Nuxt Audio Visualizer - Project Summary

## Overview

A modern, browser-based audio visualizer inspired by Windows Media Player, built with Nuxt 4 and the latest web technologies. Users can share tab audio from their browser and visualize it with multiple preset options.

## Tech Stack (Latest Versions - October 2025)

### Core
- **Nuxt 4.0.0** - Latest stable with `app/` directory structure
- **Vue 3.5.12** - Latest Vue 3
- **TypeScript 5.6.3** - Latest TypeScript
- **Vite** - Bundled with Nuxt 4

### UI & Components
- **@nuxt/ui 4.0.0** - Unified Nuxt UI library with 100+ components
- **@nuxtjs/tailwindcss 6.12.2** - Tailwind CSS integration

### State & Utilities
- **@pinia/nuxt 0.5.5** + **pinia 2.2.6** - State management
- **@vueuse/nuxt 11.2.0** - Vue composables (RAF, fullscreen, magic keys)

### PWA
- **@vite-pwa/nuxt 0.10.5** - Progressive Web App support

### 3D Graphics
- **three 0.169.0** - Latest Three.js for 3D visualizations

## Features Implemented

### ✅ Audio Capture
- Web Audio API integration
- `getDisplayMedia` for tab audio capture
- Real-time frequency and waveform analysis
- Audio level meters (bass, mid, treble, RMS)

### ✅ Visualization Presets
1. **Frequency Bars (2D)** - Classic spectrum analyzer with gradient colors
2. **Waveform (2D)** - Smooth waveform with mirrored reflection
3. **3D Particles** - Dynamic particle system reacting to audio

### ✅ Preset Management
- Grid view with thumbnails
- Active preset indicator
- Favorite system (star/unstar presets)
- Preset metadata (name, description, kind)
- Per-preset parameter storage

### ✅ Controls & Interaction
- Start/stop audio capture
- Preset selection and switching
- Fullscreen mode
- Pause/resume visualization
- Auto-cycle mode with configurable interval
- Random preset selection

### ✅ Keyboard Shortcuts
- `F` - Toggle fullscreen
- `Space` - Pause/resume
- `←` / `→` - Previous/next preset
- `R` - Random preset
- `C` - Toggle auto-cycle

### ✅ UI/UX
- Responsive design (mobile, tablet, desktop)
- Real-time audio level indicators
- Preset info overlay
- Error handling and user guidance
- Keyboard shortcut help overlay
- Dark theme (gray-950 base)

### ✅ State Persistence
- localStorage for preset preferences
- Remember last active preset
- Save favorites and parameters
- Restore on reload

### ✅ PWA Features
- Installable as standalone app
- Offline support for UI (audio capture requires permissions)
- Service worker with auto-update
- Manifest with icons

## Project Structure

```
/tmp/nuxt-visualizer/
├── app/
│   ├── components/
│   │   ├── visuals/
│   │   │   ├── Bars2D.vue          # Frequency bars visualization
│   │   │   ├── Wave2D.vue          # Waveform visualization
│   │   │   └── Particles3D.vue     # 3D particle system
│   │   ├── PresetCard.vue          # Preset card with thumbnail
│   │   ├── PresetGrid.vue          # Grid of preset cards
│   │   └── VisualizerStage.vue     # Main visualization container
│   ├── composables/
│   │   ├── useAnalyser.ts          # Audio analysis utilities
│   │   └── useKeyboardShortcuts.ts # Keyboard event handlers
│   ├── pages/
│   │   └── index.vue               # Main page
│   ├── plugins/
│   │   └── presets.client.ts       # Register visualization presets
│   ├── stores/
│   │   ├── audio.ts                # Audio capture & state
│   │   └── preset.ts               # Preset management & state
│   └── app.vue                     # App shell
├── public/
│   ├── favicon.svg
│   ├── icon-192.png                # PWA icon (placeholder)
│   └── icon-512.png                # PWA icon (placeholder)
├── nuxt.config.ts                  # Nuxt configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── README.md                       # User documentation
├── SETUP.md                        # Setup instructions
├── PROJECT_SUMMARY.md              # This file
└── .gitignore

```

## Data Flow

1. **Audio Capture**
   - User clicks "Share tab audio"
   - Browser shows picker → user selects tab + enables audio
   - `useAudioStore` creates AudioContext + AnalyserNode
   - Status changes to 'capturing'

2. **Analysis**
   - `useAnalyser` composable wraps AnalyserNode
   - RAF loop calls `getFrequencyData()` and `getTimeDomainData()`
   - `computeLevels()` splits spectrum into bass/mid/treble bands
   - Updates `audioStore.levels` for UI indicators

3. **Rendering**
   - Active preset component receives audio data via composable
   - Each preset has its own RAF loop for rendering
   - Canvas 2D or Three.js renders visuals
   - Presets read from stores: `audioStore.levels`, `presetStore.activeParams`

4. **Preset Management**
   - Presets registered in `plugins/presets.client.ts`
   - `usePresetStore` holds preset registry and active state
   - User clicks preset card → `setActivePreset(id)`
   - Active preset component is dynamically loaded
   - Settings persisted to localStorage on change

## API Reference

### Audio Store (`useAudioStore`)
- **State**: `status`, `error`, `stream`, `audioCtx`, `analyser`, `source`, `levels`
- **Actions**: `startCapture()`, `stopCapture()`, `updateLevels()`, `clearError()`

### Preset Store (`usePresetStore`)
- **State**: `presets`, `activePresetId`, `paramsById`, `favorites`, `cycleEnabled`, `cycleInterval`, `isPaused`
- **Actions**: `registerPreset()`, `setActivePreset()`, `updateParams()`, `toggleFavorite()`, `nextPreset()`, `previousPreset()`, `randomPreset()`, `toggleCycle()`, `togglePause()`

### Composables
- **`useAnalyser()`**: `getFrequencyData()`, `getTimeDomainData()`, `computeLevels()`
- **`useKeyboardShortcuts()`**: Registers global keyboard handlers

## Browser Support

| Feature | Chrome/Edge | Firefox | Safari |
|---------|-------------|---------|--------|
| Tab audio capture | ✅ Full | ⚠️ Limited | ❌ No |
| Canvas 2D | ✅ | ✅ | ✅ |
| WebGL/Three.js | ✅ | ✅ | ✅ |
| Fullscreen API | ✅ | ✅ | ✅ |
| PWA install | ✅ | ✅ | ⚠️ Limited |

## Extensibility

### Adding New Presets

1. Create component in `app/components/visuals/YourPreset.vue`
2. Use `useAnalyser()` to get audio data
3. Render using Canvas, Three.js, or WebGL
4. Register in `app/plugins/presets.client.ts`:

```ts
presetStore.registerPreset({
  id: 'your-preset',
  name: 'Your Preset',
  description: 'Description here',
  kind: '2d', // or '3d', 'shader'
  component: YourPreset,
  defaults: { /* custom params */ }
})
```

### Future Enhancements

- [ ] Shader-based presets with GLSL editor
- [ ] AudioWorklet for beat detection and BPM
- [ ] MIDI input support
- [ ] Recording visuals to WebM
- [ ] WebRTC for sharing visualizations
- [ ] Preset import/export
- [ ] More built-in presets (spectrum analyzer, oscilloscope, etc.)
- [ ] Custom color themes
- [ ] Performance monitoring and FPS cap settings

## Performance Notes

- Target: 60 FPS on mid-range laptops
- DPR capped at 2 to reduce pixel count
- Three.js antialiasing enabled
- FFT size: 2048 (good balance)
- Smoothing: 0.85 (prevents flickering)
- Particle count: 5000 (adjustable per device)

## Deployment

```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run generate

# Output: .output/public/
```

Deploy to Vercel, Netlify, GitHub Pages, or any static host. **HTTPS required** for audio capture in production.

## License

MIT

---

**Project Created**: October 2025  
**Nuxt Version**: 4.0.0  
**Author**: Built with Claude Sonnet 4.5

