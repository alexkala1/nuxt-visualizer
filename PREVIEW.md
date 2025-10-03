# Visual Preview

ASCII mockups of the Nuxt Audio Visualizer UI.

## Main Page (Not Capturing)

```
┌────────────────────────────────────────────────────────────────┐
│  🎵 Nuxt Audio Visualizer          [Share tab audio] [⛶]     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ℹ️ How to start                                              │
│  Click 'Share tab audio', select the tab playing music, and   │
│  enable 'Share tab audio' in the browser dialog.              │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Choose a visualization          [🔀 Random] [▶ Auto-cycle]  │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   ░░▒▒▓▓     │  │   ∿∿∿∿∿∿∿    │  │   ∴∵∴∵∴∵     │        │
│  │   ▁▂▃▄▅▆▇█   │  │   ∿∿∿∿∿∿∿    │  │   ∵∴∵∴∵∴     │        │
│  │              │  │              │  │              │        │
│  │ 2D           │  │ 2D           │  │ 3D           │        │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤        │
│  │ Frequency    │  │ Waveform  ⭐ │  │ 3D Particles │        │
│  │ Bars      ⭐ │  │              │  │           ⭐ │        │
│  │ Classic      │  │ Smooth wave  │  │ Dynamic      │        │
│  │ spectrum     │  │ with mirror  │  │ particle     │        │
│  │ bars visual  │  │ reflection   │  │ system       │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Visualizing (Frequency Bars)

```
┌────────────────────────────────────────────────────────────────┐
│  🎵 Nuxt Audio Visualizer          [⏹ Stop capture] [⛶]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Frequency Bars                                         │   │
│  │ Classic frequency spectrum bars visualization          │   │
│  │                                                        │   │
│  │                                                        │   │
│  │                        █                               │   │
│  │                        █                               │   │
│  │                 █      █      █                        │   │
│  │           █     █      █      █     █                  │   │
│  │     █     █     █      █      █     █     █            │   │
│  │     █  █  █  █  █  █   █  █   █  █  █  █  █  █         │   │
│  │  █  █  █  █  █  █  █   █  █   █  █  █  █  █  █  █      │   │
│  │  █  █  █  █  █  █  █   █  █   █  █  █  █  █  █  █  █   │   │
│  └─┴──┴──┴──┴──┴──┴──┴───┴──┴───┴──┴──┴──┴──┴──┴──┴──┴───┘   │
│                                                                │
│  Bass   ████████████░░░░░░                                    │
│  Mid    ██████████████████░░                                  │
│  Treble █████████░░░░░░░░░░                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
│ [F] Fullscreen  [Space] Pause  [←][→] Switch  [R] Random     │
│ [C] Toggle cycle                                              │
└────────────────────────────────────────────────────────────────┘
```

## Visualizing (Waveform)

```
┌────────────────────────────────────────────────────────────────┐
│  🎵 Nuxt Audio Visualizer          [⏹ Stop capture] [⛶]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Waveform                                               │   │
│  │ Smooth waveform with mirrored reflection               │   │
│  │                                                        │   │
│  │           ╱‾‾‾‾╲                    ╱‾‾‾╲              │   │
│  │          ╱      ╲                  ╱     ╲             │   │
│  │         ╱        ╲                ╱       ╲            │   │
│  │     ╱‾‾╯          ╲╱‾╲    ╱‾╲╱‾‾╯         ╲           │   │
│  │ ‾‾‾‾                   ‾‾‾                  ‾‾‾‾‾‾‾   │   │
│  │ ╲                                                  ╱   │   │
│  │  ╲                                                ╱    │   │
│  │   ╲╲                                            ╱╱     │   │
│  │     ‾‾╲╲                                    ╱╱‾‾       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                                │
│  Bass   ████████░░░░░░░░░░                                    │
│  Mid    ████████████████░░░░                                  │
│  Treble ██████████████████░░                                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Visualizing (3D Particles)

```
┌────────────────────────────────────────────────────────────────┐
│  🎵 Nuxt Audio Visualizer          [⏹ Stop capture] [⛶]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 3D Particles                                           │   │
│  │ Dynamic particle system reacting to audio frequencies  │   │
│  │                                                        │   │
│  │         ∘                  ∘                           │   │
│  │    ∘      ∘  ∙     ∘  ∘      ∘    ∘                   │   │
│  │      ∘  ∙   ∘   ∘     ∘  ∙   ∙  ∘   ∘                 │   │
│  │   ∘   ∙       ∘   ∘      ∘     ∘   ∙  ∘              │   │
│  │  ∙  ∘    ∘  ∙   ∘    ∙  ∘  ∘   ∘  ∙    ∘  ∙          │   │
│  │    ∘  ∙     ∘  ∙  ∘     ∙   ∘  ∙    ∘   ∘  ∙         │   │
│  │  ∙    ∘  ∘   ∙    ∘  ∙   ∘     ∙  ∘   ∙   ∘          │   │
│  │   ∘  ∙    ∘   ∙  ∘    ∙   ∘  ∙   ∘   ∙    ∘          │   │
│  │     ∘   ∙   ∘     ∙  ∘   ∙    ∘   ∙  ∘    ∙          │   │
│  │       ∘      ∘  ∙       ∘        ∘                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  Bass   ██████████████░░░░░                                   │
│  Mid    ████████████░░░░░░░                                   │
│  Treble ██████░░░░░░░░░░░░░                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Paused State

```
┌────────────────────────────────────────────────────────────────┐
│  🎵 Nuxt Audio Visualizer          [⏹ Stop capture] [⛶]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │                                                        │   │
│  │                                                        │   │
│  │                                                        │   │
│  │                        ⏸                              │   │
│  │                                                        │   │
│  │                      Paused                            │   │
│  │                                                        │   │
│  │              Press [Space] to resume                   │   │
│  │                                                        │   │
│  │                                                        │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Fullscreen Mode

