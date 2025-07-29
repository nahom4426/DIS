<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'
import Table from '@/components/Table.vue'

const router = useRouter()


const searchQuery = ref('')
const drugs = ref([])
const selectedDrug = ref(null)

const tableHeaders = {
  head: ['Drug Name', 'Generic Name', 'Category', 'Dosage Form', 'Actions'],
  row: ['drugName', 'genericName', 'category', 'dosageForm']
}

const filteredDrugs = computed(() => {
  if (!searchQuery.value) return drugs.value
  
  return drugs.value.filter(drug => 
    drug.drugName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function viewDrugDetails(drug) {
  selectedDrug.value = drug
}

function closeDrugDetails() {
  selectedDrug.value = null
}

onMounted(() => {
  // Mock data - replace with actual API calls
  drugs.value = [
    {
      id: 1,
      drugName: 'Aspirin',
      genericName: 'Acetylsalicylic acid',
      category: 'Analgesic',
      dosageForm: 'Tablet',
      strength: '325mg',
      indications: 'Pain relief, fever reduction, cardiovascular protection',
      contraindications: 'Bleeding disorders, severe liver disease',
      sideEffects: 'Stomach upset, bleeding, allergic reactions',
      interactions: 'Warfarin, Methotrexate, ACE inhibitors'
    },
    // Add more mock data
  ]
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header  -->
     <div>
        <h1 class="text-2xl font-bold text-gray-900">Drug Lookup Tool</h1>
        <p class="text-gray-600">Search comprehensive drug information</p>
      </div>
  

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="relative">
        <i v-html="icons.search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by drug name, generic name, or category..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Drugs Table -->
    <div class="bg-white rounded-lg shadow">
      <Table :rows="filteredDrugs" :headers="tableHeaders">
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

    <!-- Drug Details Modal -->
    <div v-if="selectedDrug" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold">{{ selectedDrug.drugName }}</h2>
            <button @click="closeDrugDetails" class="text-gray-400 hover:text-gray-600">
              <i v-html="icons.close"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-700">Generic Name</h3>
              <p>{{ selectedDrug.genericName }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-700">Category</h3>
              <p>{{ selectedDrug.category }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-700">Strength</h3>
              <p>{{ selectedDrug.strength }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-700">Indications</h3>
              <p>{{ selectedDrug.indications }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-700">Contraindications</h3>
              <p>{{ selectedDrug.contraindications }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-700">Side Effects</h3>
              <p>{{ selectedDrug.sideEffects }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-700">Drug Interactions</h3>
              <p>{{ selectedDrug.interactions }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>





