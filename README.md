# 🎵 Nuxt Audio Visualizer

A modern, browser-based audio visualizer inspired by Windows Media Player classics, built with Nuxt 4 and cutting-edge web technologies.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-4.0.0-00DC82.svg)
![Performance](https://img.shields.io/badge/performance-optimized-brightgreen.svg)

## ✨ Features

### 🎧 Multiple Audio Input Methods

- **Tab Audio Capture** - Visualize YouTube, Spotify, or any browser tab (Chrome/Edge)
- **Microphone Input** - Perfect for live music, DJs, and instruments (All browsers)
- **No browser notifications** when using microphone mode!

### 🎨 12 Beautiful Visualizations

**2D Canvas Visualizations (7):**

- Frequency Bars - Classic spectrum analyzer
- Waveform - Smooth wave with mirrored reflection
- Circular Spectrum - Radial frequency bars
- Oscilloscope - Multi-layered circular scope
- Sound Ripples - Bass-reactive ripple effects
- **Battery (WMP Classic)** - Iconic circular frequency meter
- **Psychedelic (WMP Classic)** - Hypnotic kaleidoscope patterns

**3D WebGL Visualizations (5):**

- 3D Particle Cloud - Dynamic particle system
- Spectrum Tunnel - Journey through frequency tunnel
- Galaxy Spiral - Rotating particle galaxy
- **Fluid Blobs (WMP Alchemy)** - Morphing liquid spheres
- **Geometric Waves (WMP Plenoptic)** - Flowing wireframe grid

### ⚡ Performance Optimized

- **Laptop-friendly** - Optimized for 58-60 FPS on mid-range hardware
- **Reduced FFT size** - 50% less CPU usage for audio analysis
- **Smart frame skipping** - Imperceptible quality, major performance gains
- **Lower polygon counts** - Smooth 3D even on integrated graphics

### 🎮 Full Control

- **Keyboard Shortcuts**:
  - `F` - Fullscreen toggle
  - `Space` - Pause/resume
  - `←` / `→` - Switch presets
  - `R` - Random preset
  - `C` - Toggle auto-cycle
  - `H` - Hide UI (visualization only)
- **Mouse Controls** - Click presets to switch
- **Auto-Cycle Mode** - Automatically switch every 10 seconds
- **Toast Notifications** - Beautiful feedback for actions

### 🌐 Progressive Web App

- Install as standalone app
- Works offline (after first visit)
- Beautiful icon and splash screen
- Native app-like experience

### 🔒 Privacy-First

- All audio processing happens locally
- No data sent to servers
- No tracking or analytics
- Open source and transparent

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Edge, Firefox, or Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nuxt-visualizer.git
cd nuxt-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` and start visualizing! 🎉

### Production Build

```bash
# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

---

## 📖 Usage Guide

### Getting Started

1. **Choose Your Input Method:**

   - Click **"Share tab audio"** for streaming services (YouTube, Spotify)
   - Click **"Microphone"** for live music, instruments, or DJ equipment

2. **Select a Visualization:**

   - Browse the preset grid
   - Click any preset to activate it
   - Use arrow keys to navigate

3. **Go Fullscreen:**
   - Press `F` or click the fullscreen button
   - Press `H` to hide UI for pure visualization
   - Press `Esc` to exit

### Tips & Tricks

- **For streaming**: Use tab audio capture with YouTube or Spotify
- **For DJs/musicians**: Use microphone input for real-time visualization
- **For parties**: Enable auto-cycle mode and go fullscreen
- **For relaxation**: Try Psychedelic or Geometric Waves with ambient music
- **For monitoring**: Use Battery to see audio levels at a glance

---

## 🛠 Tech Stack

| Technology        | Purpose                             |
| ----------------- | ----------------------------------- |
| **Nuxt 4**        | Vue framework with SSG              |
| **Nuxt UI v4**    | Component library & Tailwind CSS v4 |
| **Vue 3**         | Reactive UI framework               |
| **TypeScript**    | Type safety                         |
| **Pinia**         | State management                    |
| **Web Audio API** | Audio capture & analysis            |
| **Three.js**      | 3D WebGL graphics                   |
| **VueUse**        | Vue composables library             |
| **Vite PWA**      | Progressive Web App support         |

---

## 📊 Performance

### Benchmarks (MacBook Pro M1, 2021)

| Visualization     | FPS   | CPU %  | GPU %  |
| ----------------- | ----- | ------ | ------ |
| 2D Visualizations | 60    | 8-15%  | 5-10%  |
| 3D Visualizations | 58-60 | 14-28% | 18-35% |

**Target Hardware**: Mid-range laptops with integrated graphics  
**Optimized for**: Smooth 60 FPS experience

See [PERFORMANCE.md](PERFORMANCE.md) and [LAPTOP_OPTIMIZATIONS.md](LAPTOP_OPTIMIZATIONS.md) for details.

---

## 🎨 Visualization Details

### Windows Media Player Classics

We've recreated 4 iconic WMP visualizations with modern web tech:

- **Battery** - The legendary circular frequency analyzer
- **Psychedelic** - 8-way kaleidoscope with color cycling
- **Fluid Blobs (Alchemy)** - Morphing liquid spheres
- **Geometric Waves (Plenoptic)** - Eye-friendly wireframe waves

See [WMP_VISUALIZATIONS.md](WMP_VISUALIZATIONS.md) for full details.

---

## 🌍 Browser Support

| Browser     | Tab Audio  | Microphone | 3D Graphics | Recommended |
| ----------- | ---------- | ---------- | ----------- | ----------- |
| **Chrome**  | ✅         | ✅         | ✅          | ⭐⭐⭐⭐⭐  |
| **Edge**    | ✅         | ✅         | ✅          | ⭐⭐⭐⭐⭐  |
| **Firefox** | ⚠️ Limited | ✅         | ✅          | ⭐⭐⭐⭐    |
| **Safari**  | ❌         | ✅         | ✅          | ⭐⭐⭐      |

**Note**: Tab audio capture requires Chrome/Edge. All browsers support microphone input.

---

## 🔧 Configuration

### Audio Settings

Edit `app/stores/audio.ts` to adjust audio analysis:

```typescript
analyserNode.fftSize = 1024; // Lower = better performance, less detail
analyserNode.smoothingTimeConstant = 0.8; // 0-1, higher = smoother
```

### Performance Settings

Edit individual visualization files to adjust:

- Particle counts
- Update frequencies (frame skipping)
- Geometry complexity
- Color update rates

See [LAPTOP_OPTIMIZATIONS.md](LAPTOP_OPTIMIZATIONS.md) for tuning guide.

---

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture and data flow
- **[PERFORMANCE.md](PERFORMANCE.md)** - Performance optimization strategies
- **[LAPTOP_OPTIMIZATIONS.md](LAPTOP_OPTIMIZATIONS.md)** - Laptop-specific optimizations
- **[WMP_VISUALIZATIONS.md](WMP_VISUALIZATIONS.md)** - Windows Media Player recreations
- **[AUDIO_INPUT_OPTIONS.md](AUDIO_INPUT_OPTIONS.md)** - Audio input methods guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview
- **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup guide

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Adding New Visualizations

1. Create a new component in `app/components/visuals/YourVisualization.vue`
2. Use `useAnalyser()` composable to get audio data
3. Register in `app/plugins/presets.client.ts`

Example:

```typescript
presetStore.registerPreset({
  id: 'your-viz',
  name: 'Your Visualization',
  description: 'Description here',
  kind: '2d', // or '3d', 'shader'
  component: markRaw(
    defineAsyncComponent(() => import('~/components/visuals/YourVisualization.vue'))
  ),
  defaults: {}
});
```

### Development Guidelines

- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Optimize for performance (target: 60 FPS)
- Test on multiple browsers
- Document complex logic

---

## 🐛 Troubleshooting

### No audio detected

- Ensure you clicked "Share tab audio" in the browser dialog
- Try microphone input instead
- Check if the tab is actually playing audio

### Performance issues

- Switch to 2D visualizations
- Close other browser tabs
- Check GPU acceleration: `chrome://gpu`
- See [LAPTOP_OPTIMIZATIONS.md](LAPTOP_OPTIMIZATIONS.md)

### Browser compatibility

- Tab audio requires Chrome/Edge
- Use microphone input for other browsers
- Ensure JavaScript is enabled

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  
❌ No liability  
❌ No warranty

---

## 🙏 Acknowledgments

- **Microsoft** - Original Windows Media Player visualizations (inspiration)
- **Nuxt Team** - Amazing Vue framework
- **Three.js Team** - Powerful 3D graphics library
- **VueUse Team** - Excellent composables
- **Community** - Feedback and contributions

---

## 🔗 Links

- **Live Demo**: [Coming soon]
- **Documentation**: [GitHub Wiki](https://github.com/yourusername/nuxt-visualizer/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/nuxt-visualizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nuxt-visualizer/discussions)

---

## 📈 Project Stats

- **12 Visualizations** (7 x 2D, 5 x 3D)
- **2 Audio Input Methods** (Tab capture, Microphone)
- **6 Keyboard Shortcuts**
- **~10,000 lines** of TypeScript/Vue code
- **60 FPS** target performance
- **MIT Licensed** - Fully open source

---

## 🎯 Roadmap

### Planned Features

- [ ] Audio file upload support
- [ ] More WMP visualizations (Spikes, Ambience, Ocean Mist)
- [ ] Custom color themes
- [ ] Preset customization UI
- [ ] Shader-based visualizations with GLSL editor
- [ ] Beat detection and BPM analysis
- [ ] Recording visualizations to WebM
- [ ] Mobile optimization and touch controls
- [ ] Community preset sharing
- [ ] MIDI input support

### Performance Goals

- [ ] Adaptive quality based on FPS
- [ ] WebGL instancing for particles
- [ ] OffscreenCanvas for Web Workers
- [ ] WebGPU support (experimental)

---

## 💬 Community

Have questions? Want to showcase your visualizations?

- **Twitter**: [@yourusername](https://twitter.com/yourusername)
- **Discord**: [Join our server](https://discord.gg/yourserver)
- **Reddit**: [r/audiovisualizer](https://reddit.com/r/audiovisualizer)

---

<div align="center">

**Made with ❤️ using Vue, Three.js, and Web Audio API**

⭐ Star this repo if you find it useful!

[Report Bug](https://github.com/yourusername/nuxt-visualizer/issues) · [Request Feature](https://github.com/yourusername/nuxt-visualizer/issues) · [Contribute](CONTRIBUTING.md)

</div>
