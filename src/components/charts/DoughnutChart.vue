<script setup>
import { onMounted, ref, watch } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: String,
    default: "300px",
  },
});

const chartContainer = ref(null);
let chart = null;

onMounted(() => {
  createChart();
});

watch(
  () => props.chartData,
  (newData) => {
    if (chart) {
      chart.data = newData;
      chart.update();
    }
  },
  { deep: true }
);

function createChart() {
  if (chartContainer.value) {
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
      },
    };

    chart = new Chart(chartContainer.value, {
      type: "doughnut",
      data: props.chartData,
      options: {
        ...defaultOptions,
        ...props.options,
      },
    });
  }
}
</script>

<template>
  <div :style="{ height }">
    <canvas ref="chartContainer"></canvas>
  </div>
</template>