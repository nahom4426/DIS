<script setup>
import icons from "@/utils/icons";
import { ref, computed } from "vue";
import Cards from "../components/Cards.vue";
import Button from "@/components/Button.vue";
import ChartCard from "@/components/charts/ChartCard.vue";
import { onMounted } from "vue";
import { useChartData } from "@/composables/useChartData";
import BarChart from "@/components/charts/BarChart.vue";
import LoopChart from "@/components/charts/LoopChart.vue";
import LineChart from "@/components/charts/LineChart.vue";
import DoughnutChart from "@/components/charts/DoughnutChart.vue";
import Table from "@/components/Table.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// Enhanced dashboard data
const data = ref([
  {
    title: "Total Drugs",
    Image: icons.policy2,
    amount: "2,847",
    today: icons.policy2,
    percent: "18.2%",
    customClass: "bg-[#F3E8FF]",
  },
  {
    title: "Active Providers",
    Image: icons.product_sold,
    amount: "156",
    today: icons.product_sold,
    percent: "12.5%",
    customClass: "bg-[#D2FFDA]",
  },
  {
    title: "Total Services",
    Image: icons.no_emolpoyee,
    amount: "1,420",
    today: icons.no_emolpoyee,
    percent: "8.7%",
    customClass: "bg-[#FFE2E5]",
  },
  {
    title: "Drug Requests Today",
    Image: icons.new_customer,
    amount: "89",
    today: icons.new_customer,
    percent: "24.1%",
    customClass: "bg-[#FFF4E6]",
  },
  {
    title: "System Users",
    Image: icons.no_emolpoyee,
    amount: "3,250",
    today: icons.no_emolpoyee,
    percent: "15.3%",
    customClass: "bg-[#E6F7FF]",
  },
  {
    id: "DI004",
    patientName: "Robert Wilson",
    requestType: "Other",
    question: "Contraindications for cardiac patients",
    priority: "Normal",
    status: "Pending Review",
    submittedAt: "2024-01-14 14:20",
    responseNeeded: "When time permits",
    assignedTo: "Dr. Amanda Ross"
  }
]);

// Top performing providers
const topProviders = ref([
  {
    status: "Black Lion Hospital",
    count: 245,
    total: 300,
    percentage: 82,
    color: "#9461FD",
  },
  {
    status: "Tikur Anbessa Hospital",
    count: 198,
    total: 250,
    percentage: 79,
    color: "#9461FD",
  },
  {
    status: "St. Paul's Hospital",
    count: 156,
    total: 200,
    percentage: 78,
    color: "#9461FD",
  },
  {
    status: "Addis Ababa Health Bureau",
    count: 134,
    total: 180,
    percentage: 74,
    color: "#9461FD",
  },
  {
    status: "Zewditu Memorial Hospital",
    count: 112,
    total: 160,
    percentage: 70,
    color: "#9461FD",
  },
]);

// Recent drug activities
const recentActivities = ref([
  {
    activity: "New Drug Added",
    description: "Amoxicillin 500mg added to inventory",
    time: "2 minutes ago",
    type: "success",
    icon: icons.plus_circle,
  },
  {
    activity: "Low Stock Alert",
    description: "Paracetamol 500mg running low",
    time: "15 minutes ago",
    type: "warning",
    icon: icons.export,
  },
  {
    activity: "Service Request",
    description: "New consultation service requested",
    time: "1 hour ago",
    type: "info",
    icon: icons.no_emolpoyee,
  },
  {
    activity: "Provider Registration",
    description: "New healthcare provider registered",
    time: "3 hours ago",
    type: "success",
    icon: icons.product_sold,
  },
]);

// Chart options with updated colors
const barChartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Count",
      },
      grid: {
        color: 'rgba(148, 97, 253, 0.1)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const { 
  policyVsClaimData, 
  userGrowthChartData,
  providerGrowthChartData,
  providerTypesChartData,
  userActivityChartData,
  fetchChartData 
} = useChartData();

// Quick stats computed
const quickStats = computed(() => ({
  totalDrugs: data.value[0].amount,
  activeProviders: data.value[1].amount,
  totalServices: data.value[2].amount,
  todayRequests: data.value[3].amount,
}));

