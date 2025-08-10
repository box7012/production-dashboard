<template>
  <div>
    <h2>{{ title }} 대시보드</h2>
    <div class="dashboard-cards">
      <ProductionStatusCard
        v-for="(item, idx) in data"
        :key="idx"
        :title="item.title"
        :value="item.value"
        :unit="item.unit"
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
    data: Array,
  },
}
</script>

<style scoped>
.dashboard-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>