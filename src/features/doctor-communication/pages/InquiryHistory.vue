<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'
import { openModal } from '@customizer/modal-x'
import { useApiRequest } from '@/composables/useApiRequest'
import { getAllInquiries, deleteInquiry as deleteInquiryApi } from '../api/inquiryApi'

const router = useRouter()
const authStore = useAuthStore()
const inquiriesReq = useApiRequest()

const searchQuery = ref('')
const allInquiries = ref([])
const newMessageNotifications = ref(new Set())
const selectedFilter = ref('all')
const dateFilter = ref('all')
const showFilters = ref(false)
const selectedInquiries = ref(new Set())
const selectAll = ref(false)
const statusFilter = ref('all')
const openDropdownId = ref(null)
const sortBy = ref('createdAt'); // default sort field
const sortOrder = ref('desc');   // default sort order

const filterOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'unanswered', label: 'Unanswered' },
  { value: 'answered', label: 'Answered' },
  { value: 'in_progress', label: 'In Progress' }
]

const dateFilterOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
]

const statusFilterOptions = [
  { value: 'all', label: 'Select' },
  { value: 'unanswered', label: 'Unanswered Only' },
  { value: 'answered', label: 'Answered Only' },
  { value: 'in_progress', label: 'In Progress Only' }
]

const tableHeaders = {
  head: ['Date', 'Doctor', 'Description', 'Response Urgency', 'Status', 'Actions'],
  row: ['createdAt', 'firstName', 'description', 'responseUrgency', 'questionStatus']
}

// Transform API data to display format
const transformInquiry = (inquiry) => {
  const dateObj = new Date(inquiry.createdAt);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return {
    id: inquiry.questionUuid,
    questionUuid: inquiry.questionUuid,
    createdAt: date,
    createdTime: time,
    firstName: inquiry.firstName || 'Unknown Doctor',
    description: inquiry.description || 'No description provided',
    responseUrgency: inquiry.responseUrgency || 'Normal',
    questionStatus: inquiry.questionStatus?.toLowerCase() || 'unanswered',
    patientAge: inquiry.patientAge,
    patientGender: inquiry.patientGender,
    patientType: inquiry.patientType?.replace('_', ' ') || 'N/A',
    weight: inquiry.weight,
    diagnosis: inquiry.diagnosis,
    currentMedication: inquiry.currentMedication,
    hasAnswer: !!inquiry.answer,
    answer: inquiry.answer
  }
}

function sortTable(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
}

