import MainLayout from "@/layouts/MainLayout.vue";
import { useBreadcrumb, type BreadcrumbRoutes } from "@/stores/breadCrumbsStore";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import { useAuthStore } from "@/stores/auth";

import Dashboard from "@/features/Dashboard/pages/Dashboard.vue";

import doctorCommunicationRoutes from '@/features/doctor-communication/routes'

// import institutionRoutes from "./institution.routes";
import adminRoutes from "./admin.routes";
import providerRoutes from "./Provider.routes";
import registrationRequestRoutes from "./registrationRequest.routes"



import Profile from "@/features/profile/pages/profile.vue";

// Debug and create safe routes
console.log('doctorCommunicationRoutes:', doctorCommunicationRoutes)
const safeRoutes = Array.isArray(doctorCommunicationRoutes) ? doctorCommunicationRoutes : []

function addMetaToRoutes(routes: any[]) {
  return routes.map(route => {
    if (route.meta?.privilege && !route.meta.requiresAuth) {
      route.meta.requiresAuth = true;
    }
    
    if (route.children) {
      route.children = addMetaToRoutes(route.children);
    }
    
    return route;
  });
}

const router = createRouter({
  history: createWebHistory(),
  routes: addMetaToRoutes([
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    
    // Independent Doctor Communication System - using safe routes
    ...safeRoutes,
    
    {
      path: "/main",
      name: "home",
      component: MainLayout,
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: '/profile',
          name: 'profile',
          component: Profile,
        },
        
        ...adminRoutes,
        // ...instutionSetingRoutes, // Fix typo if this exists
        ...registrationRequestRoutes,
      ],
    },
    
    {
      path: '/',
      redirect: '/doctor-comm/dashboard'
    }
  ]),
});

router.beforeEach((to, from, next) => {
  const routes = to.matched.reduce((routes: BreadcrumbRoutes[], route) => {
    if(routes.find(el => el.name == route.name)) return routes
    const routesSplit = route.path.split('/')
    const path = routesSplit.reduce((state: string[], el, idx) => {
      const res = el.startsWith(":")
      if(res) {
        const name = el.match(/:([a-zA-Z]+)/)?.[1]
        state.push(encodeURIComponent(to.params[name as string] as string) as string)
      } else {
        state.push(el)
      }
      return state
    }, [])
    if(route.name) {
      routes.push({
        name: route.name as string,
        path: path.join('/'),
      })
    }
    return routes
  }, [])

  const breadcrumb = useBreadcrumb()

  breadcrumb.breadcrumbs = routes
  next()
})

router.beforeEach(() => {
  const auth = useAuthStore()
  let storedUser = localStorage.getItem("userDetail");

  auth.setAuth((storedUser ? JSON.parse(storedUser) : {}) as LoginResponse)
})


export default router;












