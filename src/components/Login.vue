<template>
  <div class="login-view-container">
    <div class="login-box">
      <img src="../assets/hj_logo.png" alt="HJ Logo" class="logo" />
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
        <button type="submit" :disabled="loading" class="login-button">
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
        <button type="button" @click="goToSignup" class="login-button">
          회원가입
        </button>
      </form>

      <div class="demo-credentials">
        <p><strong>테스트 계정:</strong></p>
        <p>아이디: superadmin / 비밀번호: password</p>
        <p>아이디: admin / 비밀번호: password</p>
        <p>아이디: user / 비밀번호: password</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  emits: ['login'],
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
      this.error = null;
      this.loading = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy authentication logic based on provided test accounts
        if (
          (this.username === 'superadmin' && this.password === 'password') ||
          (this.username === 'admin' && this.password === 'password') ||
          (this.username === 'user' && this.password === 'password')
        ) {
          // Store user info in session storage to persist login state
          sessionStorage.setItem('user', JSON.stringify({ username: this.username }));

          if (this.username === 'superadmin') {
            this.$router.push('/superadmin');
          } else {
            this.$router.push('/dashboard');
          }
        } else {
          this.error = '잘못된 사용자 이름 또는 비밀번호입니다.';
        }
      } catch (err) {
        this.error = err.message || '로그인 처리 중 오류가 발생했습니다.';
      } finally {
        this.loading = false;
      }
    },
    goToSignup() {
      this.$router.push('/signup')
    }
  },
}
</script>

<style scoped>
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
}

.logo {
  user-select: none;     /* 텍스트 선택 막기 */
  pointer-events: none;  /* 마우스 이벤트 무시 */
}

.login-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;  /* 뷰포트 높이 100% */
  width: 100vw;   /* 뷰포트 너비 100% */
  background-color: #f0f2f5;
}

.login-box {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 15px;
}

.login-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #2c3e50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}

.login-button:hover {
  background-color: #34495e;
}

.demo-credentials {
  padding: 10px;
  background-color: #f3f3f3;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>