<template>
  <div>
    <div class="dashboard-header">
      <h2>
        {{ title }} 대시보드 
        <span v-if="userMode === 'admin'">(관리자 모드)</span>
      </h2>
      <span class="dashboard-time">
        <h2>{{ currentTime }}</h2>
      </span>
    </div>

    <div class="dashboard-cards">
      <ProductionStatusCard
        v-for="(card, idx) in cards"
        :key="idx"
        :title="card.title"
        :value="card.value"
        :unit="card.unit"
        :chartData="card.chartData"
        :targetProd="card.targetProd"
        :userMode="userMode"
        @update:targetProd="onUpdateTargetProd(idx, $event)"
      />
    </div>

    <div v-if="defectChartData" class="defect-chart-section">
      <h3>결함 별 검출 수 ({{ selectedDefectType }})</h3>
      <div class="chart-wrapper">
        <Bar :data="defectChartData" :options="defectChartOptions" />
      </div>
      <div class="defect-type-selector">
        <label for="defect-select">불량 유형:</label>
        <select id="defect-select" :value="selectedDefectType" @change="onDefectTypeChange">
          <option v-for="dtype in defectTypes" :key="dtype" :value="dtype">
            {{ dtype }}
          </option>
        </select>
      </div>
    </div>

    <AdminChart
      v-if="userMode === 'admin' && adminChartData"
      :chartData="adminChartData"
      title="장비 온도 모니터링"
    />
  </div>
</template>

<script>
import ProductionStatusCard from './ProductionStatusCard.vue'
import AdminChart from './AdminChart.vue'
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
  name: 'ProductionDashboard',
  components: { ProductionStatusCard, AdminChart, Bar },
  props: {
    title: String,
    cards: Array,
    // defects 객체 대신 필요한 데이터를 직접 받습니다.
    defectChartData: Object, // App.vue에서 가공된 차트 데이터
    selectedDefectType: String, // 현재 선택된 불량 유형
    defectTypes: Array, // 모든 불량 유형 목록
    userMode: String,
    adminChartData: Object,
  },
  data() {
    return {
      currentTime: '',
      timer: null,
      defectChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false, // 제목은 h3 태그에서 표시
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
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  emits: ['update:targetProd', 'update:defectType'], // update:defectType 이벤트를 다시 추가
  methods: {
    onUpdateTargetProd(index, value) {
      this.$emit('update:targetProd', { tab: this.title, index, value })
    },
    onDefectTypeChange(event) {
      this.$emit('update:defectType', { newDefectType: event.target.value });
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('ko-KR', { hour12: false });
    },
  },
}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.dashboard-time {
  color: #555;
}

.dashboard-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.defect-chart-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 20px; /* 상단 여백 추가 */
}

.chart-wrapper {
  position: relative;
  height: 300px; /* 차트 높이 조절 */
  margin-bottom: 20px;
}

.defect-type-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.defect-type-selector label {
  font-weight: bold;
}

.defect-type-selector select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>