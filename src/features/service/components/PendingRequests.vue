<script setup>
import Table from "@/components/Table.vue";
import { ref, computed, onMounted } from "vue";
import { openModal } from "@customizer/modal-x";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const props = defineProps({
  search: String,
});

const drugInformationRequests = ref([]);

// Load requests from localStorage and filter pending
function loadRequests() {
  const stored = localStorage.getItem("drugInformationRequests");
  if (stored) {
    const requests = JSON.parse(stored);
    drugInformationRequests.value = requests
      .filter((request) => request.status === "Pending Review")
      .map((request, index) => ({
        id: `DI-${String(index + 1).padStart(3, "0")}`,
        requestType: getRequestTypeDisplay(request.requestType),
        patientName: getPatientDisplay(request),
        question: request.requestQuestion,
        responseNeeded: request.responseNeeded,
        submittedAt: formatDate(request.submittedAt),
        status: request.status,
        priority: getPriority(request.responseNeeded),
        assignedTo: request.assignedTo || "Unassigned",
        originalData: request,
        originalIndex: requests.indexOf(request),
      }));
  }
}

onMounted(() => {
  loadRequests();
  // Refresh every 2s so new requests appear
  setInterval(loadRequests, 2000);
});

function assignRequest(request) {
  const allRequests = JSON.parse(
    localStorage.getItem("drugInformationRequests") || "[]"
  );
  allRequests[request.originalIndex].status = "In Progress";
  allRequests[request.originalIndex].assignedTo = authStore?.user?.name || "";
  allRequests[request.originalIndex].startedAt = new Date().toISOString();
  localStorage.setItem("drugInformationRequests", JSON.stringify(allRequests));
  loadRequests();
}

function getRequestTypeDisplay(type) {
  const typeMap = {
    patientSpecific: "Patient Specific",
    academic: "Academic",
    other: "Other",
  };
  return typeMap[type] || type;
}

function getPatientDisplay(request) {
  if (request.requestType === "patientSpecific" && request.patientInfo) {
    const { age, sex } = request.patientInfo;
    if (age && sex) {
      return `Patient (${age}y, ${sex})`;
    }
    return "Patient Information Available";
  }
  return "N/A";
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPriority(responseTime) {
  if (!responseTime) return "Normal";
  const time = responseTime.toLowerCase();
  if (time.includes("asap") || time.includes("urgent") || time.includes("30"))
    return "Urgent";
  if (time.includes("24") || time.includes("1 day")) return "High";
  return "Normal";
}

function getPriorityColor(priority) {
  switch (priority) {
    case "Urgent":
      return "bg-red-100 text-red-800";
    case "High":
      return "bg-orange-100 text-orange-800";
    case "Normal":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getRequestTypeColor(type) {
  switch (type) {
    case "Patient Specific":
      return "bg-blue-100 text-blue-800";
    case "Academic":
      return "bg-purple-100 text-purple-800";
    case "Other":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function viewDetails(request) {
  const data = request.originalData;
  openModal("RequestDetails", {
    requestId: request.id,
    requestType: request.requestType,
    patientInfo: data.patientInfo,
    question: data.requestQuestion,
    responseNeeded: data.responseNeeded,
    submittedAt: request.submittedAt,
    status: request.status,
    priority: request.priority,
  });
}

const filteredRequests = computed(() => {
  if (!props.search) return drugInformationRequests.value;

  const searchTerm = props.search.toLowerCase();
  return drugInformationRequests.value.filter(
    (request) =>
      request.question.toLowerCase().includes(searchTerm) ||
      request.requestType.toLowerCase().includes(searchTerm) ||
      request.id.toLowerCase().includes(searchTerm) ||
      request.patientName.toLowerCase().includes(searchTerm)
  );
});
</script>

<template>
  <div class="p-6">
    <div v-if="filteredRequests.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg
          class="mx-auto h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 
            012-2h5.586a1 1 0 01.707.293l5.414 
            5.414a1 1 0 01.293.707V19a2 2 0 
            01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No pending drug information requests
      </h3>
      <p class="text-gray-500">
        Submit a new drug information request to get started.
      </p>
    </div>

    <div v-else>
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Pending Drug Information Requests ({{ filteredRequests.length }})
        </h3>
        <p class="text-sm text-gray-600">
          Review and assign submitted drug information requests
        </p>
      </div>

      <Table
        :pending="true"
        :rows="filteredRequests"
        :headers="{
          head: [
            'Request ID',
            'Patient',
            'Type',
            'Question',
            'Priority',
            'Response Needed',
            'Submitted',
            'Actions'
          ],
          row: [
            'id',
            'patientName',
            'requestType',
            'question',
            'priority',
            'responseNeeded',
            'submittedAt'
          ]
        }"
      >
        <template #requestType="{ row }">
          <span
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getRequestTypeColor(row.requestType)
            ]"
          >
            {{ row.requestType }}
          </span>
        </template>

        <template #question="{ row }">
          <div class="max-w-xs">
            <p
              class="text-sm text-gray-900 truncate"
              :title="row.question"
            >
              {{ row.question }}
            </p>
          </div>
        </template>

        <template #priority="{ row }">
          <span
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getPriorityColor(row.priority)
            ]"
          >
            {{ row.priority }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              @click="viewDetails(row)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50"
            >
              View Details
            </button>
            <button
              @click="assignRequest(row)"
              class="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded hover:bg-green-50"
            >
              Assign & Start
            </button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>
