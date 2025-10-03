import { defineStore } from 'pinia'

export type AudioStatus = 'idle' | 'capturing' | 'error'
export type InputMethod = 'tab' | 'microphone' | 'file'

export interface AudioLevels {
  bass: number    // 20-250 Hz
  mid: number     // 250-4000 Hz
  treble: number  // 4000-20000 Hz
  rms: number     // overall volume
}

export const useAudioStore = defineStore('audio', () => {
  // State
  const status = ref<AudioStatus>('idle')
  const error = ref<string | null>(null)
  const inputMethod = ref<InputMethod | null>(null)
  const stream = shallowRef<MediaStream | null>(null)
  const audioCtx = shallowRef<AudioContext | null>(null)
  const analyser = shallowRef<AnalyserNode | null>(null)
  const source = shallowRef<MediaStreamAudioSourceNode | null>(null)
  const levels = ref<AudioLevels>({ bass: 0, mid: 0, treble: 0, rms: 0 })
  
  // Computed
  const isCapturing = computed(() => status.value === 'capturing')
  const hasError = computed(() => status.value === 'error')

  // Actions
  async function startTabCapture() {
    try {
      error.value = null
      inputMethod.value = 'tab'

      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Your browser does not support screen/tab audio capture. Please use Chrome, Edge, or another Chromium-based browser.')
      }

      // Request display media with audio
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } as any,
        video: {
          displaySurface: 'browser'
        } as any
      })

      // Check if audio track exists
      const audioTracks = mediaStream.getAudioTracks()
      if (audioTracks.length === 0) {
        // Stop the video track if it exists
        mediaStream.getTracks().forEach(track => track.stop())
        throw new Error('No audio track found. Make sure to enable "Share tab audio" in the browser dialog.')
      }

      const audioTrack = audioTracks[0]!

      // Create audio context
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const src = ctx.createMediaStreamSource(mediaStream)
      const analyserNode = ctx.createAnalyser()
      
      analyserNode.fftSize = 1024 // Reduced for better performance
      analyserNode.smoothingTimeConstant = 0.8 // Slightly reduced for better performance
      
      src.connect(analyserNode)

      // Store references
      stream.value = mediaStream
      audioCtx.value = ctx
      analyser.value = analyserNode
      source.value = src

      // Only set capturing after everything is set up
      status.value = 'capturing'

      // Listen for track end
      audioTrack.addEventListener('ended', () => {
        stopCapture()
      })

    } catch (err: any) {
      // Clean up any partial state
      stream.value?.getTracks().forEach(track => track.stop())
      stream.value = null
      audioCtx.value?.close().catch(() => {})
      audioCtx.value = null
      analyser.value = null
      source.value = null
      
      status.value = 'error'
      error.value = err.message || 'Failed to capture audio'
      
      // Don't throw, let the UI handle the error state
      console.error('Audio capture failed:', err)
    }
  }

  async function startMicrophoneCapture() {
    try {
      error.value = null
      inputMethod.value = 'microphone'

      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support microphone access.')
      }

      // Request microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      })

      // Create audio context
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const src = ctx.createMediaStreamSource(mediaStream)
      const analyserNode = ctx.createAnalyser()
      
      analyserNode.fftSize = 1024
      analyserNode.smoothingTimeConstant = 0.8
      
      src.connect(analyserNode)
      // Note: We don't connect to destination (no feedback loop)

      // Store references
      stream.value = mediaStream
      audioCtx.value = ctx
      analyser.value = analyserNode
      source.value = src

      // Only set capturing after everything is set up
      status.value = 'capturing'

      // Listen for track end
      const audioTrack = mediaStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.addEventListener('ended', () => {
          stopCapture()
        })
      }

    } catch (err: any) {
      // Clean up any partial state
      stream.value?.getTracks().forEach(track => track.stop())
      stream.value = null
      audioCtx.value?.close().catch(() => {})
      audioCtx.value = null
      analyser.value = null
      source.value = null
      inputMethod.value = null
      
      status.value = 'error'
      
      // Provide user-friendly error messages
      if (err.name === 'NotAllowedError') {
        error.value = 'Microphone access denied. Please allow microphone access and try again.'
      } else if (err.name === 'NotFoundError') {
        error.value = 'No microphone found. Please connect a microphone and try again.'
      } else {
        error.value = err.message || 'Failed to access microphone'
      }
      
      console.error('Microphone capture failed:', err)
    }
  }

  function stopCapture() {
    // Stop all tracks
    stream.value?.getTracks().forEach(track => track.stop())
    
    // Disconnect nodes
    analyser.value?.disconnect()
    source.value?.disconnect()
    
    // Close context
    audioCtx.value?.close().catch(() => {})
    
    // Reset state
    stream.value = null
    audioCtx.value = null
    analyser.value = null
    source.value = null
    inputMethod.value = null
    status.value = 'idle'
    error.value = null
    levels.value = { bass: 0, mid: 0, treble: 0, rms: 0 }
  }

  function updateLevels(newLevels: AudioLevels) {
    levels.value = newLevels
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    status,
    error,
    inputMethod,
    stream,
    audioCtx,
    analyser,
    source,
    levels,
    // Computed
    isCapturing,
    hasError,
    // Actions
    startCapture: startTabCapture, // Keep old name for backwards compatibility
    startTabCapture,
    startMicrophoneCapture,
    stopCapture,
    updateLevels,
    clearError
  }
})

