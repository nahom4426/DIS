<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApiRequest } from '@/composables/useApiRequest'
import { searchDrugs } from '../api/drugLookupApi'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'

const router = useRouter()
const apiReq = useApiRequest()

const searchQuery = ref('')
const drugs = ref([])
const selectedDrug = ref(null)
const isLoading = ref(false)

const tableHeaders = {
  head: ['Drug Name', 'Generic Name', 'Category', 'Dosage Form', 'Actions'],
  row: ['drugName', 'genericName', 'category', 'dosageForm']
}

const filteredDrugs = computed(() => {
  return drugs.value
})

// Debounced search function
let searchTimeout
function performSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      isLoading.value = true
      apiReq.send(
        () => searchDrugs({ search: searchQuery.value.trim() }),
        (response) => {
          isLoading.value = false
          if (response.success && Array.isArray(response.data)) {
            drugs.value = response.data
          } else {
            console.error('Search failed:', response.error)
            drugs.value = []
          }
        }
      )
    } else {
      drugs.value = []
    }
  }, 300) // 300ms debounce
}

function viewDrugDetails(drug) {
  selectedDrug.value = drug
}

function closeDrugDetails() {
  selectedDrug.value = null
}

onMounted(() => {
  // Load initial data or keep empty until search
})

</script>

<template>
  <!-- Search Bar -->
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="relative">
      <i v-html="icons.search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      <input
        v-model="searchQuery"
        @input="performSearch"
        type="text"
        placeholder="Search by drug name, generic name, or category..."
        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      </div>
    </div>
  </div>

  <!-- Drugs Table -->
  <div class="bg-white rounded-lg shadow">
    <div v-if="searchQuery && !isLoading && drugs.length === 0" class="p-8 text-center text-gray-500">
      No drugs found for "{{ searchQuery }}"
    </div>
    <div v-else-if="!searchQuery && drugs.length === 0" class="p-8 text-center text-gray-500">
      Enter a search term to find drugs
    </div>
    <Table v-else :rows="filteredDrugs" :headers="tableHeaders" :pending="isLoading">
      <template #actions="{ row }">
        <button 
          @click="viewDrugDetails(row)"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </button>
      </template>
    </Table>
  </div>
</template>


