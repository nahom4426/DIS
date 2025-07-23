import { createRouter, createWebHistory } from 'vue-router'
import MainLayout2 from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout2,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/features/Dashboard/pages/Dashboard.vue'),
          meta: {
            title: 'Dashboard',
            description: 'Overview of your medical communications'
          }
        },
        {
          path: '/doctor-requests',
          name: 'doctor-requests',
          component: () => import('@/features/service/pages/sevice.vue'),
          meta: {
            title: 'Doctor Requests',
            description: 'Manage prescription requests from doctors'
          }
        }
      ]
    }
  ]
})

export default router
