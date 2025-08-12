<template>
  <div id="app-container">
    <LoginView v-if="!isAuthenticated" @login="handleLogin" />
    <div v-else class="main-layout">
      <aside class="sidebar">
        <img src="./assets/hj_logo.png" alt="HJ Logo" class="logo" />
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
        <div v-if="userMode !== 'admin'" class="work-mode-selection">
          <label>작업 모드 선택 : </label>
          <button
            :class="{ active: workMode === 'production_manager' }"
            @click="setWorkMode('production_manager')"
          >
            생산 관리
          </button>
          <button
            :class="{ active: workMode === 'worker' }"
            @click="setWorkMode('worker')"
          >
            작업자
          </button>
        </div>
        <!-- admin인 경우에만 보이는 기존 콘텐츠 -->
        <div v-if="userMode === 'admin' || (userMode === 'general' && workMode === 'production_manager')">
          <DefectCheck 
            :current-range="currentTab === '전체 현황' ? overallTimeRange : dashboardData[currentTab]?.defects?.selectedTimeRange || 'daily'"
            @update:timeRange="handleTimeRangeChange"
          />
          <ProductionSummary v-if="currentTab === '전체 현황'" :summary-data="summaryChartData" />
          <div v-else-if="dashboardData[currentTab]">
            <Dashboard
              :title="currentTab"
              :cards="dashboardData[currentTab].cards"
            />
            <EntireCheck 
              v-if="dashboardData[currentTab].entireCheck"
              :chartData="dashboardData[currentTab].entireCheck.chartData"
            />
            <CenterPointCheck 
              v-if="dashboardData[currentTab].centerPointCheck"
              :chartData="dashboardData[currentTab].centerPointCheck.chartData"
            />
            <DefectChart
              :defectChartData="dashboardData[currentTab].defects.chartData" 
              :selectedDefectType="dashboardData[currentTab].defects.selectedDefect" 
              :defectTypes="dashboardData[currentTab].defects.defectTypes" 
              :adminChartData="dashboardData[currentTab].adminChartData"
              :userMode="userMode"
              @update:targetProd="handleUpdateTargetProd"
              @update:defectType="handleDefectChange"
            />
            <OCRCheck 
              v-if="dashboardData[currentTab].ocrCheck"
              :chartData="dashboardData[currentTab].ocrCheck.chartData"
            />
            <SurfaceCheck 
              v-if="dashboardData[currentTab].surfaceCheck"
              :chartData="dashboardData[currentTab].surfaceCheck.chartData"
            />
            <ChamferCheck 
              v-if="dashboardData[currentTab].chamferCheck"
              :chartData="dashboardData[currentTab].chamferCheck.chartData"
            />
          </div>
          <FileDownloadTable v-if="userMode === 'admin'" :currentTab="currentTab" />
        </div>
          <template v-else-if="workMode === 'worker'">
            <WorkerImageViewerVue 
              :key="workMode"
              :tab="currentTab" 
            />
          </template>
      </section>
    </div>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue';
import DefectChart from './components/DefectChart.vue';
import FileDownloadTable from './components/FileDownloadTable.vue';
import LoginView from './components/Login.vue' // The file is Login.vue, but component name is LoginView
import ProductionSummary from './components/ProductionSummary.vue'
import DefectCheck from './components/DefectCheck.vue'
import ChamferCheck from './components/ChamferCheck.vue'
import OCRCheck from './components/OCRCheck.vue'
import SurfaceCheck from './components/SurfaceCheck.vue'
import EntireCheck from './components/EntireCheck.vue'
import { login as apiLogin } from './services/auth.js'
import WorkerImageViewerVue from './components/WorkerImageViewer.vue';
import CenterPointCheck from './components/CenterPointCheck.vue';