function getPriorityColor(priority) {
  switch(priority) {
    case 'Urgent': return 'bg-red-100 text-red-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Normal': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getInquiryStatusColor(status) {
  switch(status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
    case 'Overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getRequestTypeColor(type) {
  switch(type) {
    case 'Patient Specific': return 'bg-purple-100 text-purple-800';
    case 'Academic': return 'bg-indigo-100 text-indigo-800';
    case 'Other': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full overflow-x-hidden scrollbar-hide">
    <!-- Welcome Card -->
    <CardDashboard />
    
    <!-- Main Stats Grid -->
    <div class="grid grid-cols-5 gap-5">
      <div class="flex flex-col col-span-3 gap-6 bg-white px-5 py-4 rounded-2xl border border-[#F8F9FA]">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-xl">System Overview</p>
            <p class="text-sm text-gray-600">Healthcare Management Dashboard</p>
          </div>
          <Button class="border flex gap-2 font-medium items-center hover:bg-gray-50" type="">
            <i v-html="icons.export"></i>
            Export Report
          </Button>
        </div>
        <div class="grid grid-cols-3 gap-6">
          <Cards :data="data.slice(0, 3)" />
        </div>
        <div class="grid grid-cols-2 gap-6">
          <Cards :data="data.slice(3, 5)" />
        </div>
      </div>
      
      <!-- Provider Types Distribution -->
      <div class="col-span-2">
        <ChartCard title="Provider Types Distribution">
          <div class="space-y-4">
            <!-- Chart -->
            <DoughnutChart
              :chart-data="{
                labels: [
                  'Government Hospitals', 
                  'Private Clinics', 
                  'Pharmacies', 
                  'Diagnostic Centers', 
                  'Health Centers',
                  'Specialized Clinics',
                  'Emergency Services'
                ],
                datasets: [{
                  data: [28, 22, 18, 12, 10, 6, 4],
                  backgroundColor: [
                    '#9461FD', 
                    '#3B82F6', 
                    '#10B981', 
                    '#F59E0B', 
                    '#EF4444', 
                    '#8B5CF6',
                    '#06B6D4'
                  ],
                  borderWidth: 2,
                  borderColor: '#ffffff',
                  hoverBorderWidth: 3,
                  hoverOffset: 8,
                }]
              }"
              :options="{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#9461FD',
                    borderWidth: 1,
                    callbacks: {
                      label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                      }
                    }
                  }
                },
                cutout: '60%',
                radius: '90%'
              }"
              height="200px"
            />
            
            <!-- Custom Legend -->
            <div class="grid grid-cols-1 gap-2 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#9461FD]"></div>
                  <span class="text-gray-700">Government Hospitals</span>
                </div>
                <span class="font-semibold text-gray-900">28%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                  <span class="text-gray-700">Private Clinics</span>
                </div>
                <span class="font-semibold text-gray-900">22%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#10B981]"></div>
                  <span class="text-gray-700">Pharmacies</span>
                </div>
                <span class="font-semibold text-gray-900">18%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                  <span class="text-gray-700">Diagnostic Centers</span>
                </div>
                <span class="font-semibold text-gray-900">12%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                  <span class="text-gray-700">Health Centers</span>
                </div>
                <span class="font-semibold text-gray-900">10%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
                  <span class="text-gray-700">Specialized Clinics</span>
                </div>
                <span class="font-semibold text-gray-900">6%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-[#06B6D4]"></div>
                  <span class="text-gray-700">Emergency Services</span>
                </div>
                <span class="font-semibold text-gray-900">4%</span>
              </div>
            </div>
            
            <!-- Summary Stats -->
            <div class="border-t pt-3 mt-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Total Providers</span>
                <span class="font-bold text-[#9461FD]">1,247</span>
              </div>
              <div class="flex justify-between items-center text-sm mt-1">
                <span class="text-gray-600">Active This Month</span>
                <span class="font-bold text-green-600">1,156</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>

    <!-- Analytics Row -->
    <div class="grid grid-cols-7 gap-6">
      <!-- Drug Management Trends -->
      <div class="col-span-4">
        <ChartCard title="Drug Management Trends">
          <LineChart
            :chart-data="{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              datasets: [
                {
                  label: 'Drugs Added',
                  data: [120, 150, 180, 220, 280, 320, 380],
                  borderColor: '#9461FD',
                  backgroundColor: 'rgba(148, 97, 253, 0.1)',
                  tension: 0.4,
                },
                {
                  label: 'Services Registered',
                  data: [80, 95, 110, 140, 165, 190, 220],
                  borderColor: '#FFD665',
                  backgroundColor: 'rgba(255, 214, 101, 0.1)',
                  tension: 0.4,
                }
              ]
            }"
            :options="barChartOptions"
            height="300px"
          />
        </ChartCard>
      </div>
      
      <!-- Provider Registration -->
      <div class="col-span-3">
        <ChartCard title="Monthly Provider Registration">
          <BarChart
            :chart-data="{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'New Providers',
                data: [12, 18, 15, 22, 28, 24],
                backgroundColor: '#9461FD',
                borderRadius: 4,
              }]
            }"
            :options="barChartOptions"
            :barThickness="30"
            height="300px"
          />
        </ChartCard>
      </div>
    </div>

    <!-- Activity and Performance Row -->
    <div class="grid grid-cols-7 gap-6">
      <!-- System Activity -->
      <div class="col-span-4">
        <ChartCard title="System Activity Patterns">
          <LoopChart
            title=""
            :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
            :datasets="[
              {
                label: 'Drug Searches',
                data: [450, 520, 680, 750, 820, 600, 400],
                borderColor: '#9461FD',
                backgroundColor: 'rgba(148, 97, 253, 0.1)',
              },
              {
                label: 'Service Requests',
                data: [280, 320, 380, 420, 480, 350, 250],
                borderColor: '#FFD665',
                backgroundColor: 'rgba(255, 214, 101, 0.1)',
              },
            ]"
            :tension="0.4"
          />
        </ChartCard>
      </div>
      
      <!-- Top Providers Performance -->
      <div class="bg-white col-span-3 rounded-2xl px-5 py-4 border border-[#F8F9FA]">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-[#373946]">Top Active Providers</p>
            <span class="text-sm text-gray-500">This Month</span>
          </div>
          <Table
            :showPagination="false"
            :headers="{
              head: ['Provider', 'Requests', 'Performance'],
              row: ['status', 'totalClaim', 'sales'],
            }"
            :row-com="Progress_row"
            :rows="topProviders"
          />
        </div>
      </div>
    </div>

    <!-- Recent Activities and System Health -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Recent Activities -->
      <div class="bg-white rounded-2xl px-5 py-4 border border-[#F8F9FA]">
        <div class="space-y-4">
          <h3 class="font-semibold text-lg">Recent Activities</h3>
          <div class="space-y-3">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.activity"
              class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div 
                :class="{
                  'bg-green-100 text-green-600': activity.type === 'success',
                  'bg-yellow-100 text-yellow-600': activity.type === 'warning',
                  'bg-blue-100 text-blue-600': activity.type === 'info',
                }"
                class="p-2 rounded-full"
              >
                <i v-html="activity.icon" class="w-4 h-4"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-sm">{{ activity.activity }}</p>
                <p class="text-xs text-gray-600">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- System Performance Metrics -->
      <div class="bg-white rounded-2xl px-5 py-4 border border-[#F8F9FA]">
        <div class="space-y-4">
          <h3 class="font-semibold text-lg">System Health</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Database Performance</span>
              <div class="flex items-center gap-2">
                <div class="w-20 h-2 bg-gray-200 rounded-full">
                  <div class="w-[85%] h-full bg-green-500 rounded-full"></div>
                </div>
                <span class="text-sm font-medium">85%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">API Response Time</span>
              <div class="flex items-center gap-2">
                <div class="w-20 h-2 bg-gray-200 rounded-full">
                  <div class="w-[92%] h-full bg-green-500 rounded-full"></div>
                </div>
                <span class="text-sm font-medium">92%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">System Uptime</span>
              <div class="flex items-center gap-2">
                <div class="w-20 h-2 bg-gray-200 rounded-full">
                  <div class="w-[99%] h-full bg-green-500 rounded-full"></div>
                </div>
                <span class="text-sm font-medium">99%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Storage Usage</span>
              <div class="flex items-center gap-2">
                <div class="w-20 h-2 bg-gray-200 rounded-full">
                  <div class="w-[67%] h-full bg-yellow-500 rounded-full"></div>
                </div>
                <span class="text-sm font-medium">67%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
