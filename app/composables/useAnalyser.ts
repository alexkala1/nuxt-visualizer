import type { AudioLevels } from '~/stores/audio'

export function useAnalyser() {
  const audioStore = useAudioStore()
  
  const freqData = shallowRef<Uint8Array>()
  const timeData = shallowRef<Uint8Array>()

  // Initialize data arrays when analyser is available
  watchEffect(() => {
    const analyser = audioStore.analyser
    if (analyser) {
      freqData.value = new Uint8Array(analyser.frequencyBinCount)
      timeData.value = new Uint8Array(analyser.fftSize)
    } else {
      freqData.value = undefined
      timeData.value = undefined
    }
  })

  function getFrequencyData(): Uint8Array | undefined {
    const analyser = audioStore.analyser
    const data = freqData.value
    if (!analyser || !data) return undefined
    
    analyser.getByteFrequencyData(data)
    return data
  }

  function getTimeDomainData(): Uint8Array | undefined {
    const analyser = audioStore.analyser
    const data = timeData.value
    if (!analyser || !data) return undefined
    
    analyser.getByteTimeDomainData(data)
    return data
  }

  function computeLevels(): AudioLevels {
    const data = getFrequencyData()
    if (!data) return { bass: 0, mid: 0, treble: 0, rms: 0 }

    const sampleRate = audioStore.audioCtx?.sampleRate || 48000
    const binCount = data.length
    const binWidth = sampleRate / 2 / binCount

    // Frequency band indices
    const bassEnd = Math.floor(250 / binWidth)
    const midEnd = Math.floor(4000 / binWidth)

    let bassSum = 0, midSum = 0, trebleSum = 0, totalSum = 0

    for (let i = 0; i < binCount; i++) {
      const val = data[i]
      totalSum += val
      
      if (i < bassEnd) {
        bassSum += val
      } else if (i < midEnd) {
        midSum += val
      } else {
        trebleSum += val
      }
    }

    const bassCount = Math.max(1, bassEnd)
    const midCount = Math.max(1, midEnd - bassEnd)
    const trebleCount = Math.max(1, binCount - midEnd)

    return {
      bass: bassSum / bassCount / 255,
      mid: midSum / midCount / 255,
      treble: trebleSum / trebleCount / 255,
      rms: totalSum / binCount / 255
    }
  }

  return {
    freqData,
    timeData,
    getFrequencyData,
    getTimeDomainData,
    computeLevels
  }
}

