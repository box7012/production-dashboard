export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        console.log('Mock Auth: Login successful');
        resolve({
          success: true,
          token: 'mock-jwt-token-for-admin-user',
          user: {
            name: 'Admin User',
            role: 'admin',
          },
        });
      } else {
        console.error('Mock Auth: Invalid credentials');
        reject(new Error('아이디 또는 비밀번호가 잘못되었습니다.'));
      }
    }, 500);
  });
};
