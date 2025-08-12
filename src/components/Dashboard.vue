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
  </div>
</template>

<script>
import ProductionStatusCard from './ProductionStatusCard.vue'

export default {
  name: 'ProductionDashboard',
  components: { ProductionStatusCard },
  props: {
    title: String,
    cards: Array,
    defectChartData: Object,
    selectedDefectType: String,
    defectTypes: Array,
    userMode: String,
    adminChartData: Object,
  },
  data() {
    return {
      currentTime: '',
      timer: null,
    }
  },
  mounted() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  emits: ['update:targetProd', 'update:defectType'],
  methods: {
    onUpdateTargetProd(index, value) {
      this.$emit('update:targetProd', { tab: this.title, index, value })
    },
    onDefectTypeChange(payload) {
      this.$emit('update:defectType', payload)
    },
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('ko-KR', { hour12: false })
    },
  },
}
</script>

<style scoped>
/* 기존 Dashboard.vue 스타일 유지 */
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
</style>