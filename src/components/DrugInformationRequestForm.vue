<script setup>
import { ref, reactive, computed } from 'vue';
import Button from '@/components/Button.vue';
import { openModal } from '@customizer/modal-x';
import { submitDrugInformationRequest } from '@/features/service/api/drugInformationApi';
import { submitAcademicRequest } from '@/service/acadamicApi';
import { useApiRequest } from '@/composables/useApiRequest';
import { useAuthStore } from '@/stores/auth';
import { toasted } from '@/utils/utils';
import FormConfirmation from '@/components/FormConfirmation.mdl.vue';

const authStore = useAuthStore();
console.log('Auth store:', authStore);
console.log('Auth data:', authStore.auth);

// Add a computed property to get userUuid
const currentUserUuid = computed(() => {
  return authStore.auth?.user?.userUuid || 
         authStore.auth?.userUuid || 
         authStore.user?.userUuid || 
         '';
});

console.log('Current user UUID:', currentUserUuid.value);

const submitReq = useApiRequest();
const id = authStore.auth.userUuid;
console.log(authStore.auth.userUuid);

const formData = reactive({
  requestType: '',
  patientInfo: {
    patientAge: 0,                    // Changed from 'age'
    patientGender: '',                // Changed from 'sex' 
    weight: 0.1,                      
    diagnosis: '',
    currentMedication: '',
    concurrentMedication: '',         // Changed from 'concurrentMedications'
    allergies: '',             
    otherInformation: ''              // Changed from 'otherInfo'
  },
  description: '',                    // Changed from 'requestQuestion'
  responseUrgency: '',                // Changed from 'preferredResponse'
  patientType: 'PATIENT_SPECIFIC'     // Added new field
});



const showConfirmation = ref(false);

function resetForm() {
  formData.requestType = '';
  
  // Mutate each property inside patientInfo individually
  formData.patientInfo.patientAge = 0;
  formData.patientInfo.patientGender = '';
  formData.patientInfo.weight = 0.1;
  formData.patientInfo.diagnosis = '';
  formData.patientInfo.currentMedication = '';
  formData.patientInfo.concurrentMedication = '';
  formData.patientInfo.allergies = '';
  formData.patientInfo.otherInformation = '';

  formData.description = '';
  formData.responseUrgency = '';
  formData.patientType = 'PATIENT_SPECIFIC';
}
const emit = defineEmits(['submit', 'back', 'showConfirmation']);

function validateForm() {
  const errors = [];

  // Validate request type
  if (!formData.requestType) {
    errors.push('Please select a request type');
  }

  // Validate patient info if patient specific is selected
  if (formData.requestType === 'patientSpecific') {
    if (!formData.patientInfo.patientAge || formData.patientInfo.patientAge <= 0) {
      errors.push('Age is required for patient specific requests');
    }
    if (!formData.patientInfo.patientGender) {
      errors.push('Gender is required for patient specific requests');
    }
    if (!formData.patientInfo.weight || formData.patientInfo.weight < 0.1) {
      errors.push('Weight is required for patient specific requests');
    }
    if (!formData.patientInfo.diagnosis.trim()) {
      errors.push('Diagnosis is required for patient specific requests');
    }
  }

  // Validate required fields
  if (!formData.description.trim()) {
    errors.push('Description field is required');
  }

  if (!formData.responseUrgency) {
    errors.push('Please select response urgency');
  }

  return errors;
}

import { cloneDeep } from 'lodash'; // npm install lodash if needed

function handleSubmit() {
  const errors = validateForm();
  if (errors.length > 0) {
    alert('Please fix errors:\n' + errors.join('\n'));
    return;
  }

  // Pass a clone of formData to avoid reference issues
  showConfirmation.value = true;
  emit('showConfirmation', cloneDeep(formData));
}

const auth=useAuthStore()