```
████████████████████████████████████████████████████████████████
██                                                            ██
██  Frequency Bars                                           ██
██  Classic frequency spectrum bars visualization            ██
██                                                            ██
██                                                            ██
██                                                            ██
██                            █                               ██
██                            █                               ██
██                     █      █      █                        ██
██               █     █      █      █     █                  ██
██         █     █     █      █      █     █     █            ██
██         █  █  █  █  █  █   █  █   █  █  █  █  █  █         ██
██      █  █  █  █  █  █  █   █  █   █  █  █  █  █  █  █      ██
██      █  █  █  █  █  █  █   █  █   █  █  █  █  █  █  █  █   ██
██   ─┴──┴──┴──┴──┴──┴──┴───┴──┴───┴──┴──┴──┴──┴──┴──┴──┴───  ██
██                                                            ██
██  Bass   ████████████░░░░░░                                ██
██  Mid    ██████████████████░░                              ██
██  Treble █████████░░░░░░░░░░                               ██
██                                                            ██
██                                                            ██
████████████████████████████████████████████████████████████████
```

## Mobile View

```
┌─────────────────────────────┐
│  🎵 Nuxt Audio Visualizer  │
│  [Share tab audio]  [⛶]   │
├─────────────────────────────┤
│                             │
│  ℹ️ How to start            │
│  Click 'Share tab audio'... │
│                             │
├─────────────────────────────┤
│  Choose a visualization     │
│  [🔀] [▶]                   │
│                             │
│  ┌───────────────────────┐  │
│  │   ░░▒▒▓▓              │  │
│  │   ▁▂▃▄▅▆▇█            │  │
│  │                       │  │
│  │ 2D                    │  │
│  ├───────────────────────┤  │
│  │ Frequency Bars     ⭐ │  │
│  │ Classic spectrum bars │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   ∿∿∿∿∿∿∿             │  │
│  │   ∿∿∿∿∿∿∿             │  │
│  │                       │  │
│  │ 2D                    │  │
│  ├───────────────────────┤  │
│  │ Waveform           ⭐ │  │
│  │ Smooth waveform       │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   ∴∵∴∵∴∵              │  │
│  │   ∵∴∵∴∵∴              │  │
│  │                       │  │
│  │ 3D                    │  │
│  ├───────────────────────┤  │
│  │ 3D Particles       ⭐ │  │
│  │ Dynamic particles     │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

## Color Scheme

```
Background:   #0b0f1a (gray-950)
Cards:        #1f2937 (gray-800)
Borders:      #374151 (gray-700)
Primary:      #3b82f6 (blue-500)
Text:         #f9fafb (gray-50)
Muted text:   #9ca3af (gray-400)

Bars gradient:
  Blue:       #60a5fa (blue-400)
  Purple:     #a78bfa (purple-400)
  Pink:       #f472b6 (pink-400)

Audio levels:
  Bass:       #3b82f6 (blue-500)
  Mid:        #10b981 (green-500)
  Treble:     #a855f7 (purple-500)
```

## Keyboard Shortcuts Overlay

```
┌──────────────────────────┐
│  Keyboard Shortcuts      │
├──────────────────────────┤
│  [F]      Fullscreen     │
│  [Space]  Pause          │
│  [←] [→]  Switch preset  │
│  [R]      Random         │
│  [C]      Toggle cycle   │
└──────────────────────────┘
```

## Error State

```
┌────────────────────────────────────────────────────────────────┐
│  🎵 Nuxt Audio Visualizer          [Share tab audio] [⛶]     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ❌ Error: No audio track found                               │
│  Make sure to enable "Share tab audio" in the browser dialog. │
│                                              [×]               │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  Choose a visualization          [🔀 Random] [▶ Auto-cycle]  │
│  ...                                                           │
└────────────────────────────────────────────────────────────────┘
```

## Browser Picker Dialog (Chrome)

```
┌─────────────────────────────────────────┐
│  Share your screen                      │
├─────────────────────────────────────────┤
│                                         │
│  ○  Entire screen                       │
│  ○  Window                              │
│  ●  Chrome Tab                          │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  🎵 YouTube - Music Video          │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ☑ Share tab audio                     │
│                                         │
│            [Cancel]  [Share]            │
└─────────────────────────────────────────┘
```

## Real-world Usage Flow

```
1. User opens app
   ↓
2. Sees preset grid + info banner
   ↓
3. Clicks "Share tab audio"
   ↓
4. Browser shows picker
   ↓
5. User selects YouTube tab
   ↓
6. User checks "Share tab audio" ✓
   ↓
7. Clicks "Share"
   ↓
8. Visualization starts (active preset)
   ↓
9. Audio levels animate in real-time
   ↓
10. User presses [→] to switch presets
    ↓
11. User presses [F] for fullscreen
    ↓
12. Music + visuals = 🎉
```

## Installation Prompt (PWA)

```
┌─────────────────────────────────────────┐
│  Install Nuxt Audio Visualizer?         │
├─────────────────────────────────────────┤
│                                         │
│  🎵                                     │
│                                         │
│  This app can be installed on your      │
│  device for quick access and offline    │
│  use (audio capture requires online).   │
│                                         │
│            [Cancel]  [Install]          │
└─────────────────────────────────────────┘
```

---

**Note**: Actual UI uses Nuxt UI components with Tailwind CSS for a polished, modern look. These ASCII previews show the general layout and flow.

For screenshots, run the app and visit http://localhost:3000

