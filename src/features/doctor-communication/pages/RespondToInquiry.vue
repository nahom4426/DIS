ull<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'

const route = useRoute()
const router = useRouter()
const inquiryId = route.params.id

const inquiry = ref(null)
const response = ref('')
const chatHistory = ref([])
const isLoading = ref(false)

async function sendResponse() {
  if (!response.value.trim()) return
  
  isLoading.value = true
  try {
    // Add to chat history
    chatHistory.value.push({
      id: Date.now(),
      sender: 'pharmacist',
      message: response.value,
      timestamp: new Date().toISOString()
    })
    
    // Clear response field
    response.value = ''
    
    // Here you would make an API call to send the response
    console.log('Sending response:', response.value)
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.go(-1)
}

onMounted(() => {
  // Mock data - replace with actual API call
  inquiry.value = {
    id: inquiryId,
    doctorName: 'Dr. John Smith',
    doctorEmail: 'john.smith@hospital.com',
    doctorPhone: '+1 (555) 123-4567',
    requestDate: '2024-01-15',
    requestDetail: 'I need information about drug interactions between Warfarin and Aspirin for a 65-year-old patient with atrial fibrillation.',
    doctorAvatar: '/api/placeholder/64/64'
  }
  
  chatHistory.value = [
    {
      id: 1,
      sender: 'doctor',
      message: 'I need information about drug interactions between Warfarin and Aspirin for a 65-year-old patient with atrial fibrillation.',
      timestamp: '2024-01-15T10:30:00Z'
    }
  ]
})
</script>

<template>
  <div class="space-y-6" v-if="inquiry">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button @click="goBack" class="text-blue-600 hover:text-blue-400 font-medium transition-colors duration-200">
        &lt; Back
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Respond to Inquiry</h1>
        <p class="text-gray-600">Inquiry #{{ inquiryId }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Doctor Profile -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="text-center">
          <img 
            :src="inquiry.doctorAvatar" 
            :alt="inquiry.doctorName"
            class="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <h3 class="text-lg font-semibold">{{ inquiry.doctorName }}</h3>
          <p class="text-gray-600 text-sm">{{ inquiry.doctorEmail }}</p>
          <p class="text-gray-600 text-sm">{{ inquiry.doctorPhone }}</p>
        </div>
        <div class="mt-6 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Request Date:</span>
            <span>{{ inquiry.requestDate }}</span>
          </div>
        </div>
      </div>

      <!-- Chat Interface - Takes up more space -->
      <div class="xl:col-span-3 bg-white rounded-lg shadow flex flex-col h-[600px]">
        <!-- Chat Header -->
        <div class="p-6 border-b">
          <h3 class="text-lg font-semibold">Conversation</h3>
        </div>

        <!-- Chat Messages - Scrollable area -->
        <div class="flex-1 p-6 overflow-y-auto space-y-4">
          <div 
            v-for="message in chatHistory" 
            :key="message.id"
            :class="[
              'flex',
              message.sender === 'doctor' ? 'justify-start' : 'justify-end'
            ]"
          >
            <div 
              :class="[
                'max-w-md px-4 py-3 rounded-lg',
                message.sender === 'doctor' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'bg-blue-500 text-white'
              ]"
            >
              <p class="text-sm">{{ message.message }}</p>
              <p class="text-xs mt-1 opacity-70">
                {{ new Date(message.timestamp).toLocaleTimeString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Response Input - Fixed at bottom -->
        <div class="p-6 border-t">
          <div class="flex gap-3">
            <textarea
              v-model="response"
              placeholder="Type your response..."
              class="flex-1 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            ></textarea>
            <Button 
              @click="sendResponse"
              :disabled="!response.trim() || isLoading"
              type="primary"
              class="self-end px-6"
            >
              <i v-html="icons.send"></i>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




