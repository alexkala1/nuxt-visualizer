# Features Overview

Complete feature list for Nuxt Audio Visualizer v2.0.0

---

## 🎧 Audio Input

### Tab Audio Capture ✅

- Capture audio from any browser tab
- Best for: YouTube, Spotify, streaming services
- Browser: Chrome, Edge (Chromium 94+)
- Limitation: Browser notification on each use

### Microphone Input ✅

- Capture from microphone or audio interface
- Best for: Live music, DJ sets, instruments
- Browser: All modern browsers
- Benefit: No repeated notifications

---

## 🎨 Visualizations (12 Total)

### 2D Canvas (7 visualizations)

#### Frequency Bars

- Classic spectrum analyzer
- Color-coded by frequency range
- Smooth bar transitions

#### Waveform

- Oscilloscope-style waveform
- Mirrored reflection effect
- Smooth amplitude response

#### Circular Spectrum

- Radial frequency bars
- 360-degree visualization
- Bass-reactive center

#### Oscilloscope

- Multi-layered circular scope
- Real-time waveform display
- Frequency-based coloring

#### Sound Ripples

- Bass-reactive ripple effects
- Multiple concurrent ripples
- Particle-based animation

#### Battery (WMP Classic) 🎮

- Iconic circular frequency meter
- Color-coded level indicators
- Inspired by Windows Media Player

#### Psychedelic (WMP Classic) 🎮

- 8-way kaleidoscope patterns
- Hypnotic color cycling
- Smooth gradient transitions

### 3D WebGL (5 visualizations)

#### 3D Particle Cloud

- 2000 dynamic particles
- Frequency-reactive colors and positions
- Smooth camera movement

#### Spectrum Tunnel

- 28 animated ring segments
- Journey through frequency space
- Color-coded by audio levels

#### Galaxy Spiral

- 1500-particle spiral formation
- Rotating star field effect
- Bass-reactive expansion

#### Fluid Blobs (WMP Alchemy) 🎮

- 6 morphing liquid spheres
- Frequency-reactive deformation
- Smooth interpolation

#### Geometric Waves (WMP Plenoptic) 🎮

- Eye-friendly wireframe grid
- Flowing wave patterns
- Smooth color transitions (no flickering)

---

## ⚙️ Controls

### Keyboard Shortcuts

- `F` - Toggle fullscreen
- `Space` - Pause/resume visualization
- `←` / `→` - Previous/next preset
- `R` - Random preset
- `C` - Toggle auto-cycle mode
- `H` - Hide UI (visualization only)
- `Esc` - Exit fullscreen

### Mouse Controls

- Click preset cards to activate
- Click fullscreen button
- Click stop/start buttons

### Auto-Cycle Mode

- Automatically switch presets every 10 seconds
- Toggle with `C` key or button
- Visual indicator when active

---

## 🎛️ User Interface

### Header

- Sticky positioning (always visible)
- Glass-morphism design (semi-transparent)
- Audio input buttons (Tab / Microphone)
- Stop button with dynamic text
- Input method badge (Tab Audio / Microphone)
- Fullscreen toggle
- Smooth hide/show with `H` key

### Preset Grid

- 12 preset cards with previews
- Hover effects
- Click to activate
- Responsive layout

### Overlays

- **Paused indicator** - Shows when visualization is paused
- **Audio levels** - Real-time bass/mid/treble display
- **Preset info** - Name and description (top-left, below header)
- **Keyboard shortcuts** - Always visible help (bottom-right)

### Toast Notifications

- Bottom-center positioning
- Beautiful slide-in animation
- Auto-dismiss after 3 seconds
- Shows for: Random preset, Cycle toggle

### Error/Info Banners

- Error banner for failed audio capture
- Info banner explaining input options
- Closeable with X button
- Color-coded (error = red, info = blue)

---

## ⚡ Performance

### Optimizations

- **FFT Size**: 1024 (50% less CPU than 2048)
- **Smoothing**: 0.8 (prevents flickering)
- **Frame Skipping**: Expensive operations update every 2-4 frames
- **Lower Particle Counts**: Reduced by 20-40% across all 3D visualizations
- **Pixel Ratio Cap**: 1.5x max on high-DPI displays
- **No Antialiasing**: Disabled for 30-40% GPU performance gain
- **Lower Geometry**: 12-20 segments vs 16-32
- **Cached Calculations**: Time/trig computed once per frame
- **Shallow Refs**: Used for heavy objects (AudioContext, Three.js)

### Performance Targets

- **2D Visualizations**: 60 FPS, 8-15% CPU, 5-10% GPU
- **3D Visualizations**: 58-60 FPS, 14-28% CPU, 18-35% GPU
- **Target Hardware**: Mid-range laptops with integrated graphics

---

## 🌐 Progressive Web App

### PWA Features

- **Installable**: Add to home screen / desktop
- **Offline Support**: Works after first visit
- **Service Worker**: Caches assets for offline use
- **App Manifest**: Custom icon and splash screen
- **Standalone Mode**: Runs like a native app

### Installation

- Chrome/Edge: Install button in address bar
- Mobile: "Add to Home Screen" option
- Desktop: Install from browser menu

---

