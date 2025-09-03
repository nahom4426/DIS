<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">📊 Dashboard Overview</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <span class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
    </div>

    <div v-else>
      <!-- Dashboard Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div v-for="card in cards" :key="card.title"
          class="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 flex items-center space-x-6">
          
          <div :class="['p-4 rounded-xl text-white', card.color]">
            <component :is="card.icon" class="w-8 h-8"/>
          </div>

          <div>
            <h2 class="text-xl font-semibold text-gray-700">{{ card.title }}</h2>
            <p class="text-3xl font-bold text-gray-900">{{ card.value }}</p>
            <p class="text-sm text-gray-500">{{ card.subtitle }}</p>
          </div>
        </div>
      </div>

      <!-- Bar Chart -->
      <div class="bg-white p-6 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-semibold text-gray-700 mb-6">📈 Questions Overview</h2>
        <BarChartComponent :chart-data="chartData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { getGeneralReport} from "@/features/Dashboard/api/reportApi"
import { Users, Pill, HelpCircle, Calendar, UserCheck, Clock } from "lucide-vue-next"
import BarChartComponent from "@/components/charts/LineChart.vue"

const loading = ref(true)
const stats = ref({
  drugs: 0,
  weeklyQuestions: 0,
  dailyQuestions: 0,
  providers: 0,
  users: 0,
  monthlyQuestions: 0
})

onMounted(async () => {
  try {
    const res = await getGeneralReport()
    stats.value = res.data
  } catch (e) {
    console.error("Error fetching dashboard:", e)
  } finally {
    loading.value = false
  }
})

const cards = computed(() => [
  { title: "Drugs", value: stats.value.drugs, subtitle: "Total registered", icon: Pill, color: "bg-indigo-500" },
  { title: "Providers", value: stats.value.providers, subtitle: "Active providers", icon: UserCheck, color: "bg-green-500" },
  { title: "Users", value: stats.value.users, subtitle: "Total users", icon: Users, color: "bg-pink-500" },
  { title: "Daily Questions", value: stats.value.dailyQuestions, subtitle: "Asked today", icon: Clock, color: "bg-blue-500" },
  { title: "Weekly Questions", value: stats.value.weeklyQuestions, subtitle: "This week", icon: HelpCircle, color: "bg-yellow-500" },
  { title: "Monthly Questions", value: stats.value.monthlyQuestions, subtitle: "This month", icon: Calendar, color: "bg-red-500" }
])

const chartData = computed(() => ({
  labels: ["Daily", "Weekly", "Monthly"],
  datasets: [
    {
      label: "Questions",
      backgroundColor: ["#3b82f6", "#facc15", "#ef4444"],
      data: [
        stats.value.dailyQuestions,
        stats.value.weeklyQuestions,
        stats.value.monthlyQuestions
      ]
    }
  ]
}))
</script>
