<template>
  <div class="dashboard">
    <aside class="sidebar">
      <img src="../assets/hj_logo.png" alt="HJ Logo" class="logo" />
      <ul class="working-tabs-list">
        <li v-for="tab in tabs"
            :key="tab"
            :class="{ active: currentTab === tab }"
            @click="currentTab = tab">
          {{ tab }}
        </li>
      </ul>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="auth-button">로그아웃</button>
      </div>
    </aside>

    <div class="main-container">
      <header class="header">
        <div class="logo">{{ line }} 생산 현황</div>
        <div class="menu">
          <span class="current-time">{{ currentTime }}</span>
        </div>
      </header>

      <main class="main">
        <div v-show="currentTab === '생산 현황'">
          <div class="total-cards">
            <div class="card">
              <div class="card-icon">🎯</div>
              <div class="card-info">
                <div class="card-title">목표 생산량</div>
                <div class="card-value">5,000</div>
              </div>
            </div>

            <div class="card">
              <div class="card-icon">🏭</div>
              <div class="card-info">
                <div class="card-title">현재 생산량</div>
                <div class="card-value">2,348</div>
              </div>
            </div>

            <div class="card">
              <div class="card-icon">❌</div>
              <div class="card-info">
                <div class="card-title">불량품 개수</div>
                <div class="card-value">23</div>
              </div>
            </div>
          </div>

          <div class="charts">
            <div class="chart-container">
              <h3>Mold Status</h3>
              <canvas id="moldStatusChart"></canvas>
            </div>
            <div class="chart-container">
              <h3>Maintenance Cost</h3>
              <canvas id="maintenanceChart"></canvas>
            </div>
            <div class="achievement-rate">
              <h3>Achievement rate</h3>
              <div class="progress-bar">
                <div class="progress" :style="{ width: '60%' }"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 이미지 마킹 탭 -->
        <WorkerImageViewerVue v-show="currentTab === '이미지 마킹'" />

      </main>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import WorkerImageViewerVue from '../components/WorkerImageViewer.vue';

export default {
  name: "WorkerDashboard",
  components: { WorkerImageViewerVue },

  data() {
    return {
      currentTab: '생산 현황', // 초기값 지정
      tabs: ['생산 현황', '이미지 마킹'],
      currentTime: '', // 시간 관리
      line: ''  // 여기에 라인 정보 저장
    }
  },
  methods: {
    updateTime() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      this.currentTime = `${h}:${m}:${s}`;
    },

    handleLogout() {
      sessionStorage.removeItem('user');
      this.$router.push('/');
    },
  },
  mounted() {
    // 시간 업데이트
    this.updateTime();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);

    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        this.line = userObj.line || '라인없음';
      } catch (e) {
        this.line = '라인없음';
        console.error('User 정보 파싱 실패', e);
      }
    } else {
      this.line = '라인없음';
    }

    // Mold Status Chart (Doughnut)
    const moldCtx = document.getElementById("moldStatusChart").getContext("2d");
    new Chart(moldCtx, {
      type: "doughnut",
      data: {
        labels: ["Using", "Waiting", "Repair"],
        datasets: [{
          data: [60, 30, 10],
          backgroundColor: ["#1E90FF", "#A0C4FF", "#FF6B6B"],
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "right" } },
      },
    });

    // Maintenance Cost Chart (Bar)
    const costCtx = document.getElementById("maintenanceChart").getContext("2d");
    new Chart(costCtx, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Cost",
          data: [22, 15, 3, 25, 14, 14, 20],
          backgroundColor: "#1E90FF",
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
};
</script>



<style>
.dashboard {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background-color: white;
  padding: 20px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar .logo {
  width: 120px;
  margin-bottom: 30px;
}

.sidebar-footer {
  margin-top: auto; /* footer를 sidebar 맨 아래로 */
  width: 100%;
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.auth-button {
  width: 90%;
  padding: 10px 0;
  background-color: #FF6B6B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.auth-button:hover {
  background-color: #ff5252;
}

.working-tabs-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.working-tabs-list li {
  padding: 10px 15px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  background-color: #f0f0f0; /* 선택 안 된 탭 배경 */
  color: #333; /* 선택 안 된 탭 글자 */
  transition: all 0.2s;
}

.working-tabs-list li:hover {
  background-color: #e0e7ff; /* hover 시 약간 색 변경 */
}

.working-tabs-list li.active {
  background-color: #1E90FF; /* 선택된 탭 배경 */
  color: white;             /* 선택된 탭 글자 */
  font-weight: bold;
}

/* Main content */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.header .logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: #1E90FF;
}

.header .menu button {
  margin-left: 10px;
}

.current-time {
  font-weight: bold;
  color: #333;
  font-size: 1.5rem; /* 기존보다 크게 */
  min-width: 80px;
  text-align: center;
}

.total-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.total-cards {
  display: flex;
  gap: 25px;
  margin-bottom: 40px;
}

.card {
  background-color: white;
  flex: 1;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
  display: flex;
  gap: 20px;
}

.card-icon {
  font-size: 4.5rem;
  line-height: 1;
  align-self: center; /* 카드 안에서 아이콘 수직 중앙 */
}

.card-info {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 값 중앙 배치 */
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.card-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1E90FF;
}

.charts {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.chart-container, .achievement-rate {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  flex: 1;
  min-width: 250px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}

.progress {
  height: 100%;
  background-color: #1E90FF;
}
</style>
