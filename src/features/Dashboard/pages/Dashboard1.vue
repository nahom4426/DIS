<script setup>
import icons from "@/utils/icons";
import { ref, onMounted } from "vue";
import Button from "@/components/Button.vue";
import Table from "@/components/Table.vue";
import { useAuthStore } from "@/stores/auth";
// Import the report API
import { getDoctorCommReport } from "@/features/Dashboard/api/reportUserApi";

const authStore = useAuthStore();

const reportStats = ref({
  dailyAnswers: 0,
  pendingQuestions: 0,
  weeklyQuestions: 0,
  monthlyAnswers: 0,
  dailyQuestions: 0,
  weeklyAnswers: 0,
  monthlyQuestions: 0,
});

onMounted(async () => {
  const userUuid = authStore.auth?.userUuid || authStore.auth?.user?.userUuid;
  if (!userUuid) return;
  try {
    const res = await getDoctorCommReport(userUuid);
    if (res?.data) {
      Object.assign(reportStats.value, res.data);
    }
  } catch (error) {
    console.error("Error fetching doctor report:", error);
  }
});

// Doctor-specific data with query-based stats


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

    <!-- Doctor Report Stats from API -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <p class="text-sm font-medium text-gray-600">Daily Questions</p>
        <p class="text-2xl font-bold text-blue-600">{{ reportStats.dailyQuestions }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <p class="text-sm font-medium text-gray-600">Daily Answers</p>
        <p class="text-2xl font-bold text-green-600">{{ reportStats.dailyAnswers }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <p class="text-sm font-medium text-gray-600">Pending Questions</p>
        <p class="text-2xl font-bold text-orange-600">{{ reportStats.pendingQuestions }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <p class="text-sm font-medium text-gray-600">Monthly Answers</p>
        <p class="text-2xl font-bold text-purple-600">{{ reportStats.monthlyAnswers }}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <p class="text-sm font-medium text-gray-600">Weekly Questions</p>
        <p class="text-2xl font-bold text-blue-600">{{ reportStats.weeklyQuestions }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <p class="text-sm font-medium text-gray-600">Weekly Answers</p>
        <p class="text-2xl font-bold text-green-600">{{ reportStats.weeklyAnswers }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <p class="text-sm font-medium text-gray-600">Monthly Questions</p>
        <p class="text-2xl font-bold text-purple-600">{{ reportStats.monthlyQuestions }}</p>
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