// --- 샘플 데이터 생성 로직 ---
const generateWeeklyData = (isDefect = false) => {
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth() + 1}-${d.getDate()}`);
  }

  if (isDefect) {
    const defectTypes = ['honing', 'bubble', 'dent', 'honing_missing', 'crack', 'burst'];
    const data = {};
    defectTypes.forEach(type => {
      data[type] = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20));
    });
    return { labels, data };
  } else {
    // 일반 체크 항목 (OK/NG)
    const okCount = Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000) + 500);
    const ngCount = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 5);
    return { labels, okCount, ngCount };
  }
};

// 월간 데이터 생성 (작년 동월부터 이번 달까지)
const generateMonthlyData = (isDefect = false) => {
  const labels = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  if (isDefect) {
    const defectTypes = ['honing', 'bubble', 'dent', 'honing_missing', 'crack', 'burst'];
    const data = {};
    defectTypes.forEach(type => {
      data[type] = Array.from({ length: 12 }, () => Math.floor(Math.random() * 200));
    });
    return { labels, data };
  } else {
    // 일반 체크 항목 (OK/NG)
    const okCount = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10000) + 5000);
    const ngCount = Array.from({ length: 12 }, () => Math.floor(Math.random() * 500) + 50);
    return { labels, okCount, ngCount };
  }
};

// 카드 데이터 생성 함수
const generateCardData = (timeRange) => {
  let productionValue, operatingRate, defectRate;
  let prodChartLabels, prodChartData, opRateChartLabels, opRateChartData, defRateChartLabels, defRateChartData;

  switch (timeRange) {
    case 'weekly':
      productionValue = Math.floor(Math.random() * 10000) + 5000; // 주간 생산량
      operatingRate = `${(Math.random() * 5 + 80).toFixed(1)}%`; // 주간 가동률
      defectRate = `${(Math.random() * 0.5 + 1.5).toFixed(1)}%`; // 주간 불량률

      prodChartLabels = ['월', '화', '수', '목', '금', '토', '일'];
      prodChartData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 1500) + 500);
      opRateChartLabels = prodChartLabels;
      opRateChartData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10) + 80);
      defRateChartLabels = prodChartLabels;
      defRateChartData = Array.from({ length: 7 }, () => (Math.random() * 0.5 + 1.5).toFixed(1));
      break;
    case 'monthly':
      productionValue = Math.floor(Math.random() * 50000) + 20000; // 월간 생산량
      operatingRate = `${(Math.random() * 3 + 85).toFixed(1)}%`; // 월간 가동률
      defectRate = `${(Math.random() * 0.3 + 1.0).toFixed(1)}%`; // 월간 불량률

      prodChartLabels = ['1주', '2주', '3주', '4주'];
      prodChartData = Array.from({ length: 4 }, () => Math.floor(Math.random() * 15000) + 5000);
      opRateChartLabels = prodChartLabels;
      opRateChartData = Array.from({ length: 4 }, () => Math.floor(Math.random() * 5) + 85);
      defRateChartLabels = prodChartLabels;
      defRateChartData = Array.from({ length: 4 }, () => (Math.random() * 0.3 + 1.0).toFixed(1));
      break;
    default: // daily
      productionValue = Math.floor(Math.random() * 1500) + 500; // 오늘 생산량
      operatingRate = `${(Math.random() * 10 + 75).toFixed(1)}%`; // 오늘 가동률
      defectRate = `${(Math.random() * 1.0 + 1.0).toFixed(1)}%`; // 오늘 불량률

      prodChartLabels = ['0시', '6시', '12시', '18시', '24시'];
      prodChartData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 300) + 100);
      opRateChartLabels = prodChartLabels;
      opRateChartData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 15) + 70);
      defRateChartLabels = prodChartLabels;
      defRateChartData = Array.from({ length: 5 }, () => (Math.random() * 1.0 + 1.0).toFixed(1));
      break;
  }

  return [
    {
      title: '생산량',
      value: productionValue,
      unit: '개',
      targetProd: timeRange === 'daily' ? 2000 : (timeRange === 'weekly' ? 10000 : 50000),
      chartData: { labels: prodChartLabels, datasets: [{ data: prodChartData }] },
    },
    { title: '가동률', value: operatingRate, chartData: { labels: opRateChartLabels, datasets: [{ data: opRateChartData }] } },
    { title: '불량률', value: defectRate, chartData: { labels: defRateChartLabels, datasets: [{ data: defRateChartData }] } },
  ];
};

// --- 차트 데이터 생성 로직 ---
const generateCheckChartData = (checkData, timeRange, isDefectChart = false) => {
  if (!checkData) return null;

  let labels, okData, ngData, defectData, totalData;

  if (isDefectChart) {
    const { selectedDefect } = checkData;
    switch (timeRange) {
      case 'weekly':
        labels = checkData.weekly.labels;
        defectData = checkData.weekly.data[selectedDefect];
        totalData = defectData.map(d => d + Math.floor(Math.random() * 500 + 200));
        break;
      case 'monthly':
        labels = checkData.monthly.labels;
        defectData = checkData.monthly.data[selectedDefect];
        totalData = defectData.map(d => d + Math.floor(Math.random() * 5000 + 2000));
        break;
      default: // daily
        labels = checkData.daily.labels;
        defectData = checkData.daily.byLine[selectedDefect];
        totalData = checkData.daily.totalByHour;
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
  } else {
    // 일반 체크 항목 (OK/NG)
    switch (timeRange) {
      case 'weekly':
        labels = checkData.weekly.labels;
        okData = checkData.weekly.okCount;
        ngData = checkData.weekly.ngCount;
        break;
      case 'monthly':
        labels = checkData.monthly.labels;
        okData = checkData.monthly.okCount;
        ngData = checkData.monthly.ngCount;
        break;
      default: // daily
        labels = checkData.daily.labels;
        okData = checkData.daily.okCount;
        ngData = checkData.daily.ngCount;
        break;
    }
    return {
      labels,
      datasets: [
        { label: 'OK', data: okData, backgroundColor: '#4caf50' },
        { label: 'NG', data: ngData, backgroundColor: '#f87979' },
      ],
    };
  }
};

export default {
  name: 'App',
  components: { Dashboard, LoginView, FileDownloadTable, ProductionSummary, DefectCheck, ChamferCheck, OCRCheck, SurfaceCheck, WorkerImageViewerVue, EntireCheck, DefectChart, CenterPointCheck },
  data() {
    const weeklyDataForDefects = generateWeeklyData(true);
    const monthlyDataForDefects = generateMonthlyData(true);

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
      weekly: weeklyDataForDefects,
      monthly: monthlyDataForDefects
    }
    const initialDefects = {
      D02: { ...baseDefectData, selectedDefect: 'honing', selectedTimeRange: 'daily' },
      D07: { ...baseDefectData, selectedDefect: 'honing', selectedTimeRange: 'daily' },
      D14: { ...baseDefectData, selectedDefect: 'honing', selectedTimeRange: 'daily' },
      D20: { ...baseDefectData, selectedDefect: 'honing', selectedTimeRange: 'daily' },
    }
    Object.values(initialDefects).forEach(defects => {
      defects.chartData = generateCheckChartData(defects, defects.selectedTimeRange, true) // 초기 로딩은 daily
    })

  

    // 새로운 체크 항목 데이터
    const initialChamferCheck = {
      daily: { labels: baseDefectData.daily.labels, okCount: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000) + 500), ngCount: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 1) },
      weekly: generateWeeklyData(false),
      monthly: generateMonthlyData(false),
    };
    initialChamferCheck.chartData = generateCheckChartData(initialChamferCheck, initialDefects.D02.selectedTimeRange, false); // D02의 초기 시간 범위 사용

    const initialOCRCheck = {
      daily: { labels: baseDefectData.daily.labels, okCount: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000) + 500), ngCount: Array.from({ length: 24 }, () => Math.floor(Math.random() * 5) + 1) },
      weekly: generateWeeklyData(false),
      monthly: generateMonthlyData(false),
    };
    initialOCRCheck.chartData = generateCheckChartData(initialOCRCheck, initialDefects.D02.selectedTimeRange, false); // D02의 초기 시간 범위 사용

    const initialSurfaceCheck = {
      daily: { labels: baseDefectData.daily.labels, okCount: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000) + 500), ngCount: Array.from({ length: 24 }, () => Math.floor(Math.random() * 15) + 1) },
      weekly: generateWeeklyData(false),
      monthly: generateMonthlyData(false),
    };
    initialSurfaceCheck.chartData = generateCheckChartData(initialSurfaceCheck, initialDefects.D02.selectedTimeRange, false); // D02의 초기 시간 범위 사용

    const initialEntireCheck = {
      daily: { labels: baseDefectData.daily.labels, okCount: Array.from({ length: 24}, () => Math.floor(Math.random() * 1000) + 500), ngCount: Array.from({ length: 24 }, () => Math.floor(Math.random() * 15) + 1) },
      weekly: generateWeeklyData(false),
      monthly: generateMonthlyData(false),
    };
    initialEntireCheck.chartData = generateCheckChartData(initialEntireCheck, initialDefects.D02.selectedTimeRange, false); // D02의 초기 시간 범위 사용

    const initialCenterPointCheck = {
      daily: { labels: baseDefectData.daily.labels, okCount: Array.from({ length: 24}, () => Math.floor(Math.random() * 1000) + 500), ngCount: Array.from({ length: 24 }, () => Math.floor(Math.random() * 15) + 1) },
      weekly: generateWeeklyData(false),
      monthly: generateMonthlyData(false),
    };
    initialCenterPointCheck.chartData = generateCheckChartData(initialCenterPointCheck, initialDefects.D02.selectedTimeRange, false); // D02의 초기 시간 범위 사용



    return {
      tabs: ['전체 현황', 'D02', 'D07', 'D14', 'D20'],
      currentTab: '전체 현황',
      userMode: 'general',
      isAuthenticated: false,
      overallTimeRange: 'daily', // 전체 현황 탭을 위한 시간 범위
      dashboardData: {
        D02: {
          cards: generateCardData('daily'),
          defects: initialDefects.D02,
          chamferCheck: initialChamferCheck,
          ocrCheck: initialOCRCheck,
          surfaceCheck: initialSurfaceCheck,
          entireCheck: initialEntireCheck,
          centerPointCheck: initialCenterPointCheck,
        },
        D07: {
          cards: generateCardData('daily'),
          defects: initialDefects.D07,
          chamferCheck: initialChamferCheck,
          ocrCheck: initialOCRCheck,
          surfaceCheck: initialSurfaceCheck,
          entireCheck: initialEntireCheck,
          centerPointCheck: initialCenterPointCheck,
        },
        D14: {
          cards: generateCardData('daily'),
          defects: initialDefects.D14,
          chamferCheck: initialChamferCheck,
          ocrCheck: initialOCRCheck,
          surfaceCheck: initialSurfaceCheck,
          entireCheck: initialEntireCheck,
          centerPointCheck: initialCenterPointCheck,
        },
        D20: {
          cards: generateCardData('daily'),
          defects: initialDefects.D20,
          chamferCheck: initialChamferCheck,
          ocrCheck: initialOCRCheck,
          surfaceCheck: initialSurfaceCheck,
          entireCheck: initialEntireCheck,
          centerPointCheck: initialCenterPointCheck,
        },
        workMode: 'production_manager', 
      },
    }
  },
  computed: {
    summaryChartData() {
      const labels = ['D02', 'D07', 'D14', 'D20'];
      const productionData = [];
      const targetData = [];

      // overallTimeRange에 맞춰 각 라인의 카드 데이터를 새로 생성
      const cardsForOverallRange = generateCardData(this.overallTimeRange);
      const productionCard = cardsForOverallRange.find(c => c.title === '생산량');

      // labels 배열의 각 항목에 대해 데이터 추가
      for (let i = 0; i < labels.length; i++) {
        if (productionCard) {
          productionData.push(productionCard.value);
          targetData.push(productionCard.targetProd);
        } else {
          productionData.push(0);
          targetData.push(0);
        }
      }

      return {
        labels,
        datasets: [
          {
            label: '생산량',
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

        if (this.userMode === 'admin') {
          this.workMode = 'production_manager'  // 관리자면 무조건 production_manager
        }

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
        defects.chartData = generateCheckChartData(defects, defects.selectedTimeRange, true)
      }
    },
    handleTimeRangeChange(newRange) {
      if (this.currentTab === '전체 현황') {
        this.overallTimeRange = newRange;
        // summaryChartData는 computed 속성이므로 overallTimeRange 변경 시 자동 업데이트됩니다.
      } else {
        const currentDashboardData = this.dashboardData[this.currentTab];
        if (currentDashboardData) {
          // 카드 데이터 업데이트
          currentDashboardData.cards = generateCardData(newRange);

          // 불량 차트 업데이트
          if (currentDashboardData.defects) {
            currentDashboardData.defects.selectedTimeRange = newRange;
            currentDashboardData.defects.chartData = generateCheckChartData(currentDashboardData.defects, newRange, true);
          }
          // ChamferCheck 차트 업데이트
          if (currentDashboardData.chamferCheck) {
            currentDashboardData.chamferCheck.chartData = generateCheckChartData(currentDashboardData.chamferCheck, newRange, false);
          }
          // OCRCheck 차트 업데이트
          if (currentDashboardData.ocrCheck) {
            currentDashboardData.ocrCheck.chartData = generateCheckChartData(currentDashboardData.ocrCheck, newRange, false);
          }
          // SurfaceCheck 차트 업데이트
          if (currentDashboardData.surfaceCheck) {
            currentDashboardData.surfaceCheck.chartData = generateCheckChartData(currentDashboardData.surfaceCheck, newRange, false);
          }
          // entireCheck 차트 업데이트
          if (currentDashboardData.entireCheck) {
            currentDashboardData.entireCheck.chartData = generateCheckChartData(currentDashboardData.entireCheck, newRange, false);
          }
          // entireCheck 차트 업데이트
          if (currentDashboardData.centerPointCheck) {
            currentDashboardData.centerPointCheck.chartData = generateCheckChartData(currentDashboardData.centerPointCheck, newRange, false);
          }
        }
      }
    },
    setWorkMode(mode) {
      this.workMode = mode;
      console.log("changed");

      // 렌더링 트리거용 currentTab 임시 변경
      const oldTab = this.currentTab;

      // 탭을 null로 바꿨다가 다음 틱에 원래 값 복구
      this.currentTab = null;

      this.$nextTick(() => {
        this.currentTab = oldTab;
      });
    }
  },
  watch: {
    currentTab(newTab) {
      if (newTab !== '전체 현황') {
        const currentDashboardData = this.dashboardData[newTab];
        if (currentDashboardData) {
          const timeRangeToApply = currentDashboardData.defects?.selectedTimeRange || 'daily';

          // 모든 차트 데이터 업데이트
          currentDashboardData.cards = generateCardData(timeRangeToApply);

          if (currentDashboardData.defects) {
            currentDashboardData.defects.chartData = generateCheckChartData(currentDashboardData.defects, timeRangeToApply, true);
          }
          if (currentDashboardData.chamferCheck) {
            currentDashboardData.chamferCheck.chartData = generateCheckChartData(currentDashboardData.chamferCheck, timeRangeToApply, false);
          }
          if (currentDashboardData.ocrCheck) {
            currentDashboardData.ocrCheck.chartData = generateCheckChartData(currentDashboardData.ocrCheck, timeRangeToApply, false);
          }
          if (currentDashboardData.surfaceCheck) {
            currentDashboardData.surfaceCheck.chartData = generateCheckChartData(currentDashboardData.surfaceCheck, timeRangeToApply, false);
          }
          if (currentDashboardData.entireCheck) {
            currentDashboardData.entireCheck.chartData = generateCheckChartData(currentDashboardData.entireCheck, timeRangeToApply, false);
          }
          if (currentDashboardData.centerPointCheck) {
            currentDashboardData.centerPointCheck.chartData = generateCheckChartData(currentDashboardData.centerPointCheck, timeRangeToApply, false);
          }
        }
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

.work-mode-selection {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  align-items: center;
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