# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Tab (User)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Nuxt App (SPA)                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Pages/index.vue                                    │  │  │
│  │  │  ┌───────────────┐  ┌──────────────────────────┐   │  │  │
│  │  │  │  Header       │  │  VisualizerStage         │   │  │  │
│  │  │  │  - Capture btn│  │  ┌────────────────────┐  │   │  │  │
│  │  │  │  - Fullscreen │  │  │ Active Preset      │  │   │  │  │
│  │  │  └───────────────┘  │  │ (Bars/Wave/3D)     │  │   │  │  │
│  │  │                     │  │                    │  │   │  │  │
│  │  │  ┌───────────────┐  │  │ RAF Loop          │  │   │  │  │
│  │  │  │  PresetGrid   │  │  │ Canvas/Three.js   │  │   │  │  │
│  │  │  │  - PresetCard │  │  └────────────────────┘  │   │  │  │
│  │  │  │  - Favorite   │  │                          │   │  │  │
│  │  │  └───────────────┘  └──────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Pinia Stores                                       │  │  │
│  │  │  ┌──────────────┐  ┌──────────────────────────┐    │  │  │
│  │  │  │ audioStore   │  │ presetStore              │    │  │  │
│  │  │  │ - status     │  │ - presets[]              │    │  │  │
│  │  │  │ - analyser   │  │ - activePresetId         │    │  │  │
│  │  │  │ - levels     │  │ - favorites[]            │    │  │  │
│  │  │  └──────────────┘  └──────────────────────────┘    │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Composables                                        │  │  │
│  │  │  - useAnalyser()      → FFT, waveform, levels      │  │  │
│  │  │  - useKeyboardShortcuts() → F/Space/Arrows/etc     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Web Audio API                                      │  │  │
│  │  │  MediaStream ─→ AudioContext ─→ AnalyserNode       │  │  │
│  │  │                                    ↓                │  │  │
│  │  │                       Frequency / Time Domain Data  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↑                                  │
│                    getDisplayMedia({ audio: true })             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │  Source Tab       │
                    │  (Playing Audio)  │
                    └───────────────────┘
```

## Component Hierarchy

```
app.vue
└── pages/index.vue
    ├── Header
    │   └── Capture Button / Stop Button
    ├── Alert (Error/Info banners)
    ├── Main Content
    │   ├── VisualizerStage (when capturing)
    │   │   ├── Dynamic Preset Component
    │   │   │   ├── Bars2D.vue
    │   │   │   ├── Wave2D.vue
    │   │   │   └── Particles3D.vue
    │   │   ├── Audio Levels Overlay
    │   │   └── Preset Info Overlay
    │   └── PresetGrid (when not capturing)
    │       └── PresetCard[] (for each preset)
    └── Keyboard Shortcuts Help (floating)
```

## Data Flow

### 1. Audio Capture Flow
```
User clicks "Share tab audio"
    ↓
navigator.mediaDevices.getDisplayMedia()
    ↓
Browser shows tab picker
    ↓
User selects tab + enables audio
    ↓
MediaStream created
    ↓
audioStore.startCapture()
    ↓
Create AudioContext + AnalyserNode
    ↓
Connect: MediaStreamSource → AnalyserNode
    ↓
Store references in audioStore
    ↓
Status = 'capturing'
```

### 2. Analysis & Rendering Flow
```
RAF Loop (60 FPS)
    ↓
useAnalyser().getFrequencyData()
    ↓
AnalyserNode.getByteFrequencyData(buffer)
    ↓
Split into frequency bands (bass/mid/treble)
    ↓
audioStore.updateLevels()
    ↓
Active preset component reads data
    ↓
Render to Canvas/Three.js
    ↓
Repeat
```

### 3. Preset Selection Flow
```
User clicks PresetCard
    ↓
presetStore.setActivePreset(id)
    ↓
activePresetId updated
    ↓
VisualizerStage re-renders with new component
    ↓
localStorage updated with selection
```

### 4. Keyboard Shortcut Flow
```
User presses key
    ↓
useMagicKeys() from VueUse detects
    ↓
whenever(keys.f, ...) → handler runs
    ↓
Call store action or composable
    ↓
