<template>
  <div id="app">
    <aside class="sidebar">
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab"
          :class="{ active: currentTab === tab }"
          @click="currentTab = tab"
        >
          {{ tab }}
        </li>
      </ul>
    </aside>
    <section class="content">
      <Dashboard
        :title="currentTab"
        :cards="dashboardData[currentTab].cards"
        :defects="dashboardData[currentTab].defects"
        @update:targetProd="handleUpdateTargetProd"
        @update:defectType="handleDefectChange"
      />
    </section>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'

// Helper to generate initial defect chart data
const generateDefectChartData = (defects) => {
  const { selectedDefect, byLine, labels } = defects
  return {
    labels,
    datasets: [
      {
        label: selectedDefect,
        data: byLine[selectedDefect],
        backgroundColor: '#f87979',
      },
    ],
  }
}

export default {
  name: 'App',
  components: { Dashboard },
  data() {
    const initialDefects = {
      D02: {
        selectedDefect: 'bubble',
        defectTypes: ['honing', 'bubble', 'dent', 'honing missing', 'crack', 'burst', ],
        labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
        byLine: {
          honing: [5, 8, 3, 6],
          찍힘: [2, 4, 5, 1],
          오염: [6, 2, 1, 3],
          파손: [1, 0, 2, 2],
        },
      },
      D07: {
        selectedDefect: '오염',
        defectTypes: ['스크래치', '찍힘', '오염', '기타'],
        labels: ['Line A', 'Line B', 'Line C'],
        byLine: {
          스크래치: [3, 5, 2],
          찍힘: [6, 2, 4],
          오염: [1, 3, 5],
          기타: [4, 1, 1],
        },
      },
    }

    // Add chartData to initial defects
    initialDefects.D02.chartData = generateDefectChartData(initialDefects.D02)
    initialDefects.D07.chartData = generateDefectChartData(initialDefects.D07)

    return {
      tabs: ['D02', 'D07', 'D14', 'D20'],
      currentTab: 'D02',
      dashboardData: {
        D02: {
          cards: [
            {
              title: '오늘 생산량',
              value: 1200,
              unit: '개',
              targetProd: 2000,
              chartData: { labels: ['1시', '2시'], datasets: [{ data: [200, 180] }] },
            },
            { title: '가동률', value: '85%', chartData: { labels: ['1시', '2시'], datasets: [{ data: [80, 82] }] } },
            { title: '불량률', value: '1.8%', chartData: { labels: ['1시', '2시'], datasets: [{ data: [2.1, 1.9] }] } },
          ],
          defects: initialDefects.D02,
        },
        D07: {
          cards: [
            {
              title: '오늘 생산량',
              value: 1500,
              unit: '개',
              targetProd: 1800,
              chartData: { labels: ['1시', '2시'], datasets: [{ data: [250, 260] }] },
            },
            { title: '가동률', value: '90%', chartData: { labels: ['1시', '2시'], datasets: [{ data: [88, 89] }] } },
          ],
          defects: initialDefects.D07,
        },
        D14: { cards: [], defects: null }, // No defect data for D14 and D20 yet
        D20: { cards: [], defects: null },
      },
    }
  },
  methods: {
    handleUpdateTargetProd({ tab, index, value }) {
      const card = this.dashboardData[tab]?.cards[index]
      if (card) {
        card.targetProd = Number(value)
      }
    },
    handleDefectChange({ newDefectType }) {
      const defects = this.dashboardData[this.currentTab]?.defects
      if (defects) {
        defects.selectedDefect = newDefectType
        defects.chartData = generateDefectChartData(defects)
      }
    },
  },
}
</script>

<style>
#app {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar {
  width: 120px;
  background: #2c3e50;
  color: white;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 15px 10px;
  cursor: pointer;
  user-select: none;
  text-align: center;
}

.sidebar li.active,
.sidebar li:hover {
  background: #34495e;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background: #ecf0f1;
  overflow-y: auto;
}
</style>
