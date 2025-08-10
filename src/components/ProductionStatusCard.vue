<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p class="value">{{ value }}</p>
    <p class="unit">{{ unit }}</p>
  </div>
</template>

<script>
export default {
  name: 'ProductionStatusCard',
  props: {
    title: String,
    value: [Number, String],
    unit: String,
  },
}
</script>

<style scoped>
.card {
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f7fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  width: 200px;
}
.value {
  font-size: 2rem;
  font-weight: bold;
  margin: 8px 0;
}
.unit {
  color: #666;
}
</style>
