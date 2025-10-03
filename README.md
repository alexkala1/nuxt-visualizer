# Nuxt Audio Visualizer

A browser-based audio visualizer inspired by Windows Media Player, built with Nuxt 4 and Nuxt UI.

## Features

- **Audio capture**: Share tab audio (Chrome/Edge) or use microphone fallback
- **Multiple presets**: Bars, waveform, 3D particles, and extensible shader system
- **Preset manager**: Browse, favorite, cycle, and customize visualizations
- **Fullscreen mode**: Immersive experience with keyboard shortcuts
- **PWA**: Install as an app, works offline (capture requires online permissions)
- **Privacy-first**: All audio processing happens locally in your browser

## Tech Stack

- **Nuxt 4** (Vue 3, Vite, TypeScript)
- **Nuxt UI v4** (100+ components, Tailwind CSS)
- **Pinia** (state management)
- **Web Audio API** (capture, analysis)
- **Three.js** (3D visuals)
- **VueUse** (composables)
- **@vite-pwa/nuxt** (Progressive Web App)

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate
```

## Usage

1. Click **"Share tab audio"** and select a tab playing music
2. Make sure to enable "Share tab audio" checkbox in the browser dialog
3. Choose a visualization preset from the grid
4. Press `F` for fullscreen, `Space` to pause, arrow keys to switch presets

## Browser Support

- **Chrome/Edge**: Full support (tab audio capture)
- **Firefox**: Limited (tab sharing varies)
- **Safari**: No system/tab audio capture (mic only)

## License

MIT

