
<template>
  <div class="defect-controls">
    <div class="control-group">
      <label>시간 범위:</label>
      <button
        v-for="range in ranges"
        :key="range.value"
        :class="{ active: currentRange === range.value }"
        @click="selectRange(range.value)"
      >
        {{ range.text }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefectCheck',
  props: {
    currentRange: {
      type: String,
      required: true
    }
  },
  emits: ['update:timeRange'],
  data() {
    return {
      ranges: [
        { value: 'daily', text: 'Daily' },
        { value: 'weekly', text: 'Weekly' },
        { value: 'monthly', text: 'Monthly' }
      ]
    }
  },
  methods: {
    selectRange(range) {
      this.$emit('update:timeRange', range);
    }
  }
}
</script>

<style scoped>
.defect-controls {
  display: flex;
  gap: 30px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  align-items: center;
}
.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
label {
  font-weight: bold;
}
button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
}
button.active {
  background-color: #34495e;
  color: white;
  border-color: #34495e;
}
select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
}
</style>
