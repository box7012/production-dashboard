<template>
  <div class="user-management">
    <h3>사용자 관리</h3>

    <div v-if="loading">데이터를 불러오는 중...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <table v-if="!loading && !error" class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Password</th>
          <th>Line</th>
          <th>Authorization</th>
          <th>Authenticated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.password }}</td>
          <td>{{ user.line }}</td>
          <td>{{ user.authorization }}</td>
          <td>{{ user.is_authenticated }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "UserManagement",
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      backendUrl: "http://192.168.0.95:8081" // 백엔드 URL
    };
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${this.backendUrl}/api/users`);
        if (!response.ok) {
          throw new Error(`HTTP 오류: ${response.status}`);
        }
        const data = await response.json();
        this.users = data;
      } catch (err) {
        console.error(err);
        this.error = "사용자 데이터를 불러오는 데 실패했습니다.";
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th, .user-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
.user-table th {
  background-color: #f0f0f0;
}
.error-message {
  color: red;
  margin-bottom: 10px;
}
</style>