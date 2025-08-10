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
      <Dashboard :title="currentTab" :data="dashboardData[currentTab]" />
    </section>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  components: { Dashboard },
  data() {
    return {
      tabs: ['D02', 'D07', 'D14', 'D20'],
      currentTab: 'D02',
      dashboardData: {
        D02: [
          {
            title: '오늘 생산량',
            value: 1200,
            unit: '개',
            chartData: {
              labels: ['1시', '2시', '3시', '4시', '5시', '6시'],
              datasets: [
                {
                  label: '생산량',
                  data: [200, 180, 220, 210, 190, 200],
                  borderColor: '#42b983',
                  fill: false,
                },
              ],
            },
          },
          {
            title: '가동률',
            value: '85%',
            unit: '',
            chartData: {
              labels: ['1시', '2시', '3시', '4시', '5시', '6시'],
              datasets: [
                {
                  label: '가동률(%)',
                  data: [80, 82, 85, 88, 84, 85],
                  borderColor: '#ff9800',
                  fill: false,
                },
              ],
            },
          },
          {
            title: '불량률',
            value: '1.8%',
            unit: '',
            chartData: {
              labels: ['1시', '2시', '3시', '4시', '5시', '6시'],
              datasets: [
                {
                  label: '불량률(%)',
                  data: [2.1, 1.9, 1.8, 1.7, 1.9, 1.8],
                  borderColor: '#f44336',
                  fill: false,
                },
              ],
            },
          },
        ],
        D07: [
          {
            title: '오늘 생산량',
            value: 1500,
            unit: '개',
            chartData: {
              labels: ['1시', '2시', '3시', '4시', '5시', '6시'],
              datasets: [
                {
                  label: '생산량',
                  data: [250, 260, 240, 270, 250, 230],
                  borderColor: '#42b983',
                  fill: false,
                },
              ],
            },
          },
          {
            title: '가동률',
            value: '90%',
            unit: '',
            chartData: {
              labels: ['1시', '2시', '3시', '4시', '5시', '6시'],
              datasets: [
                {
                  label: '가동률(%)',
                  data: [88, 89, 92, 91, 90, 90],
                  borderColor: '#ff9800',
                  fill: false,
                },
              ],
            },
          },
          {
            title: '불량률',
            value: '1.2%',
            unit: '',
            chartData: {
              labels: ['1시', '2시', '3시', '4시', '5시', '6시'],
              datasets: [
                {
                  label: '불량률(%)',
                  data: [1.1, 1.3, 1.2, 1.0, 1.4, 1.2],
                  borderColor: '#f44336',
                  fill: false,
                },
              ],
            },
          },
        ],
        D14: [
          {
            title: '주간 생산량',
            value: 8400,
            unit: '개',
            chartData: {
              labels: ['월', '화', '수', '목', '금', '토', '일'],
              datasets: [
                {
                  label: '생산량',
                  data: [1200, 1300, 1100, 1400, 1250, 1150, 1000],
                  borderColor: '#42b983',
                  fill: false,
                },
              ],
            },
          },
          {
            title: '평균 가동률',
            value: '88%',
            unit: '',
            chartData: {
              labels: ['월', '화', '수', '목', '금', '토', '일'],
              datasets: [
                {
                  label: '가동률(%)',
                  data: [85, 88, 86, 90, 89, 87, 83],
                  borderColor: '#ff9800',
                  fill: false,
                },
              ],
            },
          },
        ],
        D20: [
          {
            title: '월간 생산량',
            value: 35000,
            unit: '개',
            chartData: {
              labels: ['1주', '2주', '3주', '4주'],
              datasets: [
                {
                  label: '생산량',
                  data: [8400, 8800, 8200, 9600],
                  borderColor: '#42b983',
                  fill: false,
                },
              ],
            },
          },
          {
            title: '월간 불량률',
            value: '1.5%',
            unit: '',
            chartData: {
              labels: ['1주', '2주', '3주', '4주'],
              datasets: [
                {
                  label: '불량률(%)',
                  data: [1.6, 1.4, 1.7, 1.3],
                  borderColor: '#f44336',
                  fill: false,
                },
              ],
            },
          },
        ],
      },
    }
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
