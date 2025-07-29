<script setup>
import icons from "@/utils/icons";
import { ref, onMounted } from "vue";
import Button from "@/components/Button.vue";
import Table from "@/components/Table.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// Doctor-specific data with query-based stats
const doctorStats = ref([
  {
    title: "Active Patients",
    value: "127",
    change: "+12",
    changeType: "increase",
    icon: icons.users,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Drug Inquiries",
    value: "23",
    change: "+5",
    changeType: "increase", 
    icon: icons.question_mark_circle,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Pending Responses",
    value: "8",
    change: "-2",
    changeType: "decrease",
    icon: icons.clock,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    title: "Resolved Today",
    value: "15",
    change: "+8",
    changeType: "increase",
    icon: icons.check_circle,
    color: "bg-green-50 text-green-600"
  }
]);

// Drug inquiry status data
const drugInquiries = ref([
  {
    id: "DI001",
    patientName: "Sarah Johnson",
    requestType: "Patient Specific",
    question: "Drug interaction between Lisinopril and Ibuprofen",
    priority: "Urgent",
    status: "Pending Review",
    submittedAt: "2024-01-15 09:30",
    responseNeeded: "30-60 min",
    assignedTo: "Dr. Amanda Ross"
  },
  {
    id: "DI002", 
    patientName: "Michael Chen",
    requestType: "Academic",
    question: "Dosage adjustment for elderly patients with Metformin",
    priority: "Normal",
    status: "In Progress",
    submittedAt: "2024-01-15 08:15",
    responseNeeded: "End of day",
    assignedTo: "Dr. Amanda Ross"
  },
  {
    id: "DI003",
    patientName: "Emily Davis",
    requestType: "Patient Specific", 
    question: "Alternative medications for Albuterol allergy",
    priority: "High",
    status: "Completed",
    submittedAt: "2024-01-14 16:45",
    responseNeeded: "Prompt",
    assignedTo: "Dr. Amanda Ross"
  },
  {
    id: "DI004",
    patientName: "Robert Wilson",
    requestType: "Other",
    question: "Contraindications for cardiac patients",
    priority: "Normal",
    status: "Pending Review",
    submittedAt: "2024-01-14 14:20",
    responseNeeded: "When time permits",
    assignedTo: "Dr. Amanda Ross"
  }
]);

const activeTab = ref('inquiries');

function getPriorityColor(priority) {
  switch(priority) {
    case 'Urgent': return 'bg-red-100 text-red-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Normal': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getInquiryStatusColor(status) {
  switch(status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
    case 'Overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getRequestTypeColor(type) {
  switch(type) {
    case 'Patient Specific': return 'bg-purple-100 text-purple-800';
    case 'Academic': return 'bg-indigo-100 text-indigo-800';
    case 'Other': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img src="/src/assets/Adobe Express - file (2).png" alt="Logo" class="w-12 h-12" />
          <div>
            <h1 class="text-2xl font-bold">Welcome, Dr. {{ authStore.auth?.user?.firstName || 'User' }} {{ authStore.auth?.user?.lastName || authStore.auth?.user?.fatherName || 'Name' }}</h1>
            <p class="text-blue-100 mt-1">Here's what's happening with your patients today</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-blue-100">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          <p class="text-lg font-semibold">{{ new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</p>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in doctorStats"
        :key="stat.title"
        class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
            <div class="flex items-center mt-2">
              <span
                :class="[
                  'text-sm font-medium',
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ stat.change }}
              </span>
              <span class="text-sm text-gray-500 ml-1">from yesterday</span>
            </div>
          </div>
          <div :class="['p-3 rounded-lg', stat.color]">
            <i v-html="stat.icon" class="text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->

    
  </div>
</template>
