<template>
  <div class="space-y-5 sm:space-y-6 lg:space-y-7">
    <!-- Search and filter controls -->
    <div class="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-xl p-3 sm:p-4 lg:p-5">
      <div class="flex flex-col gap-3">
        <!-- Search and filters row -->
        <div class="flex flex-col lg:flex-row gap-2.5 lg:gap-3">
          <!-- Search input -->
          <div class="flex-1 min-w-0">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Search by name or description..."
              :size="isMobile ? 'md' : 'lg'"
              class="w-full"
            />
          </div>
          
          <!-- Filters -->
          <div class="flex flex-col sm:flex-row gap-2 lg:gap-2.5 lg:flex-shrink-0">
            <FilterSelect
              v-model="selectedKind"
              :items="kindOptions"
              placeholder="All Types"
            />
            <FilterSelect
              v-model="selectedTag"
              :items="tagOptions"
              placeholder="All Tags"
            />
            <UButton
              :variant="showFavoritesOnly ? 'solid' : 'outline'"
              :color="showFavoritesOnly ? 'primary' : 'neutral'"
              icon="i-heroicons-star-solid"
              :size="isMobile ? 'md' : 'lg'"
              class="w-full sm:flex-1 lg:w-auto"
              @click="showFavoritesOnly = !showFavoritesOnly"
            >
              <span class="hidden sm:inline">{{ showFavoritesOnly ? 'Show All' : 'Favorites Only' }}</span>
              <span class="sm:hidden">{{ showFavoritesOnly ? 'All' : 'Favorites' }}</span>
            </UButton>
          </div>
        </div>
        
        <!-- Results count and clear button -->
        <div v-if="searchQuery || selectedKind || selectedTag || showFavoritesOnly" class="flex items-center justify-between gap-3">
          <div class="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
            <UIcon name="i-heroicons-funnel" class="w-4 h-4" />
            <span>{{ filteredPresets.length }} visualization{{ filteredPresets.length !== 1 ? 's' : '' }} found</span>
          </div>
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-x-mark"
            @click="clearFilters"
          >
            <span class="hidden sm:inline">Clear filters</span>
            <span class="sm:hidden">Clear</span>
          </UButton>
        </div>
      </div>
    </div>

    <!-- Preset grid -->
    <div v-if="filteredPresets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      <PresetCard
        v-for="preset in filteredPresets"
        :key="preset.id"
        :preset="preset"
        :is-active="presetStore.activePresetId === preset.id"
        :is-favorite="presetStore.favorites.includes(preset.id)"
        @select="presetStore.setActivePreset(preset.id)"
        @toggle-favorite="presetStore.toggleFavorite(preset.id)"
      />
    </div>

    <!-- No results -->
    <div v-else class="bg-gray-900/20 border border-gray-800/50 rounded-xl p-8 sm:p-12 lg:p-16 text-center">
      <UIcon name="i-heroicons-magnifying-glass-circle" class="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-4" />
      <p class="text-gray-400 text-base sm:text-lg font-medium">No visualizations found</p>
      <p class="text-gray-500 text-sm sm:text-base mt-2">Try adjusting your search or filters</p>
      <UButton
        v-if="searchQuery || selectedKind || selectedTag || showFavoritesOnly"
        variant="ghost"
        size="sm"
        icon="i-heroicons-x-mark"
        class="mt-4"
        @click="clearFilters"
      >
        Clear all filters
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

const presetStore = usePresetStore()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg') // Include tablets

const searchQuery = ref('')
const selectedKind = ref<string | null>(null)
const selectedTag = ref<string | null>(null)
const showFavoritesOnly = ref(false)

const kindOptions = [
  { label: 'All Types', value: null },
  { label: '2D', value: '2d' },
  { label: '3D', value: '3d' },
  { label: 'Shader', value: 'shader' }
]

// Consolidated tag categories for better UX
const tagOptions = [
  { label: 'All Tags', value: null },
  { label: 'Classic', value: 'classic' },
  { label: 'Modern', value: 'modern' },
  { label: 'Circular/Radial', value: 'circular' },
  { label: 'Particles', value: 'particles' },
  { label: 'WMP-Inspired', value: 'wmp' },
  { label: 'Organic/Artistic', value: 'organic' },
  { label: 'Professional', value: 'professional' },
  { label: 'Geometric', value: 'geometric' }
]

const filteredPresets = computed(() => {
  let presets = presetStore.presets

  // Filter by favorites
  if (showFavoritesOnly.value) {
    presets = presets.filter(p => presetStore.favorites.includes(p.id))
  }

  // Filter by kind
  if (selectedKind.value) {
    presets = presets.filter(p => p.kind === selectedKind.value)
  }

  // Filter by selected tag
  if (selectedTag.value) {
    presets = presets.filter(p => {
      return p.tags?.includes(selectedTag.value!)
    })
  }

  // Filter by search query (name and description only)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    presets = presets.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(query)
      const descMatch = p.description.toLowerCase().includes(query)
      return nameMatch || descMatch
    })
  }

  return presets
})

// Clear all filters
function clearFilters() {
  searchQuery.value = ''
  selectedKind.value = null
  selectedTag.value = null
  showFavoritesOnly.value = false
}
</script>

