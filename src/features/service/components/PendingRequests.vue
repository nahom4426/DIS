<script setup>
import Table from "@/components/Table.vue";
import { ref, computed, onMounted } from "vue";
import { openModal } from "@customizer/modal-x";
import icons from "@/utils/icons";
import { getUserQuestions, updateQuestion, deleteQuestion } from "@/features/service/api/questionApi";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps({
  search: String,
});

const drugInformationRequests = ref([]);
const showDropdown = ref(null);
const searchTerm = ref('');
const selectedRows = ref([]);
const selectAll = ref(false);

// Load and watch for new requests
async function loadRequests() {
  const userUuid = authStore.auth?.userUuid;
  if (!userUuid) return;
  const response = await getUserQuestions(userUuid);
  if (response.success && Array.isArray(response.data)) {
    drugInformationRequests.value = response.data
      .filter(q => !q.answer && (q.questionStatus === "PENDING" || q.questionStatus === "UNANSWERED"))
      .map((q, index) => ({
        id: `DI-${String(index + 1).padStart(3, '0')}`,
        requestType: q.patientType === "PATIENT_SPECIFIC" ? "Patient Specific" : "Academic",
        patientName: q.firstName || "N/A",
        question: q.description,
        responseNeeded: q.responseUrgency,
        submittedAt: q.createdAt,
        status: q.questionStatus,
        priority: getPriority(q.responseUrgency),
        assignedTo: q.assignedTo || 'Unassigned',
        originalData: q,
        originalIndex: index
      }));
  }
}

onMounted(() => {
  loadRequests();
});

function assignRequest(request) {
  const allRequests = JSON.parse(localStorage.getItem('drugInformationRequests') || '[]');
  allRequests[request.originalIndex].status = 'In Progress';
  allRequests[request.originalIndex].assignedTo = 'Dr. Amanda Ross';
  allRequests[request.originalIndex].startedAt = new Date().toISOString();
  localStorage.setItem('drugInformationRequests', JSON.stringify(allRequests));
  loadRequests();
}

function openDropdown(id) {
  showDropdown.value = id;
}

function closeDropdown() {
  showDropdown.value = null;
}

async function handleUpdate(request) {
  // Do NOT change status, assignedTo, or startedAt
  await updateQuestion(request.originalData.questionUuid, {}); 

  await loadRequests(); // refresh table
  closeDropdown();      // close the dropdown after update
}



async function handleDelete(request) {
  await deleteQuestion(request.originalData.questionUuid);
  loadRequests();
  closeDropdown();
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
    case 'Academic': return 'bg-purple-100 text-purple-800';
    case 'Other': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function viewDetails(request) {
  // Navigate to QuestionDetail page with questionUuid as route param
  router.push({ name: 'QuestionDetail', params: { id: request.originalData.questionUuid } });
}

function handleSearch(e) {
  searchTerm.value = e.target.value;
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedRows.value = filteredRequests.value.map(r => r.id);
  } else {
    selectedRows.value = [];
  }
}

function toggleSelectRow(id) {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(rowId => rowId !== id);
  } else {
    selectedRows.value.push(id);
  }
  selectAll.value = selectedRows.value.length === filteredRequests.value.length;
}

async function handleDeleteSelected() {
  const toDelete = filteredRequests.value.filter(r => selectedRows.value.includes(r.id));
  for (const req of toDelete) {
    await deleteQuestion(req.originalData.questionUuid);
  }
  selectedRows.value = [];
  selectAll.value = false;
  await loadRequests();
}

const filteredRequests = computed(() => {
  const term = searchTerm.value?.toLowerCase() || props.search?.toLowerCase() || '';
  if (!term) return drugInformationRequests.value;
  return drugInformationRequests.value.filter(request => 
    request.question.toLowerCase().includes(term) ||
    request.requestType.toLowerCase().includes(term) ||
    request.id.toLowerCase().includes(term) ||
    request.patientName.toLowerCase().includes(term)
  );
});
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No pending drug information requests</h3>
      <p class="text-gray-500">Submit a new drug information request to get started.</p>
    </div>
    <div v-else>
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Pending Drug Information Requests ({{ filteredRequests.length }})</h3>
        <p class="text-sm text-gray-600">Review and assign submitted drug information requests</p>
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
              <th class="px-3 py-3 align-middle">Priority</th>
              <th class="px-3 py-3 align-middle">Response Time</th>
              <th class="px-3 py-3 align-middle">Submitted At</th>
              <th class="px-3 py-3 align-middle">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="row in filteredRequests" :key="row.id" class="hover:bg-gray-50 relative text-center">
              <!-- Checkbox -->
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
                  {{
                    row.requestType === "Patient Specific"
                      ? "Patient Specific"
                      : row.requestType === "Academic"
                        ? "Academic"
                        : "Other"
                  }}
                </span>
              </td>
              <td class="px-3 py-4 align-middle">
                <div class="max-w-xs mx-auto">
                  <p class="text-sm text-gray-900 truncate" :title="row.question">
                    {{ row.question }}
                  </p>
                </div>
              </td>
              <td class="px-3 py-4 align-middle">
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', getPriorityColor(row.priority)]">
                  {{ row.priority }}
                </span>
              </td>
              <td class="px-3 py-4 align-middle">{{ row.responseNeeded }}</td>
              <td class="px-3 py-4 align-middle whitespace-pre-wrap break-words">
                {{ formatDate(row.submittedAt) }}
              </td>
              <td class="px-3 py-4 align-middle relative">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="viewDetails(row)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50"
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