function confirmSubmission() {
  showConfirmation.value = false;
  // Get the correct userUuid from auth store
  const userUuid = auth.auth?.user?.userUuid || auth.auth?.userUuid || '';
  
  console.log('Auth object:', auth.auth);
  console.log('User UUID:', userUuid);
  
  if (!userUuid) {
    alert('User not authenticated. Please login again.');
    return;
  }
 const handleAfterSubmit = () => {
    resetForm();                // clear the form
    showConfirmation.value = false;  // close modal
    goBack();                   // navigate back like Cancel button
  };

if (formData.requestType === 'academic') {
  const academicPayload = {
    description: formData.description,
    questionStatus: "UNANSWERED",
    responseUrgency: formData.responseUrgency  // 👈 Swagger calls it responseDueDate
  };

  submitAcademicRequest(userUuid, academicPayload)
    .then((response) => {
      console.log("Academic API raw response:", response);

      if (response.data?.message === "question has been created") {
        toasted.success("Academic request created!");
        handleAfterSubmit();
        emit('submit', response.data);  // pass backend response up
      } else {
        toasted.error("Unexpected response: " + JSON.stringify(response.data));
      }
    })
    .catch((error) => {
      console.error("Academic API error:", error);
      toasted.error("Error submitting academic request: " + error.message);
    });

  return;
}


  const submissionData = {
    description: formData.description,
    questionStatus: "UNANSWERED",
    patientAge: Number(formData.patientInfo.patientAge) || 0,
    patientType: formData.patientType,
    patientGender: formData.patientInfo.patientGender === 'male' ? 'Male' : 
                   formData.patientInfo.patientGender === 'female' ? 'Female' : 
                   formData.patientInfo.patientGender, // Capitalize first letter
    weight: Number(formData.patientInfo.weight) || 0,
    diagnosis: formData.patientInfo.diagnosis || "",
    currentMedication: formData.patientInfo.currentMedication || "",
    concurrentMedication: formData.patientInfo.concurrentMedication || "",
    allergies: formData.patientInfo.allergies || "",
    otherInformation: formData.patientInfo.otherInformation || "",
    responseUrgency: formData.responseUrgency,
    userUuid: userUuid
  };
  
  console.log('Submitting data to API:', submissionData);
  
  submitDrugInformationRequest(submissionData)
    .then((response) => {
      if (response.success) {
        console.log('Question submitted successfully');
        resetForm();
        showConfirmation.value = false;
        emit('submit', response.data);
      } else {
        console.error('Submission failed:', response.error);
        alert('Failed to submit question: ' + response.error);
      }
    })
    .catch((error) => {
      console.error('Submission error:', error);
      alert('Error submitting question: ' + error.message);
    });
}

function cancelSubmission() {
  showConfirmation.value = false;
}

