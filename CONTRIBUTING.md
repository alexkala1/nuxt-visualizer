# Contributing to Nuxt Audio Visualizer

First off, thank you for considering contributing to Nuxt Audio Visualizer! 🎉

This document provides guidelines for contributing to the project. Following these guidelines helps maintain a high-quality codebase and makes the review process smoother for everyone.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Adding Visualizations](#adding-visualizations)
- [Performance Guidelines](#performance-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Style Guide](#style-guide)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for everyone. Please be respectful and constructive in all interactions.

### Expected Behavior

- Be kind and courteous
- Respect differing viewpoints
- Give and receive constructive feedback gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Personal attacks or insults
- Publishing others' private information
- Other conduct inappropriate in a professional setting

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating a bug report:

1. Check the [existing issues](https://github.com/yourusername/nuxt-visualizer/issues)
2. Make sure you're using the latest version
3. Test in multiple browsers if possible

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g., Windows 11, macOS 14]
- Browser: [e.g., Chrome 120, Firefox 121]
- Version: [e.g., 2.0.0]

**Additional context**
Any other relevant information.
```

### Suggesting Features

Feature suggestions are welcome! Please:

1. Check existing feature requests
2. Explain the use case clearly
3. Consider backward compatibility
4. Include mockups or examples if applicable

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other approaches you've thought about.

**Additional context**
Mockups, examples, or references.
```

### Creating Visualizations

New visualizations are always welcome! See [Adding Visualizations](#adding-visualizations) section below.

### Improving Documentation

Documentation improvements are highly valued:

- Fix typos or unclear explanations
- Add examples or clarifications
- Translate documentation (future)
- Write tutorials or guides

---

## 🛠 Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Modern browser (Chrome, Edge, Firefox, or Safari)

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/yourusername/nuxt-visualizer.git
cd nuxt-visualizer

# Add upstream remote
git remote add upstream https://github.com/originalowner/nuxt-visualizer.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your changes live.

### Build for Production

```bash
# Static generation
npm run generate

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
nuxt-visualizer/
├── app/
│   ├── assets/
│   │   └── css/              # Global CSS
│   ├── components/
│   │   ├── visuals/          # Visualization components
│   │   ├── PresetGrid.vue    # Preset selector
│   │   └── VisualizerStage.vue
│   ├── composables/
│   │   ├── useAnalyser.ts    # Audio analysis
│   │   └── useKeyboardShortcuts.ts
│   ├── pages/
│   │   └── index.vue         # Main page
│   ├── plugins/
│   │   └── presets.client.ts # Preset registration
│   ├── stores/
│   │   ├── audio.ts          # Audio capture state
│   │   └── preset.ts         # Preset management
│   └── app.vue               # Root component
├── public/                   # Static assets
├── *.md                      # Documentation
├── LICENSE                   # MIT License
├── nuxt.config.ts            # Nuxt configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

---

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for complex objects
- Avoid `any` when possible
- Use strict mode

```typescript
// Good
interface AudioLevels {
  bass: number;
  mid: number;
  treble: number;
}

// Avoid
let levels: any = { bass: 0 };
```

### Vue Composition API

- Use `<script setup>` syntax
- Use `ref` for reactive primitives
- Use `shallowRef` for heavy objects (Three.js, AudioContext)
- Use `markRaw` for Vue components
- Destructure props with `defineProps`

```vue
<script setup lang="ts">
  import { ref, shallowRef } from 'vue';

  // Good
  const count = ref(0);
  const scene = shallowRef(new THREE.Scene());

  // Props
  interface Props {
    isUIHidden?: boolean;
  }
  const props = defineProps<Props>();
</script>
```

### Component Guidelines

- Keep components focused and single-purpose
- Use composition API over options API
- Extract reusable logic to composables
- Clean up resources in `onBeforeUnmount`

---

## 🎨 Adding Visualizations

### Step 1: Create Component

Create `app/components/visuals/YourVisualization.vue`:

```vue
<template>
  <canvas
    ref="canvasRef"
    class="w-full h-full" />
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRafFn } from '@vueuse/core';
  import { useAnalyser } from '~/composables/useAnalyser';

  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const { getFrequencyData, getTimeDomainData, computeLevels } = useAnalyser();

  onMounted(() => {
    if (!canvasRef.value) return;

    const ctx = canvasRef.value.getContext('2d', {
      alpha: false,
      desynchronized: true
    });
    if (!ctx) return;

    // Setup your visualization

    useRafFn(() => {
      // Animation loop
      const frequencyData = getFrequencyData();
      const levels = computeLevels(frequencyData);

      // Render your visualization
    });
  });

  onBeforeUnmount(() => {
    // Clean up resources
  });
</script>
```

### Step 2: Register Preset

In `app/plugins/presets.client.ts`:

```typescript
import { markRaw, defineAsyncComponent } from 'vue';

const YourVisualization = markRaw(
  defineAsyncComponent(() => import('~/components/visuals/YourVisualization.vue'))
);

presetStore.registerPreset({
  id: 'your-viz',
  name: 'Your Visualization',
  description: 'Brief description of what it does',
  kind: '2d', // or '3d', 'shader'
  component: YourVisualization,
  defaults: {}
});
```

### Step 3: Test

1. Start dev server: `npm run dev`
2. Test with tab audio
3. Test with microphone
4. Test in different browsers
5. Check performance (60 FPS target)

---

## ⚡ Performance Guidelines

### Target Performance

- **60 FPS** on mid-range laptops
- **CPU usage**: < 30%
- **GPU usage**: < 40%

### Optimization Techniques

#### 1. Audio Analysis

```typescript
// Use optimized FFT size
analyserNode.fftSize = 1024; // Not 2048 or 4096
analyserNode.smoothingTimeConstant = 0.8;
```

#### 2. Canvas 2D

```typescript
// Cap device pixel ratio
const dpr = Math.min(window.devicePixelRatio, 1.5);

// Use optimized context
const ctx = canvas.getContext('2d', {
  alpha: false, // Faster if you don't need transparency
  desynchronized: true // Allow browser to optimize
});
```

#### 3. Three.js / WebGL

```typescript
// Optimized renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef.value,
  antialias: false, // Disable for 30-40% GPU boost
  powerPreference: 'high-performance',
  stencil: false,
  depth: false // If you don't need depth testing
});

