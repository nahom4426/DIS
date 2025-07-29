<script setup>
import Table from "@/components/Table.vue";
import { ref, computed, onMounted } from "vue";
import { openModal } from "@customizer/modal-x";
import icons from "@/utils/icons";

const props = defineProps({
  search: String,
});

const inProgressRequests = ref([]);

function loadRequests() {
  const stored = localStorage.getItem('drugInformationRequests');
  if (stored) {
    const requests = JSON.parse(stored);
    inProgressRequests.value = requests
      .filter(request => request.status === 'In Progress')
      .map((request, index) => ({
        id: `DI-${String(index + 1).padStart(3, '0')}`,
        requestType: getRequestTypeDisplay(request.requestType),
        patientName: getPatientDisplay(request),
        question: request.requestQuestion,
        responseNeeded: request.responseNeeded,
        submittedAt: formatDate(request.submittedAt),
        startedAt: request.startedAt ? formatDate(request.startedAt) : 'N/A',
        status: request.status,
        priority: getPriority(request.responseNeeded),
        assignedTo: request.assignedTo || 'Dr. Amanda Ross',
        originalData: request,
        originalIndex: requests.indexOf(request)
      }));
  }
}

onMounted(() => {
  loadRequests();
  setInterval(loadRequests, 2000);
});

function completeRequest(request) {
  const allRequests = JSON.parse(localStorage.getItem('drugInformationRequests') || '[]');
  allRequests[request.originalIndex].status = 'Completed';
  allRequests[request.originalIndex].completedAt = new Date().toISOString();
  allRequests[request.originalIndex].completedBy = 'Dr. Amanda Ross';
  localStorage.setItem('drugInformationRequests', JSON.stringify(allRequests));
  loadRequests();
}

function getRequestTypeDisplay(type) {
  const typeMap = {
    'patientSpecific': 'Patient Specific',
    'academic': 'Academic',
    'other': 'Other'
  };
  return typeMap[type] || type;
}

function getPatientDisplay(request) {
  if (request.requestType === 'patientSpecific' && request.patientInfo) {
    const { age, sex } = request.patientInfo;
    if (age && sex) {
      return `Patient (${age}y, ${sex})`;
    }
    return 'Patient Information Available';
  }
  return 'N/A';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getPriority(responseTime) {
  if (!responseTime) return 'Normal';
  const time = responseTime.toLowerCase();
  if (time.includes('asap') || time.includes('urgent') || time.includes('30')) return 'Urgent';
  if (time.includes('24') || time.includes('1 day')) return 'High';
  return 'Normal';
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'Urgent': return 'bg-red-100 text-red-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Normal': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getRequestTypeColor(type) {
  switch (type) {
    case 'Patient Specific': return 'bg-blue-100 text-blue-800';
    case 'Academic': return 'bg-DIS-100 text-DIS-800';
    case 'Other': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function viewProgress(request) {
  const data = request.originalData;
  openModal('ViewProgress', {
    requestId: request.id,
    requestType: request.requestType,
    patientInfo: data.patientInfo,
    question: data.requestQuestion,
    responseNeeded: data.responseNeeded,
    submittedAt: request.submittedAt,
    startedAt: request.startedAt,
    assignedTo: request.assignedTo,
    status: request.status,
    priority: request.priority
  });
}

const filteredRequests = computed(() => {
  if (!props.search) return inProgressRequests.value;
  
  const searchTerm = props.search.toLowerCase();
  return inProgressRequests.value.filter(request => 
    request.question.toLowerCase().includes(searchTerm) ||
    request.requestType.toLowerCase().includes(searchTerm) ||
    request.id.toLowerCase().includes(searchTerm) ||
    request.patientName.toLowerCase().includes(searchTerm) ||
    request.assignedTo.toLowerCase().includes(searchTerm)
  );
});
</script>

<template>
  <div class="p-6">
    <div v-if="filteredRequests.length === 1" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No requests in progress</h3>
      <p class="text-gray-500">Assign pending requests to start working on them.</p>
    </div>

    <div v-else>
      <div class="mb-4">
        <!-- <h3 class="text-lg font-semibold text-gray-900">In Progress Drug Information Requests ({{ filteredRequests.length }})</h3> -->
        <p class="text-sm text-gray-600">Currently being worked on by pharmacists</p>
      </div>

      <Table
        :pending="false"
        :rows="filteredRequests"
        :headers="{
          head: ['Request ID', 'Patient', 'Type', 'Question', 'Assigned To', 'Priority', 'Started', 'Actions'],
          row: ['id', 'patientName', 'requestType', 'question', 'assignedTo', 'priority', 'startedAt']
        }"
      >
        <template #requestType="{ row }">
          <span :class="['px-2 py-1 text-xs font-medium rounded-full', getRequestTypeColor(row.requestType)]">
            {{ row.requestType }}
          </span>
        </template>

        <template #question="{ row }">
          <div class="max-w-xs">
            <p class="text-sm text-gray-900 truncate" :title="row.question">
              {{ row.question }}
            </p>
          </div>
        </template>
        
        <template #priority="{ row }">
          <span :class="['px-2 py-1 text-xs font-medium rounded-full', getPriorityColor(row.priority)]">
            {{ row.priority }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex gap-2">
            <button
              @click="completeRequest(row)"
              class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Complete
            </button>
            <button
              @click="viewProgress(row)"
              class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>


