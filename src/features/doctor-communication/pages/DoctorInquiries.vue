<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'

const router = useRouter()

const analytics = ref({
  weeklyInquiries: 0,
  monthlyInquiries: 0,
  pendingInquiries: 0,
  commonTopics: []
})

const recentInquiries = ref([])

const tableHeaders = {
  head: ['Date', 'Doctor', 'Subject', 'Status', 'Actions'],
  row: ['date', 'doctorName', 'subject', 'status']
}

function respondToInquiry(inquiryId) {
  router.push(`/doctor-comm/respond/${inquiryId}`)
}

function goToFullHistory() {
  router.push('/doctor-comm/history')
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
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Recent Inquiries</h1>
      <p class="text-gray-600">Latest doctor requests and communications</p>
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
        <Table :rows="recentInquiries" :headers="tableHeaders">
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
  </div>
</template>














