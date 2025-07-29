<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'

const router = useRouter()
const stats = ref({
  totalInquiries: 0,
  pendingResponses: 0,
  todayInquiries: 0,
  avgResponseTime: '0h'
})

const recentActivity = ref([])
const quickActions = [
  {
    title: 'View Recent Inquiries',
    description: 'Check latest doctor requests',
    icon: icons.inbox,
    action: () => router.push('/doctor-comm/inquiries'),
    color: 'bg-blue-500'
  },
  {
    title: 'Browse Full History',
    description: 'Access complete inquiry archive',
    icon: icons.history,
    action: () => router.push('/doctor-comm/history'),
    color: 'bg-green-500'
  },
  {
    title: 'Drug Lookup Tool',
    description: 'Search drug information',
    icon: icons.search,
    action: () => router.push('/doctor-comm/drug-lookup'),
    color: 'bg-purple-500'
  }
]

onMounted(() => {
  // Mock data - replace with actual API calls
  stats.value = {
    totalInquiries: 156,
    pendingResponses: 8,
    todayInquiries: 12,
    avgResponseTime: '2.5h'
  }

  recentActivity.value = [
    {
      id: 1,
      type: 'new_inquiry',
      message: 'New inquiry from Dr. Smith about drug interactions',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'response_sent',
      message: 'Response sent to Dr. Johnson regarding dosage',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'new_inquiry',
      message: 'New inquiry from Dr. Brown about side effects',
      time: '2 hours ago'
    }
  ]
})
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
      <h1 class="text-3xl font-bold mb-2">Welcome to Ethiopina Drug Information system</h1>
      <p class="text-blue-100 text-lg">Your dedicated platform for doctor-pharmacist communication</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <i v-html="icons.chat" class="h-6 w-6"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Inquiries</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalInquiries }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 text-orange-600">
            <i v-html="icons.clock" class="h-6 w-6"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending Responses</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingResponses }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <i v-html="icons.calendar" class="h-6 w-6"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Today's Inquiries</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.todayInquiries }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <i v-html="icons.timer" class="h-6 w-6"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg Response Time</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.avgResponseTime }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="action in quickActions" 
        :key="action.title"
        @click="action.action"
        class="bg-white p-8 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center mb-4">
          <div :class="[action.color, 'p-4 rounded-lg text-white']">
            <i v-html="action.icon" class="h-8 w-8"></i>
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ action.title }}</h3>
        <p class="text-gray-600">{{ action.description }}</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id"
            class="flex items-start space-x-3"
          >
            <div class="flex-shrink-0">
              <div class="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



