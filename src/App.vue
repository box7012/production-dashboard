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
        <ProductionSummary v-if="currentTab === '전체 현황'" :summary-data="summaryChartData" />
        <div v-else>
          <DefectCheck 
            v-if="dashboardData[currentTab] && dashboardData[currentTab].defects"
            :current-range="defectTimeRange"
            @update:timeRange="handleTimeRangeChange"
          />
          <Dashboard
            v-if="dashboardData[currentTab]"
            :title="currentTab"
            :cards="dashboardData[currentTab].cards"
            :defectChartData="dashboardData[currentTab].defects.chartData" 
            :selectedDefectType="dashboardData[currentTab].defects.selectedDefect" 
            :defectTypes="dashboardData[currentTab].defects.defectTypes" 
            :adminChartData="dashboardData[currentTab].adminChartData"
            :userMode="userMode"
            @update:targetProd="handleUpdateTargetProd"
            @update:defectType="handleDefectChange"
          />
        </div>
        <FileDownloadTable v-if="userMode === 'admin'" />
      </section>
    </div>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue';
import FileDownloadTable from './components/FileDownloadTable.vue';
import LoginView from './components/Login.vue' // The file is Login.vue, but component name is LoginView
import ProductionSummary from './components/ProductionSummary.vue'
import DefectCheck from './components/DefectCheck.vue'

import { login as apiLogin } from './services/auth.js'

// --- 샘플 데이터 생성 로직 ---
const generateWeeklyData = () => {
  const labels = ['월', '화', '수', '목', '금', '토', '일'];
  const defectTypes = ['honing', 'bubble', 'dent', 'honing_missing', 'crack', 'burst'];

  const data = {};
  defectTypes.forEach(type => {
    data[type] = labels.map(() => Math.floor(Math.random() * 50) + 5); // 5~54 사이 불량 개수
  });

  return { labels, data };
};

