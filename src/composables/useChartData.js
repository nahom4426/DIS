import { ref, computed } from "vue";

export function useChartData() {
  const policyData = ref([65, 59, 80, 81, 56, 55]);
  const claimData = ref([28, 48, 40, 19, 36, 27]);
  const revenueData = ref([12, 19, 3, 5, 2, 3]);
  const months = ref(["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
  
  // New user and provider data
  const userRegistrationData = ref([120, 150, 180, 200, 250, 300]);
  const providerData = ref([15, 18, 22, 25, 28, 32]);
  const activeUsersData = ref([800, 850, 920, 980, 1050, 1120]);
  const providerTypesData = ref([45, 30, 15, 10]); // Hospitals, Clinics, Pharmacies, Labs

  const policyVsClaimData = computed(() => ({
    labels: months.value,
    datasets: [
      {
        label: "Services",
        data: claimData.value,
        backgroundColor: "#FFD665",
        borderWidth: 1,
      },
      {
        label: "Drugs",
        data: policyData.value,
        backgroundColor: "#02676B",
        borderWidth: 1,
      },
    ],
  }));

  const revenueChartData = computed(() => ({
    labels: months.value,
    datasets: [
      {
        label: "Revenue",
        data: revenueData.value,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }));

  const userGrowthChartData = computed(() => ({
    labels: months.value,
    datasets: [
      {
        label: "New Users",
        data: userRegistrationData.value,
        backgroundColor: "#3B82F6",
        borderColor: "#3B82F6",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Active Users",
        data: activeUsersData.value,
        backgroundColor: "#10B981",
        borderColor: "#10B981",
        borderWidth: 2,
        fill: false,
      },
    ],
  }));

  const providerGrowthChartData = computed(() => ({
    labels: months.value,
    datasets: [
      {
        label: "Registered Providers",
        data: providerData.value,
        backgroundColor: "#02676B",
        borderWidth: 1,
      },
    ],
  }));

  const providerTypesChartData = computed(() => ({
    labels: ["Hospitals", "Clinics", "Pharmacies", "Laboratories"],
    datasets: [
      {
        data: providerTypesData.value,
        backgroundColor: ["#02676B", "#FFD665", "#EF4444", "#A700FF"],
        borderWidth: 0,
      },
    ],
  }));

  const userActivityChartData = computed(() => ({
    labels: months.value,
    datasets: [
      {
        label: "Drug Searches",
        data: [450, 520, 680, 750, 820, 900],
        backgroundColor: "rgba(2, 103, 107, 0.3)",
        borderColor: "#02676B",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Information Requests",
        data: [280, 320, 380, 420, 480, 550],
        backgroundColor: "rgba(255, 214, 101, 0.3)",
        borderColor: "#FFD665",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }));

  const fetchChartData = async () => {
    try {
      // Replace with actual API calls
      console.log("Fetching chart data...");
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  return {
    policyVsClaimData,
    revenueChartData,
    userGrowthChartData,
    providerGrowthChartData,
    providerTypesChartData,
    userActivityChartData,
    fetchChartData,
  };
}
