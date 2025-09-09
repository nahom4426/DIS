<script setup>
import Table from "@/components/Table.vue";
import { ref, computed, onMounted } from "vue";
import { openModal } from "@customizer/modal-x";
import icons from "@/utils/icons";
import { getUserQuestions, deleteQuestion } from "@/features/service/api/questionApi";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const props = defineProps({
  search: String,
});

const completedRequests = ref([]);

async function loadRequests() {
  const userUuid = authStore.auth?.userUuid;
  if (!userUuid) return;
  const response = await getUserQuestions(userUuid);
  if (response.success && Array.isArray(response.data)) {
    completedRequests.value = response.data
      .filter(q => q.answer)
      .map((q, index) => ({
        id: `DI-${String(index + 1).padStart(3, '0')}`,
        requestType: q.patientType === "PATIENT_SPECIFIC" ? "Patient Specific" : "Academic",
        patientName: q.firstName || "N/A",
        question: q.description || q.question || "No question provided", // Ensure question is always present
        responseNeeded: q.responseUrgency,
        submittedAt: q.createdAt,
        completedAt: q.answer?.createdAt ? formatDate(q.answer.createdAt) : 'N/A',
        status: "Completed",
        priority: getPriority(q.responseUrgency),
        completedBy: q.answer?.answerGiverFirstName || "N/A",
        originalData: q,
        originalIndex: index
      }));
  }
}

onMounted(() => {
  loadRequests();
  
});

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
    case 'Urgent': return 'bg-red-50 text-red-600';      /* Softer red */
    case 'High': return 'bg-orange-50 text-orange-600';  /* Softer orange */
    case 'Normal': return 'bg-green-50 text-green-600';  /* Softer green */
    default: return 'bg-gray-50 text-gray-600';          /* Softer gray */
  }
}

function getRequestTypeColor(type) {
  switch (type) {
    case 'Patient Specific': return 'bg-blue-50 text-blue-600';     /* Softer blue */
    case 'Academic': return 'bg-purple-50 text-purple-600';         /* Softer purple */
    case 'Other': return 'bg-gray-50 text-gray-600';               /* Softer gray */
    default: return 'bg-gray-50 text-gray-600';
  }
}

import { useRouter } from 'vue-router';
const router = useRouter();
function viewCompleted(request) {
  router.push({
    path: `/service/question/${request.originalData.questionUuid}`
  });
}

