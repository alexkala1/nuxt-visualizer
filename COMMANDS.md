# Command Reference

All available commands for the Nuxt Audio Visualizer project.

## Package Manager Commands

You can use `npm`, `pnpm`, or `yarn`. Examples use `npm`.

### Install Dependencies
```bash
npm install        # First-time install
npm ci             # Clean install (CI/CD)
```

### Development
```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run dev -- --port 3001  # Custom port
```

### Build & Generate
```bash
npm run build      # Build for production
npm run generate   # Generate static site → .output/public/
npm run preview    # Preview production build locally
```

### Post-install
```bash
npm run postinstall   # Regenerate Nuxt types (auto-runs after install)
```

## Environment Variables

Create `.env` file in project root:

```bash
# Optional: Custom port
NUXT_PORT=3001

# Optional: Base URL for deployment
NUXT_APP_BASE_URL=/my-app/

# Optional: Disable PWA in dev
VITE_PWA_DISABLED=true
```

## Development Workflow

### 1. Start fresh project
```bash
cd /tmp/nuxt-visualizer
npm install
npm run dev
```

### 2. Make changes
- Edit files in `app/`
- Changes auto-reload in browser
- Check console for errors

### 3. Build for production
```bash
npm run generate
```

### 4. Test production build locally
```bash
npm run preview
```

### 5. Deploy
```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod --dir=.output/public

# Manual
# Upload .output/public/ to your host
```

## Useful npm Scripts (Custom)

You can add these to `package.json` scripts:

```json
{
  "scripts": {
    "clean": "rm -rf node_modules .nuxt .output",
    "fresh": "npm run clean && npm install",
    "type-check": "nuxi typecheck",
    "lint": "eslint .",
    "format": "prettier --write .",
    "analyze": "nuxi analyze"
  }
}
```

Then run:
```bash
npm run clean      # Remove generated files
npm run fresh      # Full reinstall
npm run type-check # Check TypeScript errors
npm run lint       # Run ESLint
npm run format     # Format with Prettier
npm run analyze    # Analyze bundle size
```

## Node.js Version Management

### Using nvm (recommended)
```bash
# Install Node 20 (latest LTS)
nvm install 20
nvm use 20

# Create .nvmrc for project
echo "20" > .nvmrc

# Others can then use:
nvm use
```

### Using volta
```bash
volta install node@20
```

## Debugging

### Dev Server
```bash
# Verbose logging
DEBUG=* npm run dev

# Node inspector
node --inspect node_modules/.bin/nuxi dev
```

### Type Errors
```bash
# Regenerate types
rm -rf .nuxt
npm run postinstall
npm run dev
```

### Build Errors
```bash
# Clear cache
rm -rf .nuxt .output
npm run generate
```

## Package Management

### Update Dependencies
```bash
# Check outdated
npm outdated

# Update all to latest (careful!)
npx npm-check-updates -u
npm install

# Update specific package
npm install @nuxt/ui@latest
```

### Add New Package
```bash
# Runtime dependency
npm install package-name

# Dev dependency
npm install -D package-name

# Specific version
npm install three@0.169.0
```

### Remove Package
```bash
npm uninstall package-name
```

## Git Workflow

### Initial commit
```bash
git init
git add .
git commit -m "Initial commit: Nuxt Audio Visualizer"
```

### Feature branch
```bash
git checkout -b feature/new-preset
# Make changes
git add .
git commit -m "Add new preset: Spectrum 3D"
git push origin feature/new-preset
```

### Deploy from main
```bash
git checkout main
git pull origin main
npm run generate
# Deploy .output/public/
```

## Performance Testing

### Lighthouse (Chrome DevTools)
```bash
# Build production version
npm run generate

# Serve locally
npm run preview

# Open http://localhost:3000
# DevTools → Lighthouse → Analyze page load
```

### Bundle Analysis
```bash
# Add analyze script to package.json first
npm run analyze

# Or use nuxi
npx nuxi analyze
```

## Testing Audio Capture

### Chrome DevTools
```bash
# 1. Open DevTools → Application → Service Workers
# 2. Check "Bypass for network"
# 3. Start audio capture
# 4. DevTools → Console for errors
```

### Test URLs (for audio capture)
- YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
- SoundCloud: https://soundcloud.com/
- Spotify Web Player: https://open.spotify.com/

## Deployment Platforms

### Vercel (recommended)
```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### Netlify
```bash
# Install CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --dir=.output/public

# Production
netlify deploy --prod --dir=.output/public
```

### GitHub Pages
```bash
# Build
npm run generate

# Push to gh-pages branch
git subtree push --prefix .output/public origin gh-pages
```

### Static Host (any)
```bash
# Build
npm run generate

# Upload .output/public/ contents via FTP/SFTP
# Or use rsync:
rsync -avz .output/public/ user@host:/var/www/html/
```

## Docker (Optional)

### Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run generate
FROM nginx:alpine
COPY --from=0 /app/.output/public /usr/share/nginx/html
EXPOSE 80
```

### Build & Run
```bash
docker build -t nuxt-visualizer .
docker run -p 8080:80 nuxt-visualizer
```

## CI/CD Examples

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./.output/public
```

### GitLab CI
```yaml
# .gitlab-ci.yml
image: node:20
stages:
  - build
  - deploy
build:
  stage: build
  script:
    - npm ci
    - npm run generate
  artifacts:
    paths:
      - .output/public
deploy:
  stage: deploy
  script:
    - echo "Deploy to your host"
  only:
    - main
```

## Helpful Resources

- **Nuxt Docs**: https://nuxt.com/docs
- **Nuxt UI Docs**: https://ui.nuxt.com
- **Vue Docs**: https://vuejs.org
- **Three.js Docs**: https://threejs.org/docs
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

## Quick Tips

- 🔥 **Hot reload not working?** Restart dev server
- 🐛 **Type errors?** Run `npm run postinstall`
- 📦 **Slow install?** Use `pnpm` (faster than npm)
- 🚀 **Slow builds?** Check bundle size with `nuxi analyze`
- 🎨 **UI broken?** Check Tailwind classes, verify `@nuxt/ui` installed
- 🔊 **No audio?** Check browser console, verify tab audio enabled

---

**Need help? Check the other docs:**
- [QUICKSTART.md](./QUICKSTART.md) - Get running fast
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical deep dive
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Full feature list

