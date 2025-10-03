# Quick Start Guide

Get the Nuxt Audio Visualizer running in under 2 minutes.

## Prerequisites

- **Node.js 18+** (20+ recommended)
- **npm**, **pnpm**, or **yarn**

Check your version:
```bash
node --version  # Should be v18.0.0 or higher
```

## Installation

```bash
# Navigate to project
cd /tmp/nuxt-visualizer

# Install dependencies (choose one)
npm install
# OR
pnpm install
# OR
yarn install
```

## Run Development Server

```bash
npm run dev
```

Open your browser to **http://localhost:3000**

## First Use

1. **Click "Share tab audio"** button in the header
2. In the browser dialog:
   - Select a tab that's playing audio (YouTube, Spotify, etc.)
   - **Important**: Check the "Share tab audio" checkbox
   - Click "Share"
3. The visualization will start automatically
4. Switch presets by clicking cards below

## Common Issues

### "No audio track found" error
- Make sure you checked "Share tab audio" in the browser dialog
- Try Chrome or Edge (best support)

### No sound/visualization
- Verify the source tab is actually playing audio
- Check your system volume
- Try refreshing and recapturing

### TypeScript errors
```bash
npm run postinstall
```

### Port already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

## Build for Production

```bash
# Generate static site
npm run generate

# Output is in .output/public/
```

## Deploy

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
# Drag and drop .output/public/ to Netlify
# OR
netlify deploy --prod --dir=.output/public
```

### GitHub Pages
```bash
# Push .output/public/ contents to gh-pages branch
git subtree push --prefix .output/public origin gh-pages
```

## Keyboard Shortcuts

Once audio is capturing:

| Key | Action |
|-----|--------|
| `F` | Toggle fullscreen |
| `Space` | Pause/resume |
| `←` / `→` | Previous/next preset |
| `R` | Random preset |
| `C` | Toggle auto-cycle |

## Next Steps

- ✅ **Add more presets**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- ✅ **Customize colors**: Edit Tailwind classes in components
- ✅ **Add icons**: Replace `public/icon-*.png` with real icons
- ✅ **Configure PWA**: Update `nuxt.config.ts` manifest
- ✅ **Add analytics**: Install Nuxt analytics module

## Project Files

```
Key files to know:
├── app/
│   ├── pages/index.vue              ← Main page
│   ├── stores/audio.ts              ← Audio capture logic
│   ├── stores/preset.ts             ← Preset management
│   ├── components/visuals/          ← Add new presets here
│   └── plugins/presets.client.ts    ← Register presets
├── nuxt.config.ts                   ← Config
└── package.json                     ← Dependencies
```

## Adding a New Preset

1. **Create component**:
```vue
<!-- app/components/visuals/MyPreset.vue -->
<template>
  <canvas ref="canvas" class="w-full h-full" />
</template>

<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>()
const { getFrequencyData } = useAnalyser()
const audioStore = useAudioStore()

useRafFn(() => {
  if (!canvas.value || !audioStore.isCapturing) return
  const data = getFrequencyData()
  // Your rendering logic here
})
</script>
```

2. **Register in plugin**:
```ts
// app/plugins/presets.client.ts
const MyPreset = defineAsyncComponent(() => import('~/components/visuals/MyPreset.vue'))

presetStore.registerPreset({
  id: 'my-preset',
  name: 'My Preset',
  description: 'Does cool things',
  kind: '2d',
  component: MyPreset,
  defaults: {}
})
```

3. **Refresh page** - your preset appears in the grid!

## Getting Help

- 📖 Read [README.md](./README.md) for user guide
- 🏗️ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- 📦 Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for full feature list
- 🛠️ Read [SETUP.md](./SETUP.md) for detailed setup

## Troubleshooting

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules .nuxt .output
npm install
npm run dev
```

### PWA not updating
```bash
# Clear service worker cache
# In DevTools: Application → Service Workers → Unregister
# Then refresh
```

### Three.js not rendering
- Check browser console for WebGL errors
- Verify GPU acceleration is enabled
- Try a simpler 2D preset first

## Development Tips

- **Hot reload**: Edits auto-refresh (components, stores, composables)
- **DevTools**: Vue DevTools extension for debugging stores
- **Performance**: Check FPS in browser DevTools → Performance tab
- **Audio levels**: Watch the bass/mid/treble meters to debug audio capture

## Production Checklist

Before deploying:

- [ ] Test audio capture on target domain (must be HTTPS)
- [ ] Replace placeholder icons (192x192, 512x512)
- [ ] Update manifest name/description in `nuxt.config.ts`
- [ ] Test on Chrome, Firefox, Safari
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Enable TypeScript type checking: set `typeCheck: true` in config
- [ ] Add error tracking (Sentry, LogRocket, etc.)

## License

MIT - feel free to customize and deploy!

---

**Happy visualizing! 🎵✨**

