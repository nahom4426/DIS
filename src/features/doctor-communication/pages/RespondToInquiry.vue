<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApiRequest } from '@/composables/useApiRequest'
import { getInquiryById, getAnswersByQuestionId, createAnswer, getAllInquiries } from '../api/inquiryApi'
import Button from '@/components/Button.vue'
import icons from '@/utils/icons'
import { useToast } from '@/toast/store/toast' // or your toast library

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const inquiryId = route.params.id
const inquiry = ref(null)
const chatHistory = ref([])
const response = ref('')
const attachedFiles = ref([])
const fileInput = ref(null)
const isLoading = ref(false)

const inquiryReq = useApiRequest()
const answersReq = useApiRequest()

// Load inquiry data from backend
async function loadInquiryData() {
  console.log('Loading inquiry with ID:', inquiryId)
    // Get userUuid from auth store
  const userUuid = authStore.auth?.userUuid || authStore.auth?.user?.userUuid
  
  inquiryReq.send(
    () => getAllInquiries(userUuid),
    (response) => {
      if (response.success && response.data) {
        // Find the specific inquiry by questionUuid
        const foundInquiry = response.data.find(item => item.questionUuid === inquiryId)
        
        if (foundInquiry) {
          console.log('Found inquiry:', foundInquiry)
          
          // Use the same data structure as InquiryHistory
          inquiry.value = {
            id: foundInquiry.questionUuid,
            questionUuid: foundInquiry.questionUuid,
            doctorName: foundInquiry.firstName || 'Unknown Doctor',
            doctorEmail: foundInquiry.email || '',
            doctorPhone: foundInquiry.phone || '',
            requestDate: foundInquiry.createdAt,
            questionDescription: foundInquiry.description || 'No description provided',
            doctorAvatar: '/api/placeholder/64/64',
            patientAge: foundInquiry.patientAge,
            patientGender: foundInquiry.patientGender,
            weight: foundInquiry.weight,
            diagnosis: foundInquiry.diagnosis,
            currentMedication: foundInquiry.currentMedication,
            responseUrgency: foundInquiry.responseUrgency || 'Normal',
            questionStatus: foundInquiry.questionStatus?.toLowerCase() || 'unanswered',
            hasAnswer: !!foundInquiry.answer,
            answer: foundInquiry.answer
          }
          
          console.log('Processed inquiry:', inquiry.value)
          
          // Create chat history with the question
          chatHistory.value = [
            {
              id: 'doctor-question',
              sender: 'doctor',
              message: foundInquiry.description || 'No description provided',
              timestamp: foundInquiry.createdAt,
              senderName: foundInquiry.firstName || 'Doctor'
            }
          ]
          
          // If there's already an answer, add it to chat
          if (foundInquiry.answer) {
            chatHistory.value.push({
              id: 'pharmacist-answer',
              sender: 'pharmacist',
              message: foundInquiry.answer.answerDescription || foundInquiry.answer.description || '',
              timestamp: foundInquiry.answer.createdAt || foundInquiry.answer.answerDate,
              senderName: 'You'
            })
          }
          
          console.log('Chat history created:', chatHistory.value)
        } else {
          console.error('Inquiry not found with ID:', inquiryId)
          alert('Inquiry not found')
        }
      } else {
        console.error('Failed to load inquiries:', response.error)
        alert('Failed to load inquiry details')
      }
    }
  )
}

function loadAnswers() {
  answersReq.send(
    () => getAnswersByQuestionId(inquiryId),
    (res) => {
      if (res.success && res.data && Array.isArray(res.data)) {
        // Add existing answers to chat history
        const answers = res.data.map((answer, index) => ({
          id: answer.answerUuid || `answer-${index}`,
          sender: 'pharmacist',
          message: answer.answerDescription || answer.description || '',
          attachments: answer.answerDetailFile ? [{
            name: answer.answerDetailFile.split('/').pop() || 'attachment',
            size: 0,
            type: 'application/octet-stream'
          }] : [],
          timestamp: answer.createdAt || answer.answerDate || new Date().toISOString()
        }))
        
        // Add answers to chat history (after the doctor's question)
        chatHistory.value = [...chatHistory.value, ...answers]
      }
    }
  )
}

function goBack() {
  router.push('/doctor-comm/history')
}