// 월간 데이터 생성 (작년 동월부터 이번 달까지)
const generateMonthlyData = () => {
  const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}일`);
  const defectTypes = ['honing', 'bubble', 'dent', 'honing_missing', 'crack', 'burst'];

  const data = {};
  defectTypes.forEach(type => {
    data[type] = labels.map(() => Math.floor(Math.random() * 200) + 10); // 10~209 사이 불량 개수
  });

  return { labels, data };
};

// --- 차트 데이터 생성 로직 ---
const generateDefectChartData = (defects, timeRange) => {
  if (!defects) return null;

  let labels, defectData, totalData;
  const { selectedDefect } = defects;

  switch (timeRange) {
    case 'weekly':
      labels = defects.weekly.labels;
      defectData = defects.weekly.data[selectedDefect];
      // 주간 총 생산량은 별도 데이터가 없으므로 불량률 계산은 생략합니다.
      totalData = defectData.map(d => d + Math.floor(Math.random() * 500 + 200)); // 임의의 총생산량
      break;

    case 'monthly':
      labels = defects.monthly.labels;
      defectData = defects.monthly.data[selectedDefect];
      // 월간 총 생산량은 별도 데이터가 없으므로 불량률 계산은 생략합니다.
      totalData = defectData.map(d => d + Math.floor(Math.random() * 5000 + 2000)); // 임의의 총생산량
      break;

    default: // daily
      labels = defects.daily.labels;
      defectData = defects.daily.byLine[selectedDefect];
      totalData = defects.daily.totalByHour;
      break;
  }

  const normalData = totalData.map((total, idx) => Math.max(total - (defectData[idx] || 0), 0));

  return {
    labels,
    datasets: [
      { label: '정상', data: normalData, backgroundColor: '#4caf50' },
      { label: selectedDefect, data: defectData, backgroundColor: '#f87979' },
    ],
  };
};

export default {
  name: 'App',
  components: { Dashboard, LoginView, FileDownloadTable, ProductionSummary, DefectCheck },
  data() {
    const weeklyData = generateWeeklyData();
    const monthlyData = generateMonthlyData();

    const baseDefectData = {
      defectTypes: ['honing', 'bubble', 'dent', 'honing_missing', 'crack', 'burst'],
      daily: {
        labels: [
          '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
          '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ],
        byLine: {
          honing: [5, 8, 3, 6, 4, 2, 7, 5, 6, 3, 8, 5, 5, 8, 3, 6, 4, 2, 7, 5, 6, 3, 8, 5],
          bubble: [2, 4, 5, 1, 3, 6, 2, 4, 5, 1, 3, 2, 2, 4, 5, 1, 3, 6, 2, 4, 5, 1, 3, 2],
          dent: [6, 2, 1, 3, 5, 4, 6, 7, 8, 2, 1, 3, 6, 2, 1, 3, 5, 4, 6, 7, 8, 2, 1, 3],
          honing_missing: [1, 0, 2, 2, 1, 3, 0, 1, 2, 0, 1, 0, 1, 0, 2, 2, 1, 3, 0, 1, 2, 0, 1, 0],
          crack: [6, 2, 1, 3, 2, 1, 4, 5, 3, 2, 1, 4, 6, 2, 1, 3, 2, 1, 4, 5, 3, 2, 1, 4],
          burst: [2, 4, 5, 1, 3, 2, 4, 3, 2, 1, 2, 3, 2, 4, 5, 1, 3, 2, 4, 3, 2, 1, 2, 3],
        },
        totalByHour: [50, 60, 45, 55, 40, 38, 42, 50, 55, 60, 48, 50, 50, 60, 45, 55, 40, 38, 42, 50, 55, 60, 48, 50]
      },
      weekly: weeklyData,
      monthly: monthlyData
    }
    const initialDefects = {
      D02: { ...baseDefectData, selectedDefect: 'honing' },
      D07: { ...baseDefectData, selectedDefect: 'honing' },
      D14: { ...baseDefectData, selectedDefect: 'honing' },
      D20: { ...baseDefectData, selectedDefect: 'honing' },
    }
    Object.values(initialDefects).forEach(defects => {
      defects.chartData = generateDefectChartData(defects, 'daily') // 초기 로딩은 daily
    })
    const adminChartData = {
      labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
      datasets: [
        { label: '장비 1 온도 (°C)', data: [65, 68, 72, 71, 75, 77], borderColor: '#8e44ad', fill: false },
        { label: '장비 2 온도 (°C)', data: [62, 64, 65, 66, 68, 69], borderColor: '#2980b9', fill: false },
      ],
    }

    return {
      tabs: ['전체 현황', 'D02', 'D07', 'D14', 'D20'],
      currentTab: '전체 현황',
      userMode: 'general',
      isAuthenticated: false,
      defectTimeRange: 'daily', // 시간 범위 상태 추가
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
  computed: {
    summaryChartData() {
      const labels = ['D02', 'D07', 'D14', 'D20'];
      const productionData = [];
      const targetData = [];

      labels.forEach(tab => {
        const todayProductionCard = this.dashboardData[tab]?.cards.find(c => c.title === '오늘 생산량');
        if (todayProductionCard) {
          productionData.push(todayProductionCard.value);
          targetData.push(todayProductionCard.targetProd);
        } else {
          productionData.push(0);
          targetData.push(0);
        }
      });

      return {
        labels,
        datasets: [
          {
            label: '오늘 생산량',
            backgroundColor: '#4caf50',
            data: productionData
          },
          {
            label: '목표 생산량',
            backgroundColor: '#f87979',
            data: targetData
          }
        ]
      };
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
        defects.chartData = generateDefectChartData(defects, this.defectTimeRange)
      }
    },
    handleTimeRangeChange(newRange) {
      this.defectTimeRange = newRange;
      const defects = this.dashboardData[this.currentTab]?.defects;
      if (defects) {
        defects.chartData = generateDefectChartData(defects, this.defectTimeRange);
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