const filteredInquiries = computed(() => {
  let filtered = allInquiries.value

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(inquiry => 
      inquiry.firstName.toLowerCase().includes(search) ||
      inquiry.description.toLowerCase().includes(search) ||
      inquiry.diagnosis?.toLowerCase().includes(search)
    )
  }

  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(inquiry => {
      const status = inquiry.questionStatus.toLowerCase()
      if (selectedFilter.value === 'answered') {
        return inquiry.hasAnswer || status === 'answered'
      }
      return status === selectedFilter.value
    })
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(inquiry => {
      const status = inquiry.questionStatus.toLowerCase()
      if (statusFilter.value === 'answered') {
        return inquiry.hasAnswer || status === 'answered'
      }
      return status === statusFilter.value
    })
  }

  if (dateFilter.value !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    filtered = filtered.filter(inquiry => {
      const inquiryDate = new Date(inquiry.createdAt)
      switch (dateFilter.value) {
        case 'today':
          return inquiryDate >= today
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return inquiryDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
          return inquiryDate >= monthAgo
        case 'year':
          const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
          return inquiryDate >= yearAgo
        default:
          return true
      }
    })
  }

  filtered = [...filtered].sort((a, b) => {
    let aVal = a[sortBy.value];
    let bVal = b[sortBy.value];

    if (sortBy.value === 'createdAt') {
      aVal = new Date(a.createdAt + ' ' + a.createdTime);
      bVal = new Date(b.createdAt + ' ' + b.createdTime);
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered
})

function loadInquiries() {
  const userUuid = authStore.auth?.userUuid || authStore.auth?.user?.userUuid
  
  if (!userUuid) {
    console.error('User UUID not found in auth store')
    return
  }

  inquiriesReq.send(
    () => getAllInquiries(userUuid),
    (response) => {
      if (response.success && response.data) {
        allInquiries.value = response.data.map(transformInquiry)
      } else {
        console.error('Failed to load inquiries:', response.error)
      }
    }
  )
}

function respondToInquiry(questionUuid) {
  router.push(`/doctor-comm/respond/${questionUuid}`)
  closeAllDropdowns()
}

function deleteInquiry(questionUuid) {
  openModal(
    'Confirmation',
    {
      title: 'Delete Inquiry',
      message: 'Are you sure you want to delete this inquiry? This action cannot be undone.'
    },
    (confirmed) => {
      if (confirmed) {
        inquiriesReq.send(
          () => deleteInquiryApi(questionUuid),
          (response) => {
            if (response.success) {
              allInquiries.value = allInquiries.value.filter(inquiry => inquiry.questionUuid !== questionUuid)
              selectedInquiries.value.delete(questionUuid)
            } else {
              console.error('Failed to delete inquiry:', response.error)
            }
          }
        )
      }
    }
  )
  closeAllDropdowns()
}

function deleteSelectedInquiries() {
  if (selectedInquiries.value.size === 0) return
  
  openModal(
    'Confirmation',
    {
      title: 'Delete Selected Inquiries',
      message: `Are you sure you want to delete ${selectedInquiries.value.size} selected inquiries? This action cannot be undone.`
    },
    (confirmed) => {
      if (confirmed) {
        const selectedIds = Array.from(selectedInquiries.value)
        selectedIds.forEach(questionUuid => {
          inquiriesReq.send(
            () => deleteInquiryApi(questionUuid),
            (response) => {
              if (response.success) {
                allInquiries.value = allInquiries.value.filter(inquiry => inquiry.questionUuid !== questionUuid)
              }
            }
          )
        })
        selectedInquiries.value.clear()
        selectAll.value = false
      }
    }
  )
  closeAllDropdowns()
}

function deleteAllInquiries() {
  if (allInquiries.value.length === 0) return
  openModal(
    'Confirmation',
    {
      title: 'Delete All Inquiries',
      message: `Are you sure you want to delete all ${allInquiries.value.length} inquiries? This action cannot be undone.`
    },
    (confirmed) => {
      if (confirmed) {
        const allIds = allInquiries.value.map(inq => inq.questionUuid)
        allIds.forEach(questionUuid => {
          inquiriesReq.send(
            () => deleteInquiryApi(questionUuid),
            (response) => {
              if (response.success) {
                allInquiries.value = allInquiries.value.filter(inq => inq.questionUuid !== questionUuid)
              }
            }
          )
        })
        selectedInquiries.value.clear()
        selectAll.value = false
      }
    }
  )
  closeAllDropdowns()
}

function toggleSelectAll() {
  if (selectAll.value) {
    filteredInquiries.value.forEach(inquiry => selectedInquiries.value.add(inquiry.questionUuid))
  } else {
    selectedInquiries.value.clear()
  }
}

function toggleSelectInquiry(questionUuid) {
  if (selectedInquiries.value.has(questionUuid)) {
    selectedInquiries.value.delete(questionUuid)
  } else {
    selectedInquiries.value.add(questionUuid)
  }
  selectAll.value = filteredInquiries.value.length > 0 && 
    filteredInquiries.value.every(inquiry => selectedInquiries.value.has(inquiry.questionUuid))
}

function selectByStatus() {
  if (statusFilter.value === 'all') {
    selectedInquiries.value.clear()
    selectAll.value = false
  } else {
    const statusInquiries = filteredInquiries.value.filter(inquiry => {
      const status = inquiry.questionStatus.toLowerCase()
      if (statusFilter.value === 'answered') {
        return inquiry.hasAnswer || status === 'answered'
      }
      return status === statusFilter.value
    })
    statusInquiries.forEach(inquiry => selectedInquiries.value.add(inquiry.questionUuid))
    selectAll.value = statusInquiries.length === filteredInquiries.value.length
  }
}

function hasNewMessage(questionUuid) {
  return newMessageNotifications.value.has(questionUuid)
}

function clearFilters() {
  searchQuery.value = ''
  selectedFilter.value = 'all'
  dateFilter.value = 'all'
  statusFilter.value = 'all'
}

function exportHistory() {
  console.log('Exporting inquiry history...')
}

function showDropdown(event, row) {
  event.stopPropagation();
  openDropdownId.value = openDropdownId.value === row.id ? null : row.id;
}

function closeAllDropdowns() {
  openDropdownId.value = null;
}

function handleDropdownAction(action) {
  closeAllDropdowns();
  action();
}

onMounted(() => {
  document.addEventListener('click', closeAllDropdowns);
});
onUnmounted(() => {
  document.removeEventListener('click', closeAllDropdowns);
});

onMounted(() => {
  loadInquiries();
  document.addEventListener('click', closeAllDropdowns);
})

onUnmounted(() => {
  document.removeEventListener('click', closeAllDropdowns)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Full History</h1>
        <p class="text-gray-600">Complete archive of all doctor inquiries</p>
      </div>
      <div class="flex items-center gap-3">
      
        
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
          placeholder="Search by doctor name or description..."
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

        <!-- Sort Dropdown -->
        <select
          v-model="sortBy"
          @change="sortOrder = 'desc'"
          class="px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500"
          style="min-width: 140px;"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="firstName">Sort by Doctor</option>
          <option value="description">Sort by Description</option>
          <option value="responseUrgency">Sort by Urgency</option>
          <option value="questionStatus">Sort by Status</option>
        </select>
     
        <div v-if="showFilters" class="flex flex-wrap items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <!-- Status Filter -->
          <select
            v-model="selectedFilter"
            class="px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <!-- Date Filter -->
           <select
            v-model="dateFilter"
            class="px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in dateFilterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <!-- Status Filter for Selection -->
          <select
            v-model="statusFilter"
            @change="selectByStatus"
            class="px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in statusFilterOptions" :key="option.value" :value="option.value">
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
          <Button 
          v-if="selectedInquiries.size > 0"
          @click="deleteSelectedInquiries"
          type="danger"
          class="flex items-center gap-2"
        >
          <i v-html="icons.delete"></i>
          Delete Selected ({{ selectedInquiries.size }})
        </Button>
        
       
        <!-- Results Count -->
        <div class="ml-auto text-sm text-gray-600">
          Showing {{ filteredInquiries.length }} of {{ allInquiries.length }} inquiries
          <span v-if="selectedInquiries.size > 0" class="ml-2 text-blue-600">
            ({{ selectedInquiries.size }} selected)
          </span>
        </div>
      </div>
       <select
            v-model="dateFilter"
            class="px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in dateFilterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <!-- Status Filter for Selection -->
          <select
            v-model="statusFilter"
            @change="selectByStatus"
            class="px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in statusFilterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
    </div>
   

    <!-- Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="w-full table-fixed">
          <!-- Table Headers -->
          <thead class="bg-gray-50">
            <tr>
              <th class="w-12 px-3 py-3"></th>
              <th class="w-24 px-3 py-3 cursor-pointer" @click="sortTable('createdAt')">
                Date
                <span v-if="sortBy === 'createdAt'">
                  <i v-if="sortOrder === 'asc'" class="fas fa-arrow-up"></i>
                  <i v-else class="fas fa-arrow-down"></i>
                </span>
              </th>
              <th class="w-32 px-3 py-3 cursor-pointer" @click="sortTable('firstName')">
                Doctor
                <span v-if="sortBy === 'firstName'">
                  <i v-if="sortOrder === 'asc'" class="fas fa-arrow-up"></i>
                  <i v-else class="fas fa-arrow-down"></i>
                </span>
              </th>
              <th class="w-64 px-3 py-3 cursor-pointer" @click="sortTable('description')">
                Description
                <span v-if="sortBy === 'description'">
                  <i v-if="sortOrder === 'asc'" class="fas fa-arrow-up"></i>
                  <i v-else class="fas fa-arrow-down"></i>
                </span>
              </th>
              <th class="w-24 px-3 py-3 cursor-pointer" @click="sortTable('responseUrgency')">
                Urgency
                <span v-if="sortBy === 'responseUrgency'">
                  <i v-if="sortOrder === 'asc'" class="fas fa-arrow-up"></i>
                  <i v-else class="fas fa-arrow-down"></i>
                </span>
              </th>
              <th class="w-24 px-3 py-3 cursor-pointer" @click="sortTable('questionStatus')">
                Status
                <span v-if="sortBy === 'questionStatus'">
                  <i v-if="sortOrder === 'asc'" class="fas fa-arrow-up"></i>
                  <i v-else class="fas fa-arrow-down"></i>
                </span>
              </th>
              <th class="w-32 px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="row in filteredInquiries" :key="row.questionUuid" class="hover:bg-gray-50 relative">
              <!-- Checkbox -->
              <td class="w-12 px-3 py-4">
                <input
                  type="checkbox"
                  :checked="selectedInquiries.has(row.questionUuid)"
                  @change="toggleSelectInquiry(row.questionUuid)"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </td>
              
              <!-- Date -->
              <td class="w-24 px-3 py-4 date-cell">
                <div :title="row.createdAt + ' ' + row.createdTime">
                  <div class="text-sm text-gray-900">{{ row.createdAt }}</div>
                  <div class="text-xs text-gray-500">{{ row.createdTime }}</div>
                </div>
              </td>
              
              <!-- Doctor -->
              <td class="w-32 px-3 py-4">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap flex-1" :title="row.firstName">
                    {{ row.firstName }}
                  </span>
                  <div v-if="hasNewMessage(row.questionUuid)" 
                       class="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"
                       title="New message">
                  </div>
                </div>
              </td>
              
              <!-- Description -->
              <td class="w-64 px-3 py-4">
                <div class="text-sm text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap" :title="row.description">
                  {{ row.description }}
                </div>
              </td>
              
              <!-- Response Urgency -->
              <td class="w-24 px-3 py-4">
                <span class="inline-block px-2 py-1 text-xs font-medium rounded-full text-ellipsis overflow-hidden whitespace-nowrap max-w-full" :class="{
                  'bg-red-100 text-red-800': row.responseUrgency === 'High',
                  'bg-yellow-100 text-yellow-800': row.responseUrgency === 'Medium',
                  'bg-green-100 text-green-800': row.responseUrgency === 'Low' || row.responseUrgency === 'Normal'
                }" :title="row.responseUrgency">
                  {{ row.responseUrgency }}
                </span>
              </td>
              
              <!-- Status -->
              <td class="w-24 px-3 py-4">
                <span class="inline-block px-2 py-1 rounded-full text-xs font-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-full" :class="{
                  'bg-yellow-100 text-yellow-800': row.questionStatus === 'unanswered',
                  'bg-green-100 text-green-800': row.hasAnswer || row.questionStatus === 'answered',
                  'bg-blue-100 text-blue-800': row.questionStatus === 'in_progress'
                }" :title="row.hasAnswer ? 'Answered' : row.questionStatus.replace('_', ' ').toUpperCase()">
                  {{ row.hasAnswer ? 'Answered' : row.questionStatus.replace('_', ' ').toUpperCase() }}
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

                  <!-- Dropdown trigger -->
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
                      v-if="openDropdownId === row.questionUuid"
                      :id="`dropdown-${row.questionUuid}`"
                      class="dropdown-menu absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-[9999]"
                    >
                      <div class="py-1">
                        <button
                          @click="handleDropdownAction(() => deleteInquiry(row.questionUuid))"
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
.dropdown-menu {
  z-index: 99999 !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 
              0 10px 25px -3px rgba(0, 0, 0, 0.1) !important;
}
.bg-white.rounded-lg.shadow,
.overflow-x-auto,
table, thead, tbody, tr, td, th {
  overflow: visible !important;
}
</style>
