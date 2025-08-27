<template>
  <tr class="border-b">
    <!-- Full Name -->
    <td class="px-4 py-2">{{ request.fullName }}</td>

    <!-- Email -->
    <td class="px-4 py-2">{{ request.email }}</td>

    <!-- Phone -->
    <td class="px-4 py-2">{{ request.mobilePhone }}</td>

    <!-- Role -->
    <td class="px-4 py-2 capitalize">{{ request.roleName }}</td>

    <!-- Provider -->
    <td class="px-4 py-2">{{ request.providerName }}</td>

    <!-- Status -->
    <td class="px-4 py-2">
      <span
        class="px-2 py-1 rounded text-xs"
        :class="{
          'bg-yellow-100 text-yellow-800': request.userStatus === 'Pending',
          'bg-green-100 text-green-800': request.userStatus === 'Active',
          'bg-red-100 text-red-800': request.userStatus === 'Rejected',
          'bg-gray-200 text-gray-800': request.userStatus === 'Deactivated'
        }"
      >
        {{ request.userStatus }}
      </span>
    </td>

    <!-- Created At -->
    <td class="px-4 py-2">
      {{ new Date(request.createdAt).toLocaleDateString() }}
    </td>

    <!-- Actions Dropdown -->
    <td class="px-4 py-2 text-right relative">
      <div class="inline-block text-left" @click.stop>
        <!-- Ellipsis Button -->
        <button
          @click="toggleDropdown"
          class="p-2 rounded hover:bg-gray-100"
        >
          ⋮
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10"
        >
          <button
            class="block w-full text-left px-4 py-2 hover:bg-green-50"
            @click="emitAction('approve')"
          >
            ✅ Approve
          </button>
          <button
            class="block w-full text-left px-4 py-2 hover:bg-red-50"
            @click="emitAction('reject')"
          >
            ❌ Reject
          </button>
          <button
            class="block w-full text-left px-4 py-2 hover:bg-yellow-50"
            @click="emitAction('deactivate')"
          >
            ⚠️ Deactivate
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// ✅ destructure request prop directly
const { request } = defineProps({
  request: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["approve", "reject", "deactivate"]);

const dropdownOpen = ref(false);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function emitAction(action) {
  emit(action, request.userUuid); // ✅ cleaner
  dropdownOpen.value = false;
}

// ✅ close dropdown when clicking outside
function handleClickOutside(e) {
  if (!e.target.closest("tr")) {
    dropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>
