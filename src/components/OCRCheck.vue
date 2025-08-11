
<template>
  <div v-if="chartData" class="check-chart-section">
    <h3>OCR Check</h3>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'OCRCheck',
  components: { Bar },
  props: {
    chartData: Object,
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
                display: true,
                text: '수량'
            }
          },
          y: {
            title: {
                display: true,
                text: '시간/날짜/월'
            }
          }
        }
      }
    };
  },
}
</script>

<style scoped>
.check-chart-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px; /* 아래 여백 추가 */
}
.chart-wrapper {
  position: relative;
  height: 250px; /* 차트 높이 조절 */
}
</style>
