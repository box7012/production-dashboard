<template>
  <div class="login-view-container">
    <div class="login-box">
      <img src="../assets/hj_logo.png" alt="HJ Logo" class="logo" />
      <h2>회원가입</h2>
      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="">라인</label>
          <select id="line" v-model="line" required>
            <option disabled value="">라인 선택</option>
            <option value="D02">D02</option>
            <option value="D07">D07</option>
            <option value="D14">D14</option>
            <option value="D20">D20</option>
          </select>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button type="submit" class="login-button">회원가입</button>
        <button type="button" @click="goToLogin" class="login-button">로그인</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupPage',
  data() {
    return {
      name: '',
      password: '',
      line: '',
      error: null
    }
  },
  methods: {
    signup() {
      // 회원가입 로직 (예: Spring Boot API 연동)
      console.log("회원가입 데이터:", this.name, this.password, this.line)
    },
    goToLogin() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-view-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
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

.logo {
  user-select: none;
  pointer-events: none;
  margin-bottom: 20px;
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

.form-group select {
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
</style>