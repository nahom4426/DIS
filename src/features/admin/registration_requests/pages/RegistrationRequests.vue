<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-2">Registration Requests</h2>
    <p class="text-sm text-gray-500 mb-4">
      * Actions history is retained for 24 hours.
    </p>

    <table class="min-w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">Full Name</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Phone</th>
          <th class="px-4 py-2 text-left">Role</th>
          <th class="px-4 py-2 text-left">Provider</th>
          <th class="px-4 py-2 text-left">Status</th>
          <th class="px-4 py-2 text-left">Date</th>
          <th class="px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <RegistrationRequestRow
          v-for="req in visibleRequests"
          :key="req.userUuid"
          :request="req"
          @approve="askConfirm('approve', req)"
          @reject="askConfirm('reject', req)"
          @deactivate="askConfirm('deactivate', req)"
        />
      </tbody>
    </table>

    <!-- Confirmation Modal -->
    <ConfirmActionModal
      v-if="confirmModal.open"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :actionType="confirmModal.type"
      @cancel="confirmModal.open = false"
      @confirm="performAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRegistrationRequestStore } from '../store/registrationRequestStore';
import {
  getAllRegistrationRequests,
  approveRegistrationRequest,
  rejectRegistrationRequest,
  deactivateRegistrationRequest,
} from "../Api/RegistrationRequestApi";
import RegistrationRequestRow from '../components/RegistrationRequestRow.vue';
import ConfirmActionModal from "../components/ConfirmActionModal.vue";

const store = useRegistrationRequestStore();
const confirmModal = ref({
  open: false,
  type: null,
  request: null,
  title: "",
  message: ""
});

async function fetchRequests() {
  const res = await getAllRegistrationRequests();
  if (res.success) {
    store.set(res.data.requests);
  }
}

// ✅ retain for 24 hours
const visibleRequests = computed(() => {
  const now = Date.now();
  return store.requests.filter(req => {
    if (!req.lastActionTime) return true;
    return now - req.lastActionTime < 24 * 60 * 60 * 1000;
  });
});

function askConfirm(type, request) {
  confirmModal.value = {
    open: true,
    type,
    request,
    title:
      type === "approve"
        ? "Approve Request"
        : type === "reject"
        ? "Reject Request"
        : "Deactivate User",
    message:
      type === "approve"
        ? `Are you sure you want to approve ${request.fullName}?`
        : type === "reject"
        ? `Are you sure you want to reject ${request.fullName}?`
        : `Are you sure you want to deactivate ${request.fullName}?`
  };
}

async function performAction() {
  const { type, request } = confirmModal.value;
  confirmModal.value.open = false;

  if (!request) return;

  if (type === "approve") {
    await approveRegistrationRequest(request.userUuid);
    store.markLocally(request.userUuid, "Active");
  } else if (type === "reject") {
    await rejectRegistrationRequest(request.userUuid);
    store.markLocally(request.userUuid, "Rejected");
  } else if (type === "deactivate") {
    await deactivateRegistrationRequest(request.userUuid);
    store.markLocally(request.userUuid, "Deactivated");
  }
}

onMounted(fetchRequests);
</script>
