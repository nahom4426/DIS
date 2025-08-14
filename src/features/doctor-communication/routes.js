import MainLayout from '@/layouts/MainLayout.vue'
import DoctorCommDashboard from './pages/DoctorCommDashboard.vue'
import InquiryHistory from './pages/InquiryHistory.vue'
import DrugLookup from './pages/DrugLookup.vue'
import RespondToInquiry from './pages/RespondToInquiry.vue'
import ProfileInfo from "@/features/profile/pages/profile.vue"
import signUp from './pages/signup.vue'

export default [
{ path:'/doctor-comm/signup',
  name:'signup',
  component:signUp,
},
  {
    path: '/doctor-comm',
    component: MainLayout,
    children: [
         {
        path: '',
        redirect: '/doctor-comm/dashboard'
      },

      {
        path: 'dashboard',
        name: 'DoctorCommDashboard',
        component: DoctorCommDashboard,
      },
      {
        path: 'history',
        name: 'InquiryHistory',
        component: InquiryHistory,
      },
      {
        path: 'drug-lookup',
        name: 'DrugLookup',
        component: DrugLookup,
      },
      {
        path: 'respond/:id',
        name: 'RespondToInquiry',
        component: RespondToInquiry,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileInfo,
      },
    ],
  },
]