function printReport(request) {
  // Generate a printable report
  const printWindow = window.open('', '_blank');
  const data = request.originalData;
  
  printWindow.document.write(`
    <html>

      <body>
        
      
        
     
        
        
        
        <div class="section">
          <div class="label">Response Time Needed:</div>
          <div>${request.responseNeeded}</div>
        </div>
        
        <div class="section">
          <div class="label">Priority:</div>
          <div>${request.priority}</div>
        </div>
        
        <div class="section">
          <div class="label">Submitted:</div>
          <div>${request.submittedAt}</div>
        </div>
        
        <div class="section">
          <div class="label">Completed:</div>
          <div>${request.completedAt}</div>
        </div>
        
        <div class="section">
          <div class="label">Completed By:</div>
          <div>${request.completedBy}</div>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
}

const filteredRequests = computed(() => {
  if (!props.search) return completedRequests.value;
  
  const searchTerm = props.search.toLowerCase();
  return completedRequests.value.filter(request => 
    request.question.toLowerCase().includes(searchTerm) ||
    request.requestType.toLowerCase().includes(searchTerm) ||
    request.id.toLowerCase().includes(searchTerm) ||
    request.patientName.toLowerCase().includes(searchTerm) ||
    request.completedBy.toLowerCase().includes(searchTerm)
  );
});

const selectedRows = ref([]);
const selectAll = ref(false);

function toggleSelectRow(rowId) {
  if (selectedRows.value.includes(rowId)) {
    selectedRows.value = selectedRows.value.filter(id => id !== rowId);
  } else {
    selectedRows.value.push(rowId);
  }
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedRows.value = filteredRequests.value.map(request => request.id);
  } else {
    selectedRows.value = [];
  }
}

async function handleDelete(request) {
  // Use API to delete the question
  await deleteQuestion(request.originalData.questionUuid);
  await loadRequests();
  closeDropdown();
}

async function handleDeleteSelected() {
  // Use API to delete all selected questions
  const toDelete = filteredRequests.value.filter(r => selectedRows.value.includes(r.id));
  for (const req of toDelete) {
    await deleteQuestion(req.originalData.questionUuid);
  }
  selectedRows.value = [];
  selectAll.value = false;
  await loadRequests();
}

function openDropdown(rowId) {
  showDropdown.value = showDropdown.value === rowId ? null : rowId;
}

function closeDropdown() {
  showDropdown.value = null;
}

const showDropdown = ref(null);

function handlePrint(request) {
  printReport(request);
}
</script>

<template>
  <div class="w-full">
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <input
        type="text"
        v-model="searchTerm"
        @input="handleSearch"
        placeholder="Search requests..."
        class="border rounded px-3 py-2 w-full sm:w-64"
      />
      <div v-if="selectedRows.length > 0" class="flex gap-2">
        <button
          @click="handleDeleteSelected"
          class="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
        >
          Delete Selected ({{ selectedRows.length }})
        </button>
      </div>
    </div>
    <div v-if="filteredRequests.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No completed requests</h3>
      <p class="text-gray-500">Completed drug information requests will appear here.</p>
    </div>
    <div v-else>
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Completed Drug Information Requests ({{ filteredRequests.length }})</h3>
        <p class="text-sm text-gray-600">Successfully completed drug information requests</p>
      </div>
      <div class="w-full overflow-x-auto">
        <table class="w-full table-fixed">
          <thead class="bg-gray-50">
            <tr class="text-center">
              <th class="w-12 px-3 py-3 align-middle">
                <input
                  type="checkbox"
                  :checked="selectAll"
                  @change="() => { selectAll = !selectAll; toggleSelectAll(); }"
                  class="form-checkbox h-4 w-4 mx-auto"
                  title="Select All"
                />
              </th>
              <th class="px-3 py-3 align-middle">Request ID</th>
              <th class="px-3 py-3 align-middle">Patient</th>
              <th class="px-3 py-3 align-middle">Type</th>
              <th class="px-3 py-3 align-middle">Question</th>
              <th class="px-3 py-3 align-middle">Completed By</th>
              <th class="px-3 py-3 align-middle">Priority</th>
              <th class="px-3 py-3 align-middle">Completed</th>
              <th class="px-3 py-3 align-middle">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="row in filteredRequests" :key="row.id" class="hover:bg-gray-50 relative text-center">
              <td class="w-12 px-3 py-4 align-middle">
                <input
                  type="checkbox"
                  :checked="selectedRows.includes(row.id)"
                  @change="toggleSelectRow(row.id)"
                  class="form-checkbox h-4 w-4 mx-auto"
                />
              </td>
              <td class="px-3 py-4 align-middle">{{ row.id }}</td>
              <td class="px-3 py-4 align-middle">{{ row.patientName }}</td>
              <td class="px-3 py-4 align-middle">
                <span :class="['inline-block px-2 py-1 text-xs font-medium rounded-full', getRequestTypeColor(row.requestType)]">
                  {{ row.requestType }}
                </span>
              </td>
              <td class="px-3 py-4 align-middle">
                <div class="max-w-xs mx-auto">
                  <p class="text-sm text-gray-900 truncate" :title="row.question">
                    {{ row.question }}
                  </p>
                </div>
              </td>
              <td class="px-3 py-4 align-middle">{{ row.completedBy }}</td>
              <td class="px-3 py-4 align-middle">
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', getPriorityColor(row.priority)]">
                  {{ row.priority }}
                </span>
              </td>
              <td class="px-3 py-4 align-middle">{{ row.completedAt }}</td>
              <td class="px-3 py-4 align-middle relative">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="viewCompleted(row)"
                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  >
                    View Details
                  </button>
                  <button
                    @click="openDropdown(row.id)"
                    class="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100"
                  >
                    &#x22EE;
                  </button>
                  <div v-if="showDropdown === row.id" class="absolute z-10 right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                    <button
                      @click="handlePrint(row)"
                      class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      Print Report
                    </button>
                    <button
                      @click="handleDelete(row)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                    <button
                      @click="closeDropdown"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>




