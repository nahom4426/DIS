import type { RouteRecordRaw } from 'vue-router'
import AuthPage from './pages/AuthPage.vue'
import Dashboard from './pages/Dashboard.vue'

const doctorCommunicationRoutes: RouteRecordRaw[] = [
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

export default doctorCommunicationRoutes