// Cap pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

// Lower particle counts
const particleCount = 2000; // Not 5000+

// Lower geometry complexity
const geometry = new THREE.SphereGeometry(1, 12, 12); // Not 32, 32
```

#### 4. Frame Skipping

```typescript
let frame = 0;
useRafFn(() => {
  frame++;

  // Update expensive things less frequently
  if (frame % 3 === 0) {
    updateColors();
  }

  // Always update positions/critical things
  updatePositions();
});
```

#### 5. Cache Calculations

```typescript
// Bad: Recalculates every loop
for (let i = 0; i < 100; i++) {
  const time = Date.now() * 0.001;
  positions[i] = Math.sin(time + i);
}

// Good: Calculate once
const time = Date.now() * 0.001;
for (let i = 0; i < 100; i++) {
  positions[i] = Math.sin(time + i);
}
```

### Performance Testing

Use browser DevTools:

1. Performance monitor: CPU/GPU usage
2. FPS meter: Target 60 FPS
3. Memory profiler: Check for leaks
4. Network throttling: Test on slower connections

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Works with tab audio (Chrome/Edge)
- [ ] Works with microphone (all browsers)
- [ ] Visualizes correctly with music
- [ ] No console errors or warnings
- [ ] Performance: 58-60 FPS
- [ ] Responsive: Works at different screen sizes
- [ ] Fullscreen mode works
- [ ] Keyboard shortcuts work
- [ ] Clean up: No memory leaks
- [ ] Browser compatibility: Chrome, Edge, Firefox, Safari

### Testing Commands

```bash
# Type checking
npx nuxi typecheck

# Build test
npm run build

# Production preview
npm run preview
```

---

## 📝 Submitting Changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactor
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Build/tooling changes

**Examples:**

```bash
git commit -m "feat(visuals): add new kaleidoscope visualization"
git commit -m "fix(audio): resolve microphone permission handling"
git commit -m "docs: update contributing guidelines"
git commit -m "perf(3d): reduce particle count for better FPS"
```

### Pull Request Process

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Follow coding standards
   - Add/update documentation
   - Test thoroughly

3. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

4. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Use the PR template
   - Link related issues
   - Describe changes clearly
   - Add screenshots/videos for UI changes

### Pull Request Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested in multiple browsers
- [ ] Performance is acceptable (60 FPS)

## Screenshots/Videos

If applicable, add visual evidence.

## Related Issues

Fixes #123
```

---

## 🎨 Style Guide

### Vue Template

```vue
<!-- Good -->
<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold">Title</h1>
    <p>Content</p>
  </div>
</template>

<!-- Use v-if/v-for correctly -->
<div v-if="isVisible" class="item">
  <span>{{ text }}</span>
</div>
```

### CSS / Tailwind

- Use Tailwind utility classes
- Avoid custom CSS unless necessary
- Use Nuxt UI components when possible
- Responsive by default

```vue
<!-- Good -->
<div class="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
  <UButton color="primary">Action</UButton>
</div>
```

### File Naming

- Components: `PascalCase.vue` (e.g., `PresetGrid.vue`)
- Composables: `camelCase.ts` (e.g., `useAnalyser.ts`)
- Stores: `camelCase.ts` (e.g., `audio.ts`)
- Types: `PascalCase` (e.g., `AudioLevels`)

---

## 🌟 Recognition

Contributors will be:

- Listed in README.md
- Credited in CHANGELOG.md
- Thanked in release notes
- Given attribution in documentation

---

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/nuxt-visualizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nuxt-visualizer/discussions)
- **Email**: [your-email@example.com]

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Nuxt Audio Visualizer!** 🎉

Your contributions help make this project better for everyone. We appreciate your time and effort! ❤️
