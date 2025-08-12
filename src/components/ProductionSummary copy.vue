
<template>
  <div class="summary-container">
    <h2>전체 라인별 생산 현황</h2>
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
  name: 'ProductionSummary',
  components: { Bar },
  props: {
    summaryData: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartData() {
      return this.summaryData;
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // 이 옵션이 가로 막대 차트를 만듭니다.
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '라인별 생산량 vs 목표량'
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
                display: true,
                text: '생산량 (개)'
            }
          },
          y: {
            title: {
                display: true,
                text: '라인'
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.summary-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    min-width: 800px;
}
.chart-wrapper {
    position: relative;
    height: 400px; /* 필요에 따라 높이 조절 */
}
</style>
