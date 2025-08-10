<template>
  <div id="app-container">
    <LoginView v-if="!isAuthenticated" @login="handleLogin" />
    <div v-else class="main-layout">
      <aside class="sidebar">
        <ul class="tabs-list">
          <li
            v-for="tab in tabs"
            :key="tab"
            :class="{ active: currentTab === tab }"
            @click="currentTab = tab"
          >
            {{ tab }}
          </li>
        </ul>
        <div class="sidebar-footer">
          <button @click="handleLogout" class="auth-button">로그아웃</button>
        </div>
      </aside>

      <section class="content">
        <Dashboard
          v-if="dashboardData[currentTab]"
          :title="currentTab"
          :cards="dashboardData[currentTab].cards"
          :defects="dashboardData[currentTab].defects"
          :adminChartData="dashboardData[currentTab].adminChartData"
          :userMode="userMode"
          @update:targetProd="handleUpdateTargetProd"
          @update:defectType="handleDefectChange"
        />
      </section>
    </div>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
import LoginView from './components/Login.vue' // The file is Login.vue, but component name is LoginView
import { login as apiLogin } from './services/auth.js'

const generateDefectChartData = (defects) => {
  if (!defects) return null
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
  components: { Dashboard, LoginView },
  data() {
    const baseDefectData = {
      defectTypes: ['honing', 'bubble', 'dent', 'honing_missing', 'crack', 'burst'],
      labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
      byLine: {
        honing: [5, 8, 3, 6, 4, 2, 7, 5, 6, 3, 8, 5],
        bubble: [2, 4, 5, 1, 3, 6, 2, 4, 5, 1, 3, 2],
        dent: [6, 2, 1, 3, 5, 4, 6, 7, 8, 2, 1, 3],
        honing_missing: [1, 0, 2, 2, 1, 3, 0, 1, 2, 0, 1, 0],
        crack: [6, 2, 1, 3, 2, 1, 4, 5, 3, 2, 1, 4],
        burst: [2, 4, 5, 1, 3, 2, 4, 3, 2, 1, 2, 3],
      },
    }
    const initialDefects = {
      D02: { ...baseDefectData, selectedDefect: 'bubble' },
      D07: { ...baseDefectData, selectedDefect: 'dent' },
      D14: { ...baseDefectData, selectedDefect: 'crack' },
      D20: { ...baseDefectData, selectedDefect: 'honing' },
    }
    Object.values(initialDefects).forEach(defects => {
      defects.chartData = generateDefectChartData(defects)
    })
    const adminChartData = {
      labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
      datasets: [
        { label: '장비 1 온도 (°C)', data: [65, 68, 72, 71, 75, 77], borderColor: '#8e44ad', fill: false },
        { label: '장비 2 온도 (°C)', data: [62, 64, 65, 66, 68, 69], borderColor: '#2980b9', fill: false },
      ],
    }

    return {
      tabs: ['D02', 'D07', 'D14', 'D20'],
      currentTab: 'D02',
      userMode: 'general',
      isAuthenticated: false,
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
          adminChartData
        },
        D07: {
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
          defects: initialDefects.D07,
          adminChartData
        },
        D14: {
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
          defects: initialDefects.D14,
          adminChartData
        },
        D20: {
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
          defects: initialDefects.D20,
          adminChartData
        },
      },
    }
  },
  created() {
    const token = localStorage.getItem('authToken')
    const userRole = localStorage.getItem('userRole')
    if (token && userRole) {
      this.isAuthenticated = true
      this.userMode = userRole
    }
  },
  methods: {
    async handleLogin({ username, password }) {
      try {
        const { user } = await apiLogin(username, password)
        localStorage.setItem('authToken', 'mock-jwt-token')
        localStorage.setItem('userRole', user.role)
        this.isAuthenticated = true
        this.userMode = user.role
      } catch (error) {
        alert(error.message)
      }
    },
    handleLogout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      this.isAuthenticated = false
      this.userMode = 'general'
    },
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
/* Global styles */
#app-container {
  height: 100vh;
}

.main-layout {
  display: flex;
  height: 100%;
}

#app {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar {
  width: 120px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
}

.tabs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
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

.sidebar-footer {
  padding: 15px;
  text-align: center;
}

.auth-button {
  background-color: #4a627a;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.auth-button:hover {
  background-color: #5c7a99;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background: #ecf0f1;
  overflow-y: auto;
}
</style>