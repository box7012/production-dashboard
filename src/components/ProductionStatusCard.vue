<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p class="value">{{ value }}</p>
    <p class="unit">{{ unit }}</p>

    <div class="chart-container">
      <LineChart v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

Chart.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  name: 'ProductionStatusCard',
  components: {
    LineChart: Line,
  },
  props: {
    title: String,
    value: [Number, String],
    unit: String,
    chartData: Object,
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: { display: true },
          y: { display: true, beginAtZero: true },
        },
      },
    }
  },
}
</script>

<style scoped>
.card {
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f7fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  width: 250px;
  margin-bottom: 20px;
}
.value {
  font-size: 2rem;
  font-weight: bold;
  margin: 8px 0;
}
.unit {
  color: #666;
  margin-bottom: 10px;
}
.chart-container {
  position: relative;
  height: 150px;
  width: 100%;
}
</style>
