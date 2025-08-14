<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'
import { openModal } from '@customizer/modal-x'

const router = useRouter()

const analytics = ref({
  weeklyInquiries: 0,
  monthlyInquiries: 0,
  pendingInquiries: 0,
  commonTopics: []
})

const recentInquiries = ref([])
const searchQuery = ref('')
const selectedFilter = ref('all')
const dateFilter = ref('all')
const showFilters = ref(false)

const filterOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'responded', label: 'Responded' },
  { value: 'in-progress', label: 'In Progress' }
]

const dateFilterOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' }
]

const tableHeaders = {
  head: ['Date', 'Doctor', 'Subject', 'Status', 'Actions'],
  row: ['date', 'doctorName', 'subject', 'status']
}

const filteredInquiries = computed(() => {
  let filtered = recentInquiries.value

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(inquiry => 
      inquiry.doctorName.toLowerCase().includes(search) ||
      inquiry.subject.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(inquiry => 
      inquiry.status.toLowerCase() === selectedFilter.value
    )
  }

  // Date filter
  if (dateFilter.value !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    filtered = filtered.filter(inquiry => {
      const inquiryDate = new Date(inquiry.date)
      
      switch (dateFilter.value) {
        case 'today':
          return inquiryDate >= today
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return inquiryDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
          return inquiryDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered
})

function respondToInquiry(inquiryId) {
  router.push(`/doctor-comm/respond/${inquiryId}`)
}

function deleteInquiry(inquiryId) {
  openModal(
    'Confirmation',
    {
      title: 'Delete Inquiry',
      message: 'Are you sure you want to delete this inquiry? This action cannot be undone.'
    },
    (confirmed) => {
      if (confirmed) {
        recentInquiries.value = recentInquiries.value.filter(inquiry => inquiry.id !== inquiryId)
      }
    }
  )
}

function goToFullHistory() {
  router.push('/doctor-comm/history')
}

function clearFilters() {
  searchQuery.value = ''
  selectedFilter.value = 'all'
  dateFilter.value = 'all'
}

onMounted(() => {
  // Mock data - replace with actual API calls
  analytics.value = {
    weeklyInquiries: 24,
    monthlyInquiries: 89,
    pendingInquiries: 8,
    commonTopics: ['Drug Interactions', 'Dosage Questions', 'Side Effects', 'Contraindications']
  }

  recentInquiries.value = [
    {
      id: 1,
      date: '2024-01-15',
      doctorName: 'Dr. John Smith',
      subject: 'Drug interaction between Warfarin and Aspirin',
      status: 'Pending'
    },
    {
      id: 2,
      date: '2024-01-14',
      doctorName: 'Dr. Sarah Johnson',
      subject: 'Dosage adjustment for elderly patients',
      status: 'Responded'
    },
    {
      id: 3,
      date: '2024-01-13',
      doctorName: 'Dr. Michael Brown',
      subject: 'Side effects of new medication',
      status: 'Pending'
    }
  ]
})
</script>
<template>
  <div class="p-6 space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img src="/src/assets/Adobe Express - file (2).png" alt="Logo" class="w-12 h-12" />
          <div>
            <h1 class="text-2xl font-bold">Welcome to Ethiopian Drug Information System</h1>
            <p class="text-blue-100 mt-1">Your dedicated platform for doctor-pharmacist communication</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-blue-100">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          <p class="text-lg font-semibold">{{ new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</p>
        </div>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">This Week</h3>
        <p class="text-2xl font-bold text-blue-600">{{ analytics.weeklyInquiries }}</p>
        <p class="text-xs text-gray-500">Inquiries</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">This Month</h3>
        <p class="text-2xl font-bold text-green-600">{{ analytics.monthlyInquiries }}</p>
        <p class="text-xs text-gray-500">Inquiries</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Pending</h3>
        <p class="text-2xl font-bold text-orange-600">{{ analytics.pendingInquiries }}</p>
        <p class="text-xs text-gray-500">Responses</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Common Topics</h3>
        <div class="space-y-1">
          <div v-for="topic in analytics.commonTopics.slice(0, 2)" :key="topic" 
               class="text-xs bg-gray-100 px-2 py-1 rounded">
            {{ topic }}
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-4 rounded-lg shadow space-y-4">
      <!-- Search Bar -->
      <div class="relative">
        <i v-html="icons.search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by doctor name or subject..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Filter Controls -->
      <div class="flex flex-wrap items-center gap-4">
        <button
          @click="showFilters = !showFilters"
          class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <i v-html="icons.filter"></i>
          Filters
        </button>

        <!-- Quick Filters -->
        <div class="flex flex-wrap gap-2">
          <select
            v-model="selectedFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <select
            v-model="dateFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in dateFilterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <button
            @click="clearFilters"
            class="px-3 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        </div>

        <!-- Results Count -->
        <div class="ml-auto text-sm text-gray-600">
          Showing {{ filteredInquiries.length }} of {{ recentInquiries.length }} inquiries
        </div>
      </div>
    </div>

    <!-- Recent Inquiries Table -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="p-6 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold">Recent Inquiries</h2>
        <Button 
          @click="goToFullHistory"
          type="outline"
          size="sm"
          class="flex items-center gap-2"
        >
          <i v-html="icons.history"></i>
          View Full History
        </Button>
      </div>
      <div class="overflow-x-auto">
        <Table :rows="filteredInquiries" :headers="tableHeaders">
          <template #actions="{ row }">
            <div class="flex items-center gap-2">
              <Button 
                @click="respondToInquiry(row.id)"
                size="sm"
                type="primary"
                class="flex items-center gap-1"
              >
                <i v-html="icons.reply"></i>
                Respond
              </Button>
              <button
                @click="deleteInquiry(row.id)"
                class="px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded text-sm"
                title="Delete inquiry"
              >
                <i v-html="icons.delete"></i>
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>




