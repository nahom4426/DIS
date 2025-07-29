import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from './pages/AuthPage.vue'
import Dashboard from './pages/Dashboard.vue'

const routes = [
  {
    path: '/doctor-comm',
    redirect: '/doctor-comm/auth'
  },
  {
    path: '/doctor-comm/auth',
    name: 'DoctorAuth',
    component: AuthPage
  },
  {
    path: '/doctor-comm/dashboard',
    name: 'DoctorDashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = localStorage.getItem('doctorCommUser')
    if (!user) {
      next('/doctor-comm/auth')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router