## 🔒 Privacy & Security

### Privacy-First Design

- **All local processing**: Audio analysis happens in browser
- **No data sent to servers**: Zero network requests for audio
- **No tracking**: No analytics or user tracking
- **No recording**: Audio is analyzed, never stored
- **Open Source**: Fully transparent MIT license

### Security

- **HTTPS required**: For production audio capture
- **Permissions**: Browser asks user for microphone/tab access
- **User control**: Can revoke permissions anytime
- **No third-party**: No external API calls

---

## 🛠️ Technical Features

### State Management

- **Pinia stores**: Audio and Preset management
- **Reactive state**: Vue 3 Composition API
- **Shallow refs**: Performance-optimized for heavy objects
- **Mark raw**: Non-reactive component imports

### Audio Analysis

- **Web Audio API**: Native browser audio processing
- **AnalyserNode**: Real-time frequency analysis
- **Frequency data**: FFT-based spectrum analysis
- **Time domain data**: Waveform visualization
- **Level computation**: Bass/mid/treble detection

### Rendering

- **Canvas 2D**: High-performance 2D graphics
- **Three.js**: WebGL-based 3D rendering
- **VueUse**: RAF animation loop optimization
- **Responsive**: Auto-adjusts to screen size

### Browser APIs Used

- `navigator.mediaDevices.getDisplayMedia` - Tab audio
- `navigator.mediaDevices.getUserMedia` - Microphone
- `AudioContext` - Audio processing
- `AnalyserNode` - Frequency analysis
- `requestAnimationFrame` - Animation loop
- `Fullscreen API` - Fullscreen mode

---

## 📱 Browser Support

| Feature             | Chrome | Edge   | Firefox    | Safari     |
| ------------------- | ------ | ------ | ---------- | ---------- |
| Tab Audio           | ✅ 94+ | ✅ 94+ | ⚠️ Limited | ❌ No      |
| Microphone          | ✅     | ✅     | ✅         | ✅         |
| Canvas 2D           | ✅     | ✅     | ✅         | ✅         |
| WebGL/Three.js      | ✅     | ✅     | ✅         | ✅         |
| Fullscreen          | ✅     | ✅     | ✅         | ✅         |
| PWA Install         | ✅     | ✅     | ✅         | ⚠️ Limited |
| Keyboard Shortcuts  | ✅     | ✅     | ✅         | ✅         |
| Toast Notifications | ✅     | ✅     | ✅         | ✅         |

**Recommended**: Chrome or Edge for full feature support including tab audio capture.

---

## 📊 Statistics

- **Total Visualizations**: 12 (7 x 2D, 5 x 3D)
- **WMP Classics Recreated**: 4 (Battery, Psychedelic, Fluid Blobs, Geometric Waves)
- **Audio Input Methods**: 2 (Tab, Microphone)
- **Keyboard Shortcuts**: 6 (F, Space, ←/→, R, C, H)
- **Lines of Code**: ~10,000+ TypeScript/Vue
- **Performance Target**: 58-60 FPS
- **Browser Support**: 4 major browsers
- **License**: MIT (Open Source)

---

## 🚀 Future Features (Roadmap)

### v2.1.0 - Audio File Support

- [ ] Upload audio files (MP3, WAV, OGG)
- [ ] Drag & drop file upload
- [ ] File queue management
- [ ] Demo mode with generated tones

### v2.2.0 - Customization

- [ ] More WMP visualizations (Spikes, Ambience, Ocean Mist)
- [ ] Custom color themes
- [ ] Preset parameter customization
- [ ] Save custom presets

### v2.3.0 - Advanced Features

- [ ] Shader-based visualizations
- [ ] GLSL editor
- [ ] Community preset sharing
- [ ] Preset import/export

### v3.0.0 - Pro Features

- [ ] Beat detection and BPM analysis
- [ ] MIDI input support
- [ ] Recording to WebM/MP4
- [ ] Mobile optimization
- [ ] Touch controls
- [ ] Adaptive quality
- [ ] WebGPU support

---

## 📚 Documentation

- **[README.md](README.md)** - Main overview and quick start
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- **[PERFORMANCE.md](PERFORMANCE.md)** - Performance strategies
- **[LAPTOP_OPTIMIZATIONS.md](LAPTOP_OPTIMIZATIONS.md)** - Laptop tuning guide
- **[WMP_VISUALIZATIONS.md](WMP_VISUALIZATIONS.md)** - WMP recreations
- **[MICROPHONE_INPUT.md](MICROPHONE_INPUT.md)** - Microphone feature guide
- **[AUDIO_INPUT_OPTIONS.md](AUDIO_INPUT_OPTIONS.md)** - All audio input methods
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[LICENSE](LICENSE)** - MIT License

---

## 📄 License

This project is open source under the **MIT License**.

### What This Means

- ✅ Free to use commercially
- ✅ Free to modify
- ✅ Free to distribute
- ✅ Free for private use
- ❌ No warranty provided
- ❌ No liability accepted

See [LICENSE](LICENSE) file for full text.

---

**Version**: 2.0.0  
**Released**: October 2025  
**Status**: Production-ready  
**Platform**: Web (Nuxt 4)
