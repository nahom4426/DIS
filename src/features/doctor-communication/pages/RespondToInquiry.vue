<script setup>
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
const attachedFiles = ref([])
const fileInput = ref(null)

async function sendResponse() {
  if (!response.value.trim()) return
  
  isLoading.value = true
  try {
    // Create FormData for file uploads
    const formData = new FormData()
    formData.append('message', response.value)
    formData.append('inquiryId', inquiryData.value.id)
    
    // Append files
    attachedFiles.value.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file)
    })
    
    // Add to chat history with attachments
    chatHistory.value.push({
      id: Date.now(),
      sender: 'pharmacist',
      message: response.value,
      attachments: attachedFiles.value.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      })),
      timestamp: new Date().toISOString()
    })
    
    // Clear response and attachments
    response.value = ''
    attachedFiles.value = []
    
    // Here you would make an API call to send the response with attachments
    console.log('Sending response with attachments:', formData)
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

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
      return
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      alert(`File type "${file.type}" is not allowed.`)
      return
    }
    
    // Add to attached files
    attachedFiles.value.push(file)
  })
  
  // Clear the input
  event.target.value = ''
}

function removeFile(index) {
  attachedFiles.value.splice(index, 1)
}

function getFileIcon(fileType) {
  if (fileType.includes('pdf')) return icons.pdf || icons.file
  if (fileType.includes('word') || fileType.includes('document')) return icons.document || icons.file
  if (fileType.includes('text')) return icons.text || icons.file
  if (fileType.includes('image')) return icons.image || icons.file
  return icons.file
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
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
              
              <!-- Show attachments if any -->
              <div v-if="message.attachments && message.attachments.length > 0" class="mt-2 space-y-1">
                <div 
                  v-for="attachment in message.attachments"
                  :key="attachment.name"
                  :class="[
                    'flex items-center gap-2 p-2 rounded text-xs',
                    message.sender === 'doctor' 
                      ? 'bg-white text-gray-700' 
                      : 'bg-blue-400 text-white'
                  ]"
                >
                  <i v-html="getFileIcon(attachment.type)" class="flex-shrink-0"></i>
                  <span class="truncate">{{ attachment.name }}</span>
                  <span class="text-xs opacity-70">({{ formatFileSize(attachment.size) }})</span>
                </div>
              </div>
              
              <p class="text-xs mt-1 opacity-70">
                {{ new Date(message.timestamp).toLocaleTimeString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Response Input - Fixed at bottom -->
        <div class="p-6 border-t">
          <div class="space-y-3">
            <!-- Textarea -->
            <textarea
              v-model="response"
              placeholder="Type your response..."
              class="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            ></textarea>
            
            <!-- File Attachment Section -->
            <div class="flex items-center justify-between">
              <!-- File Attachment Controls -->
              <div class="flex items-center gap-3">
                <!-- File Upload Button -->
                <button
                  @click="triggerFileInput"
                  type="button"
                  class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Attach file"
                >
                  <i v-html="icons.paperclip || icons.file" class="text-base"></i>
                  <span>Attach File</span>
                </button>
                
                <!-- Hidden File Input -->
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  class="hidden"
                  @change="handleFileUpload"
                />
                
                <!-- File Count Indicator -->
                <span v-if="attachedFiles.length > 0" class="text-xs text-gray-500">
                  {{ attachedFiles.length }} file{{ attachedFiles.length > 1 ? 's' : '' }} attached
                </span>
              </div>
              
              <!-- Send Button -->
              <Button 
                @click="sendResponse"
                :disabled="!response.trim() || isLoading"
                type="primary"
                class="px-6"
              >
                <i v-html="icons.send"></i>
                Send
              </Button>
            </div>
            
            <!-- Attached Files Preview -->
            <div v-if="attachedFiles.length > 0" class="space-y-2">
              <div class="text-xs font-medium text-gray-700 mb-2">Attached Files:</div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(file, index) in attachedFiles"
                  :key="index"
                  class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <!-- File Icon -->
                  <i 
                    v-html="getFileIcon(file.type)" 
                    class="text-gray-500 flex-shrink-0"
                  ></i>
                  
                  <!-- File Name -->
                  <span class="text-gray-700 truncate max-w-32" :title="file.name">
                    {{ file.name }}
                  </span>
                  
                  <!-- File Size -->
                  <span class="text-xs text-gray-500">
                    ({{ formatFileSize(file.size) }})
                  </span>
                  
                  <!-- Remove Button -->
                  <button
                    @click="removeFile(index)"
                    class="text-red-500 hover:text-red-700 ml-1"
                    title="Remove file"
                  >
                    <i v-html="icons.close || icons.x" class="text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




