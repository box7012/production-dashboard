<template>
  <div>
    <h2>{{ title }} 대시보드 <span v-if="userMode === 'admin'">(관리자 모드)</span></h2>
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
  </div>
</template>

<script>
import ProductionStatusCard from './ProductionStatusCard.vue'
import DefectCheck from './DefectCheck.vue'

export default {
  name: 'ProductionDashboard',
  components: { ProductionStatusCard, DefectCheck },
  props: {
    title: String,
    cards: Array,
    defects: Object,
    userMode: String,
  },
  emits: ['update:targetProd', 'update:defectType'],
  methods: {
    onUpdateTargetProd(index, value) {
      this.$emit('update:targetProd', { tab: this.title, index, value })
    },
    onDefectChange(newDefectType) {
      this.$emit('update:defectType', { newDefectType })
    },
  },
}
</script>

<style scoped>
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