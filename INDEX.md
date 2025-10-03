# Nuxt Audio Visualizer - Documentation Index

Welcome! This is your central guide to all documentation for the Nuxt Audio Visualizer project.

## 📁 Project Location

```
/tmp/nuxt-visualizer/
```

## 🚀 Getting Started (Choose Your Path)

### For Users
→ **[README.md](./README.md)** - User guide, features, browser support

### For Developers
→ **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 2 minutes

### For DevOps/Deployment
→ **[SETUP.md](./SETUP.md)** - Detailed installation and deployment guide

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | Fast setup, first run, common issues | 🟢 Start here |
| **[README.md](./README.md)** | User documentation, features, usage | After running |
| **[SETUP.md](./SETUP.md)** | Installation, build, deploy details | Before deploying |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Technical architecture, diagrams, flow | Extending/debugging |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Full feature list, tech stack, API reference | Detailed overview |
| **[COMMANDS.md](./COMMANDS.md)** | All npm commands, scripts, workflows | Daily development |

## 🎯 Common Tasks

### I want to...

#### ...run the project for the first time
1. Read **[QUICKSTART.md](./QUICKSTART.md)**
2. Run `npm install && npm run dev`
3. Open http://localhost:3000

#### ...understand the architecture
1. Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System diagrams
2. Read **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - API reference

#### ...add a new visualization preset
1. Read **[QUICKSTART.md](./QUICKSTART.md)** → "Adding a New Preset" section
2. Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** → "Extension Points"
3. Create component in `app/components/visuals/`
4. Register in `app/plugins/presets.client.ts`

#### ...deploy to production
1. Read **[SETUP.md](./SETUP.md)** → "Deploy" section
2. Read **[COMMANDS.md](./COMMANDS.md)** → "Deployment Platforms"
3. Run `npm run generate`
4. Upload `.output/public/` to your host

#### ...customize colors/styling
1. Edit Tailwind classes in components (`app/components/`)
2. Modify color schemes in visualization files (`app/components/visuals/`)
3. Check **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** → "Future Enhancements"

#### ...fix TypeScript errors
1. Run `npm run postinstall`
2. Check **[QUICKSTART.md](./QUICKSTART.md)** → "Common Issues"
3. Check **[COMMANDS.md](./COMMANDS.md)** → "Debugging"

#### ...understand data flow
1. Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** → "Data Flow" section
2. Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** → "System Diagram"

#### ...update dependencies
1. Read **[COMMANDS.md](./COMMANDS.md)** → "Package Management"
2. Run `npm outdated` to check versions
3. Run `npx npm-check-updates -u && npm install`

## 🏗️ Project Structure

```
/tmp/nuxt-visualizer/
├── 📄 Documentation
│   ├── INDEX.md              ← You are here
│   ├── README.md             ← User guide
│   ├── QUICKSTART.md         ← Fast start
│   ├── SETUP.md              ← Installation details
│   ├── ARCHITECTURE.md       ← Technical deep dive
│   ├── PROJECT_SUMMARY.md    ← Full overview
│   └── COMMANDS.md           ← Command reference
│
├── 📦 Configuration
│   ├── package.json          ← Dependencies
│   ├── nuxt.config.ts        ← Nuxt config
│   ├── tsconfig.json         ← TypeScript config
│   ├── .gitignore            ← Git ignore rules
│   └── .npmrc                ← npm config
│
├── 🎨 Application Code
│   └── app/
│       ├── components/       ← Vue components
│       │   ├── visuals/      ← Visualization presets
│       │   ├── PresetCard.vue
│       │   ├── PresetGrid.vue
│       │   └── VisualizerStage.vue
│       ├── composables/      ← Reusable logic
│       │   ├── useAnalyser.ts
│       │   └── useKeyboardShortcuts.ts
│       ├── pages/            ← Routes
│       │   └── index.vue
│       ├── plugins/          ← Nuxt plugins
│       │   └── presets.client.ts
│       ├── stores/           ← Pinia stores
│       │   ├── audio.ts      ← Audio capture state
│       │   └── preset.ts     ← Preset management
│       └── app.vue           ← Root component
│
└── 📁 Public Assets
    └── public/
        ├── favicon.svg
        ├── icon-192.png
        └── icon-512.png
```

## 🔧 Technology Stack

### Core Framework
- **Nuxt 4.0.0** - Full-stack Vue framework
- **Vue 3.5.12** - Progressive JavaScript framework
- **TypeScript 5.6.3** - Type-safe JavaScript
- **Vite** - Fast build tool (bundled with Nuxt)

### UI & Styling
- **@nuxt/ui 4.0.0** - Component library (100+ components)
- **Tailwind CSS** - Utility-first CSS framework

