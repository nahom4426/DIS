<script setup>
import Table from "@/components/Table.vue";
import { ref, computed, onMounted } from "vue";
import { openModal } from "@customizer/modal-x";
import icons from "@/utils/icons";

const props = defineProps({
  search: String,
});

const completedRequests = ref([]);

function loadRequests() {
  const stored = localStorage.getItem('drugInformationRequests');
  if (stored) {
    const requests = JSON.parse(stored);
    completedRequests.value = requests
      .filter(request => request.status === 'Completed')
      .map((request, index) => ({
        id: `DI-${String(index + 1).padStart(3, '0')}`,
        requestType: getRequestTypeDisplay(request.requestType),
        patientName: getPatientDisplay(request),
        question: request.requestQuestion,
        responseNeeded: request.responseNeeded,
        submittedAt: formatDate(request.submittedAt),
        completedAt: request.completedAt ? formatDate(request.completedAt) : 'N/A',
        status: request.status,
        priority: getPriority(request.responseNeeded),
        completedBy: request.completedBy || 'Dr. Amanda Ross',
        originalData: request,
        originalIndex: requests.indexOf(request)
      }));
  }
}

onMounted(() => {
  loadRequests();
  setInterval(loadRequests, 2000);
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

function viewCompleted(request) {
  const data = request.originalData;
  openModal('ViewCompleted', {
    requestId: request.id,
    requestType: request.requestType,
    patientInfo: data.patientInfo,
    question: data.requestQuestion,
    responseNeeded: data.responseNeeded,
    submittedAt: request.submittedAt,
    completedAt: request.completedAt,
    completedBy: request.completedBy,
    status: request.status,
    priority: request.priority
  });
}

function printReport(request) {
  // Generate a printable report
  const printWindow = window.open('', '_blank');
  const data = request.originalData;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Drug Information Request Report - ${request.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; }
          .patient-info { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Drug Information Request Report</h1>
          <h2>Request ID: ${request.id}</h2>
        </div>
        
        <div class="section">
          <div class="label">Request Type:</div>
          <div>${request.requestType}</div>
        </div>
        
        ${request.requestType === 'Patient Specific' && data.patientInfo ? `
          <div class="section">
            <div class="label">Patient Information:</div>
            <div class="patient-info">
              <p><strong>Age:</strong> ${data.patientInfo.age || 'N/A'}</p>
              <p><strong>Sex:</strong> ${data.patientInfo.sex || 'N/A'}</p>
              <p><strong>Weight:</strong> ${data.patientInfo.weight || 'N/A'} kg</p>
              <p><strong>Diagnosis:</strong> ${data.patientInfo.diagnosis || 'N/A'}</p>
              ${data.patientInfo.currentMedication ? `<p><strong>Current Medication:</strong> ${data.patientInfo.currentMedication}</p>` : ''}
              ${data.patientInfo.allergies ? `<p><strong>Allergies:</strong> ${data.patientInfo.allergies}</p>` : ''}
            </div>
          </div>
        ` : ''}
        
        <div class="section">
          <div class="label">Question/Request:</div>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${data.requestQuestion}</div>
        </div>
        
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
</script>

<template>
  <div class="p-6">
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

      <Table
        :pending="false"
        :rows="filteredRequests"
        :headers="{
          head: ['Request ID', 'Patient', 'Type', 'Question', 'Completed By', 'Priority', 'Completed', 'Actions'],
          row: ['id', 'patientName', 'requestType', 'question', 'completedBy', 'priority', 'completedAt']
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
              @click="viewCompleted(row)"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              View Details
            </button>
            <button
              @click="printReport(row)"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
            >
              Print Report
            </button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>




