<template>
  <div class="superadmin-dashboard">
    <h1>슈퍼 관리자 페이지</h1>
    <p>여기서 시스템 전체 관리 기능을 구현할 수 있습니다.</p>
    <ul>
      <li>사용자 관리</li>
      <li>권한 설정</li>
      <li>전체 통계 보기</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SuperAdminDashboard",
};
</script>

<style scoped>
.superadmin-dashboard {
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background: #f7f9fc;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.superadmin-dashboard h1 {
  color: #e74c3c;
  margin-bottom: 20px;
}
.superadmin-dashboard ul {
  list-style: none;
  padding: 0;
}
.superadmin-dashboard li {
  margin: 10px 0;
  font-weight: bold;
}
</style>