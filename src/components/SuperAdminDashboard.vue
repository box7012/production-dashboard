<template>
  <div class="superadmin-dashboard">
    <h1>슈퍼 관리자 페이지</h1>

    <div class="dashboard-container">
      <!-- 왼쪽 사이드 탭 -->
      <div class="tabs-vertical">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-button', { active: currentTab === tab }]"
          @click="currentTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- 오른쪽 컨텐츠 영역 -->
      <div class="tab-content">
        <div v-if="currentTab === '사용자 관리'">
          <UserManagement/>
        </div>

        <div v-if="currentTab === '권한 설정'">
          <p>여기서 권한 설정 기능을 구현할 수 있습니다.</p>
        </div>

        <div v-if="currentTab === '데이터 다운로드'">
          <p>라인별 데이터</p>
          <FileDownloadTable :currentTab="'전체 현황'" />
        </div>

        <div v-if="currentTab === '모니터링'">
          <p>모니터링</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import FileDownloadTable from '../components/FileDownloadTable.vue';
import UserManagement from '../components/UserManagement.vue';

export default {
  name: "SuperAdminDashboard",
  components: { FileDownloadTable, UserManagement },

  data() {
    return {
      tabs: ["사용자 관리", "권한 설정", "데이터 다운로드", "모니터링"],
      currentTab: "사용자 관리"
    };
  }
};
</script>

<style scoped>
.superadmin-dashboard {
  max-width: 1000px;
  margin: 50px auto;
  padding: 20px;
  background: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.superadmin-dashboard h1 {
  color: #e74c3c;
  margin-bottom: 20px;
  text-align: center;
}

/* 전체 레이아웃: 왼쪽 탭 + 오른쪽 콘텐츠 */
.dashboard-container {
  display: flex;
  min-height: 400px;
}

/* 왼쪽 탭 */
.tabs-vertical {
  display: flex;
  flex-direction: column;
  width: 180px;
  background: #eee;
  border-radius: 10px 0 0 10px;
  padding: 10px;
}
.tab-button {
  padding: 12px 15px;
  border: none;
  background: #ddd;
  cursor: pointer;
  margin-bottom: 8px;
  border-radius: 5px;
  font-weight: bold;
  text-align: left;
  transition: background 0.3s;
}
.tab-button:hover {
  background: #ccc;
}
.tab-button.active {
  background: #fff;
  border-left: 4px solid #e74c3c;
  font-weight: bold;
}

/* 오른쪽 콘텐츠 */
.tab-content {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 0 10px 10px 0;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
}
</style>