### State & Utilities
- **Pinia 2.2.6** - Vue state management
- **@vueuse/nuxt 11.2.0** - Vue composables collection

### Audio & Graphics
- **Web Audio API** - Browser audio processing
- **Canvas 2D** - 2D rendering
- **Three.js 0.169.0** - 3D WebGL library

### PWA
- **@vite-pwa/nuxt 0.10.5** - Progressive Web App support

## 📊 Features at a Glance

✅ **Audio Capture** - Share tab audio from browser  
✅ **3 Visualization Presets** - Bars, Waveform, 3D Particles  
✅ **Preset Manager** - Grid view, favorites, descriptions  
✅ **Keyboard Shortcuts** - F, Space, Arrows, R, C  
✅ **Fullscreen Mode** - Immersive experience  
✅ **Auto-Cycle** - Automatically switch presets  
✅ **Audio Levels** - Real-time bass/mid/treble meters  
✅ **State Persistence** - Remember preferences in localStorage  
✅ **PWA** - Installable, works offline (UI only)  
✅ **Responsive** - Works on mobile, tablet, desktop  

## 🎓 Learning Path

### Beginner
1. Read **[QUICKSTART.md](./QUICKSTART.md)**
2. Run the app
3. Play with presets
4. Read **[README.md](./README.md)**

### Intermediate
1. Read **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)**
2. Explore code in `app/components/visuals/`
3. Try modifying a preset
4. Add a simple new preset

### Advanced
1. Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** fully
2. Study Pinia stores (`app/stores/`)
3. Understand audio analysis (`app/composables/useAnalyser.ts`)
4. Create complex shader-based preset
5. Implement beat detection with AudioWorklet

## 🐛 Troubleshooting Guide

| Issue | Solution | Doc Reference |
|-------|----------|---------------|
| Can't install deps | Check Node version (18+) | [QUICKSTART.md](./QUICKSTART.md) |
| TypeScript errors | Run `npm run postinstall` | [QUICKSTART.md](./QUICKSTART.md) |
| No audio captured | Enable "Share tab audio" checkbox | [README.md](./README.md) |
| Slow performance | Reduce particles, lower FFT size | [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) |
| Build fails | Clear cache: `rm -rf .nuxt .output` | [COMMANDS.md](./COMMANDS.md) |
| PWA not updating | Unregister service worker | [COMMANDS.md](./COMMANDS.md) |

## 🚢 Deployment Quick Reference

| Platform | Command | Docs |
|----------|---------|------|
| **Vercel** | `vercel deploy` | [SETUP.md](./SETUP.md) |
| **Netlify** | `netlify deploy --prod --dir=.output/public` | [SETUP.md](./SETUP.md) |
| **GitHub Pages** | `git subtree push --prefix .output/public origin gh-pages` | [COMMANDS.md](./COMMANDS.md) |
| **Static Host** | Upload `.output/public/` via FTP/SFTP | [SETUP.md](./SETUP.md) |

## 📞 Support & Resources

### Internal Docs
- All documentation is in `/tmp/nuxt-visualizer/`
- Start with [QUICKSTART.md](./QUICKSTART.md)

### External Resources
- **Nuxt**: https://nuxt.com/docs
- **Nuxt UI**: https://ui.nuxt.com
- **Vue**: https://vuejs.org
- **Three.js**: https://threejs.org/docs
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Pinia**: https://pinia.vuejs.org

### Community
- Nuxt Discord: https://discord.com/invite/nuxt
- Vue Discord: https://discord.com/invite/vue

## 📝 Notes

- **Browser Support**: Best in Chrome/Edge; limited in Safari (no tab audio)
- **HTTPS Required**: Audio capture needs HTTPS in production (localhost OK)
- **Privacy**: All audio processing is local; nothing sent to servers
- **Performance**: Target 60 FPS on mid-range laptops

## 🎉 Quick Wins

Try these to get familiar:

1. **Change bar colors**: Edit `app/components/visuals/Bars2D.vue` line ~50
2. **Adjust particle count**: Edit `app/components/visuals/Particles3D.vue` line ~10
3. **Add a favorite**: Click star on any preset
4. **Try fullscreen**: Press `F` while visualizing
5. **Auto-cycle presets**: Click "Auto-cycle" button or press `C`

## 📈 Next Steps

After getting familiar:

- [ ] Replace placeholder icons (`public/icon-*.png`)
- [ ] Customize colors/theme
- [ ] Add your own visualization preset
- [ ] Deploy to production
- [ ] Share with friends!

---

**Ready to start?** → Jump to **[QUICKSTART.md](./QUICKSTART.md)**

**Need details?** → Check **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)**

**Want to extend?** → Read **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

*Built with Nuxt 4, Vue 3, and Three.js | October 2025*

