export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        console.log('Mock Auth: Login successful for ADMIN');
        resolve({
          success: true,
          token: 'mock-jwt-token-for-admin-user',
          user: {
            name: 'Admin User',
            role: 'admin',
            line: 'none',
          },
        });
      } else if (username === 'user14' && password === 'password') {
        console.log('Mock Auth: Login successful for GENERAL user');
        resolve({
          success: true,
          token: 'mock-jwt-token-for-general-user',
          user: {
            name: 'General User',
            role: 'general',
            line: 'D14',
          },
        });
      } else if (username === 'user20' && password === 'password') {
        console.log('Mock Auth: Login successful for GENERAL user');
        resolve({
          success: true,
          token: 'mock-jwt-token-for-general-user',
          user: {
            name: 'General User',
            role: 'general',
            line: 'D20',
          },
        });
      } else if (username === 'superadmin' && password === 'password') {
        console.log('Mock Auth: Login successful for SUPERADMIN');
        resolve({
          success: true,
          token: 'mock-jwt-token-for-superadmin-user',
          user: {
            name: 'Super Admin',
            role: 'superadmin',
            line: 'none',
          },
        });
      } else {
        console.error('Mock Auth: Invalid credentials');
        reject(new Error('아이디 또는 비밀번호가 잘못되었습니다.'));
      }
    }, 500);
  });
};