function getRequestTypes() {
  switch(formData.requestType) {
    case 'patientSpecific':
      return 'Patient Specific';
    case 'academic':
      return 'Academic';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

function goBack() {
  emit('back');
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header with Back Button -->
    <div class="flex-shrink-0 p-4 bg-white border-b border-gray-200">
      <div class="flex items-center gap-3">
        <button 
          @click="goBack"
          class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-sm font-medium">Back</span>
        </button>
        <!--<div class="h-4 w-px bg-gray-300"></div>
        <h1 class="text-lg font-semibold text-gray-900">Drug Information Request</h1>-->
      </div>
    </div>

    <!-- Scrollable Form Content -->
    <div class="flex-1 overflow-y-auto bg-white custom-scrollbar">
      <div class="p-4">
        <!-- Responsive Table Container -->
        <div class="min-w-full">
          <table class="w-full min-w-800px border-collapse border border-gray-400">
            <!-- Header Row -->
            <tr>
              <td colspan="2" class="border border-gray-400 p-4 text-center" style="background-color: #ADD8E6;">
                <h2 class="text-xl font-bold text-white">Background Information on Query:</h2>
              </td>
            </tr>

            <!-- Request Type Row -->
            <tr>
              <td class="border border-gray-400 p-4 w-[30%] align-top min-w-[200px]" style="background-color: #c5e1eb;">
                <span class="text-sm font-medium text-gray-700">The request is:</span>
              </td>
              <td class="border border-gray-400 p-4 w-[70%] min-w-[400px]">
                <div class="flex flex-wrap gap-4 sm:gap-6">
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.requestType"
                      value="patientSpecific"
                      class="mr-2"
                    />
                    <span class="text-sm">Patient specific</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.requestType"
                      value="academic"
                      class="mr-2"
                    />
                    <span class="text-sm">Academic</span>
                  </label>
                  <!-- <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.requestType"
                      value="other"
                      class="mr-2"
                    />
                    <span class="text-sm">Other</span>
                  </label> -->
                </div>
              </td>
            </tr>

            <!-- Patient Information Row -->
            <tr v-if="formData.requestType === 'patientSpecific'">
              <td class="border border-gray-400 p-4 align-top min-w-[200px]" style="background-color: #c5e1eb;">
                <span class="text-sm text-gray-700">
                  If Patient specific, Please record patient information that you feel may be helpful in 
                  answering your request (such as patient's age, sex, weight; disease states, laboratory 
                  values, medications, allergies etc...).
                </span>
              </td>
              <td class="border border-gray-400 p-4 min-w-[400px]">
                <div class="space-y-4">
                  <!-- Responsive Grid for Patient Info -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Age:</label>
                      <input 
                        type="number" 
                        v-model.number="formData.patientInfo.patientAge"
                        min="0"
                        max="150"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
                      <select 
                        v-model="formData.patientInfo.patientGender"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Wt (kgs):</label>
                      <input 
                        type="number" 
                        v-model.number="formData.patientInfo.weight"
                        min="0.1"
                        step="0.1"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Weight in kg"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Diagnosis:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.diagnosis"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Enter diagnosis"
                      />
                    </div>
                  </div>

                  <!-- Full Width Fields -->
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Current Medication:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.currentMedication"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="List current medications"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Concurrent medication/s:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.concurrentMedication"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="List concurrent medications"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Allergies:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.allergies"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="List known allergies"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Other Information:</label>
                      <textarea 
                        v-model="formData.patientInfo.otherInformation"
                        rows="3"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
                        placeholder="Any other relevant patient information"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Request/Question Row -->
            <tr>
              <td class="border border-gray-400 p-4 align-top min-w-[200px]" style="background-color: #c5e1eb;">
                <span class="text-sm font-medium text-gray-700">
                  Request/Question: <br>
                  <span class="text-xs text-gray-500">(use free text space)</span>
                </span>
              </td>
              <td class="border border-gray-400 p-4 min-w-[400px]">
                <textarea 
                  v-model="formData.description"
                  rows="6"
                  placeholder="Please describe your drug information request or question in detail..."
                  class="w-full h-32 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  required
                ></textarea>
              </td>
            </tr>

            <!-- Response Time Row -->
            <tr>
              <td class="border border-gray-400 p-4 align-top min-w-[200px]" style="background-color: #c5e1eb;">
                <span class="text-sm font-medium text-gray-700">Response needed in:</span>
              </td>
              <td class="border border-gray-400 p-4 min-w-[400px]">
                <div class="flex flex-wrap gap-4 sm:gap-6">
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.responseUrgency" 
                      value="prompt"
                      class="mr-2"
                    />
                    <span class="text-sm">Prompt</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.responseUrgency" 
                      value="30-60-min"
                      class="mr-2"
                    />
                    <span class="text-sm">30-60 min</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.responseUrgency" 
                      value="end-of-day"
                      class="mr-2"
                    />
                    <span class="text-sm">End of day</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.responseUrgency" 
                      value="when-time-permits"
                      class="mr-2"
                    />
                    <span class="text-sm">When time permits</span>
                  </label>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Fixed Submit Button - Make it responsive -->
    <div class="flex-shrink-0 p-4 bg-white border-t border-gray-200">
      <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button 
          @click="goBack"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium transition-colors order-2 sm:order-1"
        >
          Cancel
        </button>
        
        <button 
          @click="handleSubmit"
          class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 sm:py-2 rounded text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl order-1 sm:order-2 w-full sm:w-auto"
          type="button"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Submit Request
          </span>
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <FormConfirmation 
      v-if="showConfirmation"
      :data="formData"
      @confirm="confirmSubmission"
      @cancel="cancelSubmission"
    />
  </div>
</template>

<style scoped>
/* Force scrollbar to always show */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Force scrollbar visibility */
.custom-scrollbar::-webkit-scrollbar-corner {
  background: #f1f1f1;
}

/* Ensure inputs are properly sized */
input, select, textarea {
  max-width: 100%;
  box-sizing: border-box;
}

/* Responsive adjustments for small screens */
@media (max-width: 640px) {
  .min-w-800px {
    min-width: 600px;
  }
}
</style>





