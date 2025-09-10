import MainLayout from "@/layouts/MainLayout.vue";
import { useBreadcrumb } from "@/stores/breadCrumbsStore";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import { useAuthStore } from "@/stores/auth";
import requestRoutes from "./Requests.routes";
import HomeRoutes from "./dashboard1.routes";
import Dashboard from "@/features/Dashboard/pages/Dashboard.vue";
import doctorCommunicationRoutes from '@/features/doctor-communication/routes';
import registrationRequestRoutes from "./registrationRequest.routes"
import QuestionUpdate from '@/features/service/pages/QuestionUpdate.vue';


// import institutionRoutes from "./institution.routes";
import adminRoutes from "./admin.routes";
import providerRoutes from "./Provider.routes";

import Profile from '@/components/ProfilePage.vue'

// Debug and create safe routes
console.log('doctorCommunicationRoutes:', doctorCommunicationRoutes)
const safeRoutes = Array.isArray(doctorCommunicationRoutes) ? doctorCommunicationRoutes : []

function addMetaToRoutes(routes) {
  return routes.map(route => {
    // If the route has a privilege property in its meta, make sure it's also marked as requiresAuth
    if (route.meta?.privilege && !route.meta.requiresAuth) {
      route.meta.requiresAuth = true;
    }
    
    // If the route has children, process them recursively
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
      path: "",
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
        ...providerRoutes,
        ...requestRoutes,
        ...HomeRoutes,
        ...registrationRequestRoutes,
          {
            path: '/service/question/:id',
            name: 'QuestionDetail',
            component: () => import('@/features/service/pages/QuestionDetail.vue'),
          },
      ],
    },
    
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: () => import('@/features/profile/pages/ChangePasswordPage.vue'),
    },
    {
      path: '/',
      redirect: '/doctor-comm/dashboard'
    }
  ]),
});
router.beforeEach((to, from, next) => {
  const routes = to.matched.reduce((routes, route) => {
    if (routes.find(el => el.name === route.name)) return routes;

    const routesSplit = route.path.split('/');
    const path = routesSplit.reduce((state, el) => {
      if (el.startsWith(":")) {
        const name = el.match(/:([a-zA-Z]+)/)?.[1];
        state.push(encodeURIComponent(to.params[name]) || '');
      } else {
        state.push(el);
      }
      return state;
    }, []);

    if (route.name) {
      routes.push({
        name: route.name,
        path: path.join('/'),
      });
    }

    return routes;
  }, []);

  const breadcrumb = useBreadcrumb();
  breadcrumb.breadcrumbs = routes;

  next();
});

router.beforeEach(() => {
  const auth = useAuthStore();
  const storedUser = localStorage.getItem("userDetail");
  
  auth.setAuth(storedUser ? JSON.parse(storedUser) : {});
});

export default router;


