<template>
  <div class="summary-container">
    <h2>전체 라인별 생산</h2>
    <div
      v-for="(value, line) in runners"
      :key="line"
      class="runner-row"
    >
      <div class="line-label">{{ line }}</div>
      <div class="track">
        <div
          class="runner"
          :style="{ left: value.percent + '%' }"
        >
          <lottie-player
            src="/animations/GO_TO_SCHOOL_ANIMATION.json"
            background="transparent"
            speed="1"
            style="width: 60px; height: 60px;"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>
      <div class="score">{{ value.current }} / {{ value.target }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductionSummaryRunner',
  props: {
    summaryData: {
      type: Object,
      required: true
    }
  },
  computed: {
    runners() {
      const result = {}
      const labels = this.summaryData.labels || []
      const prodDataset = this.summaryData.datasets?.find(d => d.label.includes('생산량') && !d.label.includes('목표'))
      const targetDataset = this.summaryData.datasets?.find(d => d.label.includes('목표'))

      labels.forEach((label, idx) => {
        const current = prodDataset?.data[idx] ?? 0
        const target = targetDataset?.data[idx] ?? 0
        const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0
        result[label] = { current, target, percent }
      })

      return result
    }
  }
}
</script>

<style scoped>
.summary-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  min-width: 800px;
}

.runner-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.line-label {
  width: 80px;
  font-weight: bold;
}

.track {
  position: relative;
  flex: 1;
  height: 60px;
  background: #eee;
  border-radius: 30px;
  margin: 0 10px;
  overflow: hidden;
}

.runner {
  position: absolute;
  top: 0;
  transform: translateY(0);
}

.score {
  width: 100px;
  text-align: right;
}
</style>
