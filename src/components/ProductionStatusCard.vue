<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p class="value">{{ value }} <span class="unit">{{ unit }}</span></p>

    <div v-if="isProductionCard" class="achievement-rate">
      <span>달성률: {{ achievementRate }}%</span>
    </div>

    <div v-if="isProductionCard && userMode === 'admin'" class="target-input">
      <label>목표:</label>
      <input type="number" :value="targetProd" @input="onTargetChange" />
    </div>

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
    targetProd: Number,
    userMode: String,
  },
  emits: ['update:targetProd'],
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
  computed: {
    isProductionCard() {
      return this.targetProd !== undefined && this.targetProd !== null
    },
    achievementRate() {
      if (!this.isProductionCard || !this.targetProd) return 0
      return ((this.value / this.targetProd) * 100).toFixed(1)
    },
  },
  methods: {
    onTargetChange(event) {
      this.$emit('update:targetProd', event.target.value)
    },
  },
}
</script>

<style scoped>
.card {
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f7fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  font-size: 1rem;
  color: #666;
  margin-left: 5px;
}
.achievement-rate {
  font-weight: bold;
  color: #42b983;
  margin-bottom: 10px;
}
.target-input {
  margin-bottom: 15px;
}
.target-input label {
  margin-right: 5px;
}
.target-input input {
  width: 80px;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.chart-container {
  position: relative;
  height: 150px;
  width: 100%;
}
</style>
