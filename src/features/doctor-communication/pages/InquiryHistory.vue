c<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'

const router = useRouter()



const searchQuery = ref('')
const allInquiries = ref([])
const newMessageNotifications = ref(new Set())

const tableHeaders = {
  head: ['Request Date', 'Requested By', 'Request Detail', 'Status', 'Actions'],
  row: ['requestDate', 'doctorName', 'requestDetail', 'status']
}

const filteredInquiries = computed(() => {
  if (!searchQuery.value) return allInquiries.value
  
  return allInquiries.value.filter(inquiry => 
    inquiry.doctorName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    inquiry.requestDetail.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function respondToInquiry(inquiryId) {
  router.push(`/respond_inquiry/${inquiryId}`)
}

function hasNewMessage(inquiryId) {
  return newMessageNotifications.value.has(inquiryId)
}

onMounted(() => {
  // Mock data - replace with actual API calls
  allInquiries.value = [
    {
      id: 1,
      requestDate: '2024-01-15',
      doctorName: 'Dr. John Smith',
      requestDetail: 'Drug interaction between Warfarin and Aspirin',
      status: 'Pending'
    },
    {
      id: 2,
      requestDate: '2024-01-14',
      doctorName: 'Dr. Sarah Johnson',
      requestDetail: 'Dosage adjustment for elderly patients',
      status: 'Responded'
    },
    // Add more mock data
  ]
  
  // Mock new message notifications
  newMessageNotifications.value.add(1)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header  -->
  
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Full History</h1>
        <p class="text-gray-600">Complete archive of all doctor inquiries</p>
      </div>
    
    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="relative">
        <i v-html="icons.search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by doctor name or request details..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Inquiries Table -->
    <div class="bg-white rounded-lg shadow mb-6">
      <Table :rows="filteredInquiries" :headers="tableHeaders">
        <template #doctorName="{ row }">
          <div class="flex items-center gap-2">
            {{ row.doctorName }}
            <div v-if="hasNewMessage(row.id)" 
                 class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                 title="New message">
            </div>
          </div>
        </template>
        <template #actions="{ row }">
          <Button 
            @click="respondToInquiry(row.id)"
            size="sm"
            type="primary"
            class="flex items-center gap-1"
          >
            <i v-html="icons.reply"></i>
            Respond
          </Button>
        </template>
      </Table>
    </div>
  </div>
</template>



