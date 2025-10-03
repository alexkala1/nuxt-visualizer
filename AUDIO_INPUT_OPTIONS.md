# Alternative Audio Input Methods

## Current Method: Tab Audio Capture

**Pros:**

- Works with any tab playing audio
- Real-time analysis
- No file upload needed

**Cons:**

- ❌ Browser notification every time
- ❌ Only works in Chrome/Edge
- ❌ User must grant permission each time

---

## Alternative Methods

### 1. 🎵 Audio File Upload

**Best for**: Analyzing local music files

```typescript
// Add to audio store
async function loadAudioFile(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const ctx = new AudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    // Create buffer source
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;

    source.connect(analyser);
    analyser.connect(ctx.destination); // Play audio

    source.start();

    // Store references
    audioCtx.value = ctx;
    analyser.value = analyser;
    status.value = 'capturing';
  } catch (err) {
    error.value = 'Failed to load audio file';
  }
}
```

**UI Component:**

```vue
<template>
  <UButton @click="$refs.fileInput.click()">
    <UIcon name="i-heroicons-document-arrow-up" />
    Upload Audio File
  </UButton>
  <input
    ref="fileInput"
    type="file"
    accept="audio/*"
    class="hidden"
    @change="handleFileUpload" />
</template>

<script setup>
  const audioStore = useAudioStore();
  const fileInput = ref(null);

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (file) {
      audioStore.loadAudioFile(file);
    }
  }
</script>
```

**Pros:**

- ✅ No browser notifications
- ✅ Works offline
- ✅ Full playback control
- ✅ Works in all browsers

**Cons:**

- ❌ Must upload file each time
- ❌ Can't visualize streaming services directly

---

### 2. 🎤 Microphone Input

**Best for**: Live music, DJs, instruments

```typescript
async function startMicrophoneCapture() {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;

    source.connect(analyser);

    // Store references
    stream.value = stream;
    audioCtx.value = ctx;
    analyser.value = analyser;
    status.value = 'capturing';
  } catch (err) {
    error.value = 'Microphone access denied';
  }
}
```

**Pros:**

- ✅ No tab sharing notification
- ✅ Perfect for live performances
- ✅ Works in all browsers
- ✅ Real-time analysis

**Cons:**

- ❌ Still requires permission (but only once, can be remembered)
- ❌ Picks up ambient noise
- ❌ Audio quality depends on mic

---

### 3. 🌐 Audio URL / Streaming

**Best for**: Online radio, podcasts, audio CDN

```typescript
async function loadAudioFromURL(url: string) {
  try {
    const ctx = new AudioContext();
    const audio = new Audio(url);
    audio.crossOrigin = 'anonymous'; // Required for CORS

    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    audio.play();

    // Store references
    audioCtx.value = ctx;
    analyser.value = analyser;
    status.value = 'capturing';
  } catch (err) {
    error.value = 'Failed to load audio from URL (CORS issue?)';
  }
}
```

**Pros:**

- ✅ No permissions needed
- ✅ Can stream from CDN
- ✅ Works with online radio

**Cons:**

- ❌ CORS restrictions (server must allow)
- ❌ Not suitable for Spotify/YouTube (DRM protected)

---

### 4. 📱 Spotify Web API Integration

**Best for**: Spotify users

```typescript
// Requires Spotify Developer Account & OAuth
async function connectSpotify() {
  // 1. Authenticate with Spotify
  const token = await getSpotifyAccessToken();

  // 2. Get currently playing track
  const track = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` }
  }).then((r) => r.json());

  // 3. Use Spotify Web Playback SDK
  const player = new Spotify.Player({
    name: 'Nuxt Visualizer',
    getOAuthToken: (cb) => cb(token)
  });

  // 4. Analyze audio from Spotify's player
  // Note: This requires premium and complex setup
}
```

**Pros:**

- ✅ Direct integration with Spotify
- ✅ No tab sharing
- ✅ Access to track metadata

**Cons:**

- ❌ Complex OAuth setup
- ❌ Requires Spotify Premium
- ❌ Limited to Spotify only
- ❌ Requires developer account

---

### 5. 🎹 Web Audio Oscillator (Demo Mode)

**Best for**: Testing without any audio source

```typescript
function startDemoMode() {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const analyser = ctx.createAnalyser();

  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.8;

  // Generate test tones
  oscillator.type = 'sine';
  oscillator.frequency.value = 440; // A4

  // Modulate frequency for interesting visuals
  setInterval(() => {
    oscillator.frequency.value = 200 + Math.random() * 400;
  }, 1000);

  oscillator.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(ctx.destination);

  gainNode.gain.value = 0.1; // Low volume
  oscillator.start();

  // Store references
  audioCtx.value = ctx;
  analyser.value = analyser;
  status.value = 'capturing';
}
```

**Pros:**

- ✅ No permissions needed
- ✅ Perfect for testing
- ✅ Always available

**Cons:**

- ❌ Not real music
- ❌ Limited visual interest

---

### 6. 📂 Drag & Drop Audio Files

**Best for**: Quick file analysis

```vue
<template>
  <div
    class="dropzone"
    @drop.prevent="handleDrop"
    @dragover.prevent
    @dragenter="isDragging = true"
    @dragleave="isDragging = false">
    Drop audio file here
  </div>
