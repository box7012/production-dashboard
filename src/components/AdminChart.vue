<template>
  <div class="admin-chart-container">
    <h4>{{ title }}</h4>
    <div class="chart-wrapper">
      <LineChart v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'

Chart.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  name: 'AdminChart',
  components: {
    LineChart: Line,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: '관리자 전용 차트',
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    }
  },
}
</script>

<style scoped>
.admin-chart-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
.chart-wrapper {
  position: relative;
  height: 250px;
  width: 100%;
}
</style>