UI updates reactively
```

## State Management

### Audio Store State
```typescript
{
  status: 'idle' | 'capturing' | 'error',
  error: string | null,
  stream: MediaStream | null,
  audioCtx: AudioContext | null,
  analyser: AnalyserNode | null,
  source: MediaStreamAudioSourceNode | null,
  levels: {
    bass: number,    // 0-1
    mid: number,     // 0-1
    treble: number,  // 0-1
    rms: number      // 0-1
  }
}
```

### Preset Store State
```typescript
{
  presets: VisualPreset[],          // All registered presets
  activePresetId: string | null,    // Currently selected
  paramsById: Record<string, any>,  // Per-preset parameters
  favorites: string[],              // Favorited preset IDs
  cycleEnabled: boolean,            // Auto-cycle mode
  cycleInterval: number,            // Cycle interval (ms)
  isPaused: boolean                 // Visualization paused
}
```

### Persistence (localStorage)
```json
{
  "nuxt-visualizer-preset": {
    "activePresetId": "bars-2d",
    "paramsById": {
      "bars-2d": { "barCount": 96, "colorMode": "gradient" }
    },
    "favorites": ["bars-2d", "particles-3d"],
    "cycleEnabled": false,
    "cycleInterval": 10000
  }
}
```

## Performance Optimizations

1. **Canvas DPR Capping**: `Math.min(devicePixelRatio, 2)` to reduce pixel count on high-DPI displays
2. **Lazy-loaded Presets**: `defineAsyncComponent()` for code splitting
3. **Shallow Refs**: `shallowRef()` for AudioContext/AnalyserNode to avoid deep reactivity
4. **RAF Throttling**: Single RAF loop per preset, stops when paused
5. **Three.js Disposal**: Proper cleanup of geometries, materials, and renderer
6. **FFT Smoothing**: `smoothingTimeConstant = 0.85` to reduce jitter

## Security & Privacy

- **Audio stays local**: All processing happens in-browser, no server required
- **User consent**: Explicit permission via browser dialog
- **No recording**: Audio is analyzed in real-time, not stored
- **HTTPS required**: Browser security policy for production (localhost exempted)

## Browser API Usage

| API | Purpose | Fallback |
|-----|---------|----------|
| `getDisplayMedia()` | Capture tab audio | User guidance for unsupported browsers |
| `AudioContext` | Audio processing | Error message if unavailable |
| `AnalyserNode` | FFT & waveform | N/A (core feature) |
| `Canvas 2D` | 2D visuals | N/A |
| `WebGL` | 3D visuals | Fallback to 2D presets |
| `Fullscreen API` | Immersive mode | Button hidden if unavailable |
| `localStorage` | Persist settings | Settings don't persist (non-critical) |
| `Service Worker` | PWA/offline | App works without SW |

## Module Dependencies

### Runtime Dependencies
- `@nuxt/ui` → UI components (Alert, Button, Card, Icon)
- `@pinia/nuxt` + `pinia` → State management
- `@vite-pwa/nuxt` → PWA manifest, service worker
- `@vueuse/nuxt` → Composables (useRafFn, useMagicKeys, useFullscreen)
- `nuxt` → Framework
- `three` → 3D rendering
- `vue` → Framework

### Dev Dependencies
- `@nuxtjs/tailwindcss` → Styling
- `typescript` → Type safety

## Build Output

```
.output/public/
├── _nuxt/
│   ├── [hash].js       # App bundles (code-split)
│   ├── [hash].css      # Styles
│   └── ...
├── favicon.svg
├── icon-192.png
├── icon-512.png
├── manifest.webmanifest
├── sw.js               # Service worker
└── index.html          # SPA entry point
```

## Deployment Checklist

- [ ] Replace placeholder icons (192x192, 512x512)
- [ ] Update manifest name/description
- [ ] Test on target browsers (Chrome, Firefox, Safari)
- [ ] Verify HTTPS on production domain
- [ ] Test audio capture flow end-to-end
- [ ] Monitor performance (Lighthouse, DevTools)
- [ ] Add analytics (optional)
- [ ] Set up error tracking (Sentry, etc.) (optional)

## Extension Points

1. **New Presets**: Add components in `visuals/`, register in plugin
2. **Custom Parameters**: Extend `defaults` in preset registration
3. **Audio Effects**: Add BiquadFilter, Compressor to audio graph
4. **Beat Detection**: Implement AudioWorklet for onset detection
5. **Shader Library**: Add GLSL shaders, uniform system
6. **MIDI Control**: Add Web MIDI API for external controllers
7. **Recording**: Add MediaRecorder for saving visuals
8. **Themes**: Add theme switcher, custom color schemes