</template>

<script setup>
  const isDragging = ref(false);
  const audioStore = useAudioStore();

  function handleDrop(event: DragEvent) {
    isDragging.value = false;
    const file = event.dataTransfer?.files[0];

    if (file && file.type.startsWith('audio/')) {
      audioStore.loadAudioFile(file);
    }
  }
</script>
```

**Pros:**

- ✅ Very user-friendly
- ✅ No permissions
- ✅ Fast workflow

**Cons:**

- ❌ Still requires file upload

---

## Recommended Implementation

### Multi-Source Audio Input

```typescript
// app/stores/audio.ts

export const useAudioStore = defineStore('audio', () => {
  const inputMethod = ref<'tab' | 'file' | 'mic' | 'url' | 'demo'>('tab');

  // Existing tab capture
  async function startTabCapture() {
    inputMethod.value = 'tab';
    // ... existing code
  }

  // NEW: File upload
  async function startFileCapture(file: File) {
    inputMethod.value = 'file';
    const arrayBuffer = await file.arrayBuffer();
    const ctx = new AudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true; // Loop the audio

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;

    source.connect(analyser);
    analyser.connect(ctx.destination);
    source.start();

    audioCtx.value = ctx;
    analyser.value = analyser;
    status.value = 'capturing';
  }

  // NEW: Microphone
  async function startMicCapture() {
    inputMethod.value = 'mic';
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;

    source.connect(analyser);

    stream.value = stream;
    audioCtx.value = ctx;
    analyser.value = analyser;
    status.value = 'capturing';
  }

  // NEW: Demo mode
  function startDemoMode() {
    inputMethod.value = 'demo';
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;

    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 220;

    oscillator.connect(analyser);
    // Don't connect to destination (silent)

    // Modulate for visuals
    let freq = 220;
    setInterval(() => {
      freq = 100 + Math.random() * 800;
      oscillator.frequency.value = freq;
    }, 500);

    oscillator.start();

    audioCtx.value = ctx;
    analyser.value = analyser;
    status.value = 'capturing';
  }

  return {
    inputMethod,
    startTabCapture,
    startFileCapture,
    startMicCapture,
    startDemoMode
    // ... other exports
  };
});
```

### Updated UI

```vue
<!-- app/pages/index.vue -->
<template>
  <div class="flex gap-2">
    <!-- Tab Audio (existing) -->
    <UButton
      color="primary"
      icon="i-heroicons-arrow-up-tray"
      @click="audioStore.startTabCapture()">
      Share Tab Audio
    </UButton>

    <!-- File Upload -->
    <UButton
      icon="i-heroicons-document-arrow-up"
      variant="soft"
      @click="$refs.fileInput.click()">
      Upload File
    </UButton>
    <input
      ref="fileInput"
      type="file"
      accept="audio/*"
      class="hidden"
      @change="handleFileUpload" />

    <!-- Microphone -->
    <UButton
      icon="i-heroicons-microphone"
      variant="soft"
      @click="audioStore.startMicCapture()">
      Microphone
    </UButton>

    <!-- Demo Mode -->
    <UButton
      icon="i-heroicons-beaker"
      variant="ghost"
      @click="audioStore.startDemoMode()">
      Demo
    </UButton>
  </div>
</template>
```

---

## Comparison Table

| Method          | No Notification | Real-time | Works Offline | Browser Support  | Ease of Use |
| --------------- | --------------- | --------- | ------------- | ---------------- | ----------- |
| **Tab Audio**   | ❌              | ✅        | ❌            | Chrome/Edge only | ⭐⭐⭐      |
| **File Upload** | ✅              | ✅        | ✅            | All browsers     | ⭐⭐⭐⭐⭐  |
| **Microphone**  | ✅              | ✅        | ✅            | All browsers     | ⭐⭐⭐⭐    |
| **Audio URL**   | ✅              | ✅        | ❌            | All browsers     | ⭐⭐⭐      |
| **Spotify API** | ✅              | ✅        | ❌            | All browsers     | ⭐⭐        |
| **Demo Mode**   | ✅              | ✅        | ✅            | All browsers     | ⭐⭐⭐⭐⭐  |

---

## Recommendation

**Best approach**: Implement **File Upload** + **Microphone** options alongside tab audio.

### Why?

1. **File Upload** - Most user-friendly, no notifications, works everywhere
2. **Microphone** - Great for live performances, DJs, instruments
3. **Keep Tab Audio** - Still useful for YouTube, streaming services

This gives users flexibility while eliminating the notification annoyance for most use cases.

---

## Next Steps

1. Add file upload button to header
2. Add microphone button with permission handling
3. Add "input source" indicator showing which method is active
4. Add drag & drop zone for audio files
5. Save user's preferred input method to localStorage

---

**Last Updated**: October 3, 2025  
**Recommended**: File Upload + Microphone + Tab Audio
