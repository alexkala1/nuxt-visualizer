<template>
  <USelectMenu
    :model-value="selectedOption"
    :items="items"
    :placeholder="placeholder"
    :size="isMobile ? 'md' : 'lg'"
    class="w-full sm:flex-1 lg:w-48"
    @update:model-value="handleSelect"
  />
</template>

<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

interface SelectOption {
  label: string
  value: string | null
}

const props = defineProps<{
  modelValue: string | null
  items: SelectOption[]
  placeholder: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

// Find the selected option object based on the value
const selectedOption = computed(() => {
  return props.items.find(item => item.value === props.modelValue)
})

// Handle selection and emit the value
function handleSelect(option: SelectOption) {
  emit('update:modelValue', option.value)
}
</script>

