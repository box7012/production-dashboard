<template>
  <div class="defect-chart-section">
    <div class="chart-header">
      <h3>결함 별 검출 수 ({{ selectedDefectType }})</h3>
      <div class="defect-type-selector">
        <label for="defect-select">불량 유형:</label>
        <select id="defect-select" :value="selectedDefectType" @change="onDefectTypeChange">
          <option v-for="dtype in defectTypes" :key="dtype" :value="dtype">
            {{ dtype }}
          </option>
        </select>
      </div>
    </div>
    <div class="chart-wrapper">
      <Bar :data="defectChartData" :options="defectChartOptions" />
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
  name: 'DefectChart',
  components: { Bar },
  props: {
    defectChartData: Object,
    selectedDefectType: String,
    defectTypes: Array,
  },
  emits: ['update:defectType'],
  data() {
    return {
      defectChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: false },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: '수량' },
          },
          y: {
            title: { display: true, text: '시간/날짜/월' },
          },
        },
      }
    }
  },
  methods: {
    onDefectTypeChange(event) {
      this.$emit('update:defectType', { newDefectType: event.target.value })
    },
  },
}
</script>

<style scoped>
/* Dashboard.vue 에서 사용하던 스타일 복사 */
.defect-chart-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  margin-bottom: 0;
}

.defect-type-selector {
  flex-shrink: 0;
  width: 150px;
}
</style>