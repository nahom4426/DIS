<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const setRef = ref(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="relative">
    <slot :setRef="setRef" :toggleDropdown="toggleDropdown"></slot>
    <div v-if="isOpen" class="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<style>
.loading-dropdown * {
  visibility: hidden;
}

.bottom-right {
  top: var(--top);
  right: var(--right);
}
</style>
