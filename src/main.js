import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

// 컴포넌트 import
import LoginView from './components/Login.vue'
import SignupPage from './components/SignupPage.vue'
import TemplateView from './components/TemplateView.vue'
import SuperAdminDashboard from './components/SuperAdminDashboard.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/signup', component: SignupPage },
  { path: '/dashboard', component: TemplateView }, // 로그인 후 메인 레이아웃
  { path: '/superadmin', component: SuperAdminDashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const loggedIn = sessionStorage.getItem('user');
  const publicPages = ['/', '/signup'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !loggedIn) {
    return next('/');
  }

  next();
});

const app = createApp(App)
app.use(router)
app.mount('#app')