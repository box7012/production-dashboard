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

    <div v-if="defects" class="defect-chart-section">
      <h3>결함 별 검출 수</h3>
      <DefectCheck :defects="defects" @update:defectType="onDefectChange" />
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
import DefectCheck from './DefectCheck.vue'
import AdminChart from './AdminChart.vue'

export default {
  name: 'ProductionDashboard',
  components: { ProductionStatusCard, DefectCheck, AdminChart },
  props: {
    title: String,
    cards: Array,
    defects: Object,
    userMode: String,
    adminChartData: Object,
  },
  data() {
    return {
      currentTime: '',
      timer: null
    };
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  emits: ['update:targetProd', 'update:defectType'],
  methods: {
    onUpdateTargetProd(index, value) {
      this.$emit('update:targetProd', { tab: this.title, index, value })
    },
    onDefectChange(newDefectType) {
      this.$emit('update:defectType', { newDefectType })
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
}
</style>