onMounted(() => {
  loadInquiryData()
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const files = Array.from(event.target.files)
  attachedFiles.value = files
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

async function submitResponse() {
  if (!response.value.trim()) {
    alert('Please enter a response message')
    return
  }
  
  isLoading.value = true
  try {
    const answerData = {
      answerDescription: response.value,
      userUuid: authStore.auth?.user?.userUuid || authStore.auth?.userUuid,
      questionUuid: inquiry.value.questionUuid || inquiryId,
      answerDetailFile: attachedFiles.value[0] || null
    }
    
    console.log('Submitting answer to /answers/create:', answerData)
    
    const result = await createAnswer(answerData)
    
    if (result.success) {
      // Add the new response to chat history with attachments
      chatHistory.value.push({
        id: Date.now(),
        sender: 'pharmacist',
        message: response.value,
        attachments: attachedFiles.value.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file) // <-- Add this line
        })),
        timestamp: new Date().toISOString(),
        senderName: 'You'
      })
      
      response.value = ''
      attachedFiles.value = []
      
      toast.success('Response submitted successfully!')
      // or
      alert('Response submitted successfully!')
    } else {
      throw new Error(result.error || 'Failed to submit response')
    }
  } catch (error) {
    console.error('Error submitting response:', error)
    toast.error('Failed to submit response: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

function downloadAttachment(attachment) {
  if (attachment.url) {
    // For local files (newly uploaded), download them
    if (attachment.url.startsWith('blob:')) {
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // For server files, open with system default app
      openFileWithSystemApp(attachment.url, attachment.name)
    }
  }
}

async function openFileWithSystemApp(fileUrl, fileName) {
  try {
    // Try to use the open package if available (for Electron apps)
    if (window.require) {
      const { shell } = window.require('electron')
      await shell.openPath(fileUrl)
      return
    }
    
    // For web browsers, we need to download first then open
    // Create a temporary download
    const response = await fetch(fileUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    
    // Create a temporary link to download the file
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
    
    // Show message to user
    alert(`File "${fileName}" has been downloaded. Please open it from your Downloads folder.`)
    
  } catch (error) {
    console.error('Error opening file:', error)
    alert('Unable to open file. Please download it manually.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="inquiryReq.pending.value" class="flex justify-center items-center h-64">
      <div class="text-lg text-gray-600">Loading inquiry details...</div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="inquiryReq.error.value" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="text-red-800">
        <h3 class="font-medium">Error loading inquiry</h3>
        <p class="text-sm mt-1">{{ inquiryReq.error.value }}</p>
      </div>
    </div>
    
    <!-- Main content -->
    <div v-else-if="inquiry" class="space-y-6">
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
        <!-- Doctor Info Card -->
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
              <span>{{ new Date(inquiry.requestDate).toLocaleDateString() }}</span>
            </div>
            <div v-if="inquiry.responseUrgency" class="flex justify-between text-sm">
              <span class="text-gray-500">Urgency:</span>
              <span :class="{
                'text-red-600': inquiry.responseUrgency === 'High',
                'text-yellow-600': inquiry.responseUrgency === 'Medium',
                'text-green-600': inquiry.responseUrgency === 'Low' || inquiry.responseUrgency === 'Normal'
              }">{{ inquiry.responseUrgency }}</span>
            </div>
          </div>

          <!-- Patient Information -->
          <div v-if="inquiry.patientAge || inquiry.patientGender" class="mt-6 pt-4 border-t">
            <h4 class="font-medium text-gray-900 mb-2">Patient Info</h4>
            <div class="space-y-1 text-sm">
              <div v-if="inquiry.patientAge" class="flex justify-between">
                <span class="text-gray-500">Age:</span>
                <span>{{ inquiry.patientAge }}</span>
              </div>
              <div v-if="inquiry.patientGender" class="flex justify-between">
                <span class="text-gray-500">Gender:</span>
                <span>{{ inquiry.patientGender }}</span>
              </div>
              <div v-if="inquiry.weight" class="flex justify-between">
                <span class="text-gray-500">Weight:</span>
                <span>{{ inquiry.weight }}</span>
              </div>
            </div>
          </div>

          <!-- Medical Information -->
          <div v-if="inquiry.diagnosis || inquiry.currentMedication" class="mt-4 pt-4 border-t">
            <h4 class="font-medium text-gray-900 mb-2">Medical Info</h4>
            <div class="space-y-2 text-sm">
              <div v-if="inquiry.diagnosis">
                <span class="text-gray-500">Diagnosis:</span>
                <p class="text-gray-900 mt-1">{{ inquiry.diagnosis }}</p>
              </div>
              <div v-if="inquiry.currentMedication">
                <span class="text-gray-500">Current Medication:</span>
                <p class="text-gray-900 mt-1">{{ inquiry.currentMedication }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversation Panel -->
        <div class="xl:col-span-3 bg-white rounded-lg shadow flex flex-col h-[600px]">
          <div class="p-6 border-b">
            <h3 class="text-lg font-semibold">Conversation</h3>
            <p class="text-sm text-gray-600 mt-1">Question from {{ inquiry.doctorName }}</p>
          </div>

          <div class="flex-1 p-6 overflow-y-auto space-y-4">
            
            <!-- Loading state -->
            <div v-if="inquiryReq.pending.value" class="text-center text-gray-500 py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Loading conversation...
            </div>
            
            <!-- Error state -->
            <div v-else-if="inquiryReq.error.value" class="text-center text-red-500 py-8">
              Error loading conversation: {{ inquiryReq.error.value }}
            </div>
            
            <!-- Messages -->
            <div v-else class="space-y-4">
              <div v-if="chatHistory.length === 0" class="text-center text-gray-500 py-8">
                No messages found - Check console for API response
              </div>
              
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
                    'max-w-lg px-4 py-3 rounded-lg shadow-sm',
                    message.sender === 'doctor' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-blue-500 text-white'
                  ]"
                  style="word-wrap: break-word; overflow-wrap: break-word; max-width: 70%;"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-medium opacity-75">
                      {{ message.sender === 'doctor' ? inquiry?.doctorName || 'Doctor' : 'You' }}
                    </span>
                    <span class="text-xs opacity-50">
                      {{ new Date(message.timestamp).toLocaleString() }}
                    </span>
                  </div>
                  
                  <!-- Message text with proper wrapping -->
                  <div 
                    class="text-sm leading-relaxed" 
                    style="white-space: pre-wrap; word-break: break-word; hyphens: auto;"
                  >
                    {{ message.message }}
                  </div>
                  
                  <!-- Display attachments if any -->
                  <div v-if="message.attachments && message.attachments.length > 0" class="mt-3 space-y-2">
                    <div class="text-xs opacity-75 font-medium border-t pt-2">
                      📎 Attachments:
                    </div>
                    <div 
                      v-for="(attachment, index) in message.attachments" 
                      :key="index"
                      class="flex items-center justify-between p-2 rounded border cursor-pointer hover:bg-opacity-80"
                      :class="message.sender === 'doctor' ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-blue-400 border-blue-300 hover:bg-blue-300'"
                      @click="downloadAttachment(attachment)"
                      :title="`Click to open ${attachment.name} with system default app`"
                    >
                      <div class="flex items-center space-x-2 flex-1 min-w-0">
                        <i v-html="getFileIcon(attachment.type)" class="w-4 h-4 flex-shrink-0"></i>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-medium truncate" :title="attachment.name">
                            {{ attachment.name }}
                          </p>
                          <p class="text-xs opacity-75">
                            {{ formatFileSize(attachment.size) }} • Click to open
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-1 flex-shrink-0">
                        <span class="text-xs opacity-75">📂</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Response Form -->
          <div class="border-t bg-gray-50 p-6">
            <h3 class="text-lg font-semibold mb-4">
              {{ inquiry?.hasAnswer ? 'View Response' : 'Your Response' }}
            </h3>
            
            <div class="space-y-4">
              <div v-if="!inquiry?.hasAnswer">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Response Message *
                </label>
                <textarea
                  v-model="response"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your detailed response to this inquiry..."
                  required
                ></textarea>
              </div>

              <!-- File Attachment Section -->
              <div v-if="!inquiry?.hasAnswer" class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">
                  Attach Files (Optional)
                </label>
                
                <!-- File Upload Button -->
                <div class="flex items-center gap-3">
                  <button
                    @click="triggerFileInput"
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <i v-html="icons.attachment || icons.file" class="w-4 h-4 mr-2"></i>
                    Attach File
                  </button>
                  <span class="text-xs text-gray-500">
                    Supported: PDF, DOC, DOCX, TXT, Images
                  </span>
                </div>

                <!-- Hidden File Input -->
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  class="hidden"
                  @change="handleFileUpload"
                />

                <!-- Attached Files List -->
                <div v-if="attachedFiles.length > 0" class="space-y-2">
                  <h4 class="text-sm font-medium text-gray-700">Attached Files:</h4>
                  <div class="space-y-2">
                    <div
                      v-for="(file, index) in attachedFiles"
                      :key="index"
                      class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
                    >
                      <div class="flex items-center space-x-3">
                        <i v-html="getFileIcon(file.type)" class="w-5 h-5 text-gray-400"></i>
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                          <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                        </div>
                      </div>
                      <button
                        @click="removeFile(index)"
                        class="text-red-500 hover:text-red-700 p-1"
                        title="Remove file"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <Button
                  @click="goBack"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  :disabled="isLoading"
                >
                  Back
                </Button>
                <Button
                  v-if="!inquiry?.hasAnswer"
                  @click="submitResponse"
                  type="primary"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  :disabled="isLoading || !response.trim()"
                  :pending="isLoading"
                >
                  {{ isLoading ? 'Submitting...' : 'Submit Response' }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>





















