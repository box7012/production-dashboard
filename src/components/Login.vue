<template>
  <div class="login-modal-overlay" @click.self="$emit('close')">
    <div class="login-modal-content">
      <h2>로그인</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">사용자 이름:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <div class="button-group">
          <button type="submit" :disabled="loading">{{ loading ? '로그인 중...' : '로그인' }}</button>
          <button type="button" @click="$emit('close')">닫기</button>
        </div>
      </form>
      <div class="demo-credentials">
        <p><strong>테스트 계정:</strong></p>
        <p>아이디: admin</p>
        <p>비밀번호: password</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginModal',
  emits: ['login', 'close'],
  data() {
    return {
      username: '',
      password: '',
      error: null,
      loading: false,
    }
  },
  methods: {
    async handleLogin() {
      this.error = null
      this.loading = true
      try {
        // Emit the login event with credentials
        this.$emit('login', { username: this.username, password: this.password })
      } catch (err) {
        // This catch block might not be necessary if error is handled in parent
        this.error = err.message || '로그인 처리 중 오류가 발생했습니다.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.demo-credentials {
  margin-top: 20px;
  padding: 10px;
  background-color: #f3f3f3;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
