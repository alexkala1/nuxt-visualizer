<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PresetCard
      v-for="preset in presetStore.presets"
      :key="preset.id"
      :preset="preset"
      :is-active="presetStore.activePresetId === preset.id"
      :is-favorite="presetStore.favorites.includes(preset.id)"
      @select="presetStore.setActivePreset(preset.id)"
      @toggle-favorite="presetStore.toggleFavorite(preset.id)"
    />
  </div>
</template>

<script setup lang="ts">
const presetStore = usePresetStore()
</script>

