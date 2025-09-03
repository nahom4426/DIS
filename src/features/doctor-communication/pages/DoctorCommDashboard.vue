<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'
import { openModal } from '@customizer/modal-x'
import { getAllInquiries } from '../api/inquiryApi'
import { getDoctorCommReport } from "@/features/Dashboard/api/reportUserApi"
import { useAuthStore } from '@/stores/auth'


const router = useRouter()
const authStore = useAuthStore();
const sortBy = ref('createdAt'); // default sort field
const sortOrder = ref('desc');   // default sort order


const analytics = ref({
  dailyAnswers: 0,
  pendingQuestions: 0,
  weeklyQuestions: 0,
  monthlyAnswers: 0,
  dailyQuestions: 0,
  weeklyAnswers: 0,
  monthlyQuestions: 0,
  commonTopics: []
})

const allInquiries = ref([])
const searchQuery = ref('')
const selectedFilter = ref('all')
const dateFilter = ref('all')
const showFilters = ref(false)
const openDropdownId = ref(null)

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

const filteredInquiries = computed(() => {
  let filtered = allInquiries.value

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(inquiry => 
      inquiry.doctorName?.toLowerCase().includes(search) ||
      inquiry.subject?.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(inquiry => 
      inquiry.status?.toLowerCase() === selectedFilter.value
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

  // Permanently sort by most recent (descending by date)
  filtered = [...filtered].sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)
    return bDate - aDate
  })

  // Limit to 5 most recent
  return filtered.slice(0, 5)
})

function respondToInquiry(inquiryId) {
  router.push(`/doctor-comm/respond/${inquiryId}`)
  closeAllDropdowns()
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
        allInquiries.value = allInquiries.value.filter(inquiry => inquiry.id !== inquiryId)
      }
    }
  )
  closeAllDropdowns()
}

function goToFullHistory() {
  router.push('/doctor-comm/history')
}

function clearFilters() {
  searchQuery.value = ''
  selectedFilter.value = 'all'
  dateFilter.value = 'all'
}

function showDropdown(event, inquiry) {
  event.stopPropagation();
  openDropdownId.value = inquiry.id;
}

function closeAllDropdowns() {
  openDropdownId.value = null;
}

function handleDropdownAction(action) {
  closeAllDropdowns();
  action();
}
function sortTable(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
}


