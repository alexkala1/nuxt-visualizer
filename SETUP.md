# Setup Instructions

## Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm, pnpm, or yarn

## Installation

```bash
cd /tmp/nuxt-visualizer

# Install dependencies (choose one)
npm install
# or
pnpm install
# or
yarn install
```

## Development

```bash
# Start dev server
npm run dev
# or
pnpm dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

## Building for Production

```bash
# Generate static site
npm run generate
# or
pnpm generate
# or
yarn generate

# Output will be in .output/public/
```

## Deploy

Deploy the `.output/public/` directory to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `.output/public/` or use Netlify CLI
- **GitHub Pages**: Push `.output/public/` to `gh-pages` branch
- **Any static host**: Upload `.output/public/` contents

## Notes

- **HTTPS required**: Audio capture requires HTTPS in production (localhost works without)
- **Browser support**: Best in Chrome/Edge; limited in Safari
- **Icons**: Replace placeholder PNGs in `public/` with real icons (192x192 and 512x512)

## Project Structure

```
/tmp/nuxt-visualizer/
├── app/
│   ├── components/
│   │   ├── visuals/          # Visualization presets
│   │   ├── PresetCard.vue
│   │   ├── PresetGrid.vue
│   │   └── VisualizerStage.vue
│   ├── composables/          # Reusable logic
│   ├── pages/
│   │   └── index.vue
│   ├── plugins/
│   │   └── presets.client.ts # Register presets
│   ├── stores/               # Pinia stores
│   │   ├── audio.ts
│   │   └── preset.ts
│   └── app.vue
├── public/                   # Static assets
├── nuxt.config.ts
├── package.json
└── README.md
```

## Adding New Presets

1. Create a new component in `app/components/visuals/YourPreset.vue`
2. Register it in `app/plugins/presets.client.ts`
3. Use `useAnalyser()` composable to get audio data
4. Render using Canvas 2D, Three.js, or raw WebGL

## Troubleshooting

- **No audio**: Make sure to check "Share tab audio" in the browser dialog
- **Performance issues**: Reduce particle count or FFT size in preset defaults
- **TypeScript errors**: Run `npm run postinstall` to regenerate Nuxt types

