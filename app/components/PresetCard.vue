<template>
  <UCard
    :ui="{
      base: 'cursor-pointer transition-all hover:ring-2 hover:ring-primary',
      ring: isActive ? 'ring-2 ring-primary' : '',
      body: { padding: 'p-0' }
    }"
    @click="$emit('select')"
  >
    <!-- Thumbnail -->
    <div class="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <UIcon
        :name="thumbnailIcon"
        class="w-16 h-16 text-gray-600"
      />
      
      <!-- Favorite badge -->
      <button
        class="absolute top-2 right-2 p-2 rounded-full bg-gray-900/80 backdrop-blur hover:bg-gray-800 transition-colors"
        @click.stop="$emit('toggle-favorite')"
      >
        <UIcon
          :name="isFavorite ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
          :class="[
            'w-5 h-5',
            isFavorite ? 'text-yellow-400' : 'text-gray-400'
          ]"
        />
      </button>

      <!-- Active indicator -->
      <div
        v-if="isActive"
        class="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary text-xs font-semibold"
      >
        Active
      </div>

      <!-- Kind badge -->
      <div class="absolute bottom-2 left-2 px-2 py-1 rounded bg-gray-900/80 backdrop-blur text-xs font-medium">
        {{ preset.kind.toUpperCase() }}
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <h3 class="font-semibold text-lg mb-1">{{ preset.name }}</h3>
      <p class="text-sm text-gray-400">{{ preset.description }}</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { VisualPreset } from '~/stores/preset'

const props = defineProps<{
  preset: VisualPreset
  isActive: boolean
  isFavorite: boolean
}>()

defineEmits<{
  select: []
  'toggle-favorite': []
}>()

const thumbnailIcon = computed(() => {
  switch (props.preset.kind) {
    case '2d': return 'i-heroicons-chart-bar'
    case '3d': return 'i-heroicons-cube'
    case 'shader': return 'i-heroicons-sparkles'
    default: return 'i-heroicons-musical-note'
  }
})
</script>