onMounted(async () => {
  // Yes, you can use authStore to fetch the userUuid
  const userUuid = authStore.auth?.userUuid || authStore.auth?.user?.userUuid;
  if (!userUuid) return;

  try {
    const reportRes = await getDoctorCommReport(userUuid)
    if (reportRes?.data) {
      Object.assign(analytics.value, reportRes.data)
    }
  } catch (error) {
    console.error("Error fetching report:", error)
  }

  // Fetch inquiries from backend (same as InquiryHistory)
  const response = await getAllInquiries(userUuid)
  if (response && response.success && Array.isArray(response.data)) {
    allInquiries.value = response.data.map(inquiry => ({
      id: inquiry.questionUuid,
      date: new Date(inquiry.createdAt).toLocaleDateString(),
      doctorName: inquiry.firstName || 'Unknown Doctor',
      subject: inquiry.description || 'No subject',
      status: inquiry.questionStatus || 'Pending'
    }))
  } else {
    allInquiries.value = []
  }

  document.addEventListener('click', closeAllDropdowns);
})
onUnmounted(() => {
  document.removeEventListener('click', closeAllDropdowns)
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
        <h3 class="text-sm font-medium text-gray-500">Daily Questions</h3>
        <p class="text-2xl font-bold text-blue-600">{{ analytics.dailyQuestions }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Weekly Questions</h3>
        <p class="text-2xl font-bold text-green-600">{{ analytics.weeklyQuestions }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Monthly Questions</h3>
        <p class="text-2xl font-bold text-purple-600">{{ analytics.monthlyQuestions }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Pending Questions</h3>
        <p class="text-2xl font-bold text-orange-600">{{ analytics.pendingQuestions }}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Daily Answers</h3>
        <p class="text-2xl font-bold text-blue-600">{{ analytics.dailyAnswers }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Weekly Answers</h3>
        <p class="text-2xl font-bold text-green-600">{{ analytics.weeklyAnswers }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Monthly Answers</h3>
        <p class="text-2xl font-bold text-purple-600">{{ analytics.monthlyAnswers }}</p>
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
          Showing {{ filteredInquiries.length }} of {{ allInquiries.length }} inquiries
        </div>
      </div>
    </div>

    <!-- Recent Inquiries Table (same as InquiryHistory, 5-row limit) -->
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
        <table class="w-full table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th class="w-64 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th class="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="row in filteredInquiries" :key="row.id" class="hover:bg-gray-50 relative">
              <!-- Date -->
              <td class="w-24 px-3 py-4">
                <div class="text-sm text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap" :title="row.date">
                  {{ row.date }}
                </div>
              </td>
              <!-- Doctor -->
              <td class="w-32 px-3 py-4">
                <span class="text-sm font-medium text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap flex-1" :title="row.doctorName">
                  {{ row.doctorName }}
                </span>
              </td>
              <!-- Subject -->
              <td class="w-64 px-3 py-4">
                <div class="text-sm text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap" :title="row.subject">
                  {{ row.subject }}
                </div>
              </td>
              <!-- Status -->
              <td class="w-24 px-3 py-4">
                <span class="inline-block px-2 py-1 rounded-full text-xs font-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-full" :class="{
                  'bg-yellow-100 text-yellow-800': row.status.toLowerCase() === 'pending',
                  'bg-green-100 text-green-800': row.status.toLowerCase() === 'responded',
                  'bg-blue-100 text-blue-800': row.status.toLowerCase() === 'in-progress'
                }" :title="row.status">
                  {{ row.status }}
                </span>
              </td>
              <!-- Actions -->
              <td class="w-32 px-3 py-4 relative">
                <div class="flex items-center gap-1">
                   <!-- Respond/View button -->
                  <Button 
                    @click="respondToInquiry(row.questionUuid)"
                    size="sm"
                    type="primary"
                    class="text-xs px-2 py-1 flex-shrink-0"
                  >
                    {{ row.hasAnswer || row.questionStatus === 'answered' ? 'View' : 'Respond' }}
                  </Button>
                  <!-- Three dots dropdown -->
                  <div class="relative flex-shrink-0">
                    <button
                      @click="showDropdown($event, row)"
                      class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                      title="More options"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="5" cy="12" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="19" cy="12" r="2"/>
                      </svg>
                    </button>
                    <!-- Dropdown menu -->
                    <div 
                      v-if="openDropdownId === row.id"
                      :id="`dropdown-${row.id}`"
                      class="dropdown-menu absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-[9999]"
                    >
                      <div class="py-1">
                        <button
                          @click="handleDropdownAction(() => respondToInquiry(row.id))"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                        >
                          <i v-html="icons.reply" class="w-4 h-4"></i>
                          Respond
                        </button>
                        <button
                          @click="handleDropdownAction(() => deleteInquiry(row.id))"
                          class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <i v-html="icons.delete" class="w-4 h-4"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="filteredInquiries.length === 0">
              <td colspan="5" class="text-center py-6 text-gray-400">No recent inquiries found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-ellipsis {
  text-overflow: ellipsis;
}
table {
  table-layout: fixed;
}
td, th {
  word-wrap: break-word;
  overflow: hidden;
}
.max-w-full {
  max-width: 100%;
}
.dropdown-menu {
  z-index: 99999 !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 25px -3px rgba(0, 0, 0, 0.1) !important;
}
.bg-white.rounded-lg.shadow,
.overflow-x-auto,
table, thead, tbody, tr, td, th {
  overflow: visible !important;
}
.dropdown-trigger {
  position: relative;
  z-index: 1;
}
</style>




