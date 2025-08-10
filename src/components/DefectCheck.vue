<template>
  <div class="defect-check-container">
    <div class="defect-selector">
      <label v-for="defectType in defects.defectTypes" :key="defectType">
        <input
          type="radio"
          name="defectType"
          :value="defectType"
          :checked="defectType === defects.selectedDefect"
          @change="onDefectTypeChange(defectType)"
        />
        {{ defectType }}
      </label>
    </div>
    <div class="chart-container">
      <BarChart v-if="defects.chartData" :data="defects.chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'DefectCheck',
  components: {
    BarChart: Bar,
  },
  props: {
    defects: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:defectType'],
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
            beginAtZero: true,
          },
        },
      },
    }
  },
  methods: {
    onDefectTypeChange(newDefectType) {
      this.$emit('update:defectType', newDefectType)
    },
  },
}
</script>

<style scoped>
.defect-check-container {
  padding: 20px;
}
.defect-selector {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
}
.defect-selector label {
  cursor: pointer;
}
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
