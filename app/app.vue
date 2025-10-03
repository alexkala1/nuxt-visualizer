<template>
  <div>
    <NuxtPage />
    <UToaster position="bottom-center" />
  </div>
</template>

<script setup lang="ts">
// Load preset state from localStorage on mount
const presetStore = usePresetStore()
onMounted(() => {
  presetStore.loadFromStorage()
})
</script>

