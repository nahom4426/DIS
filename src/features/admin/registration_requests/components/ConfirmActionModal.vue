<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-[400px]">
      <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
      <p class="text-gray-600 mb-6">{{ message }}</p>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 rounded text-white"
          :class="{
            'bg-green-500 hover:bg-green-600': actionType === 'approve',
            'bg-red-500 hover:bg-red-600': actionType === 'reject',
            'bg-yellow-500 hover:bg-yellow-600': actionType === 'deactivate'
          }"
          @click="$emit('confirm')"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
  actionType: String // "approve" | "reject" | "deactivate"
});
</script>
