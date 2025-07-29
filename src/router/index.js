import MainLayout from "@/layouts/MainLayout.vue";
import { useBreadcrumb } from "@/stores/breadCrumbsStore";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import { useAuthStore } from "@/stores/auth";
import requestRoutes from "./Requests.routes";
import HomeRoutes from "./dashboard1.routes";
import Dashboard from "@/features/Dashboard/pages/Dashboard.vue";

// import institutionRoutes from "./institution.routes";
import adminRoutes from "./admin.routes";
import providerRoutes from "./Provider.routes";

import Profile from '@/components/ProfilePage.vue'

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
       
     
       
      ],
    },
  ]),
});

router.beforeEach((to, from, next) => {
  const routes = to.matched.reduce((routes, route) => {
    if(routes.find(el => el.name == route.name)) return routes
    const routesSplit = route.path.split('/')
    const path = routesSplit.reduce((state, el, idx) => {
      const res = el.startsWith(":")
      if(res) {
        const name = el.match(/:([a-zA-Z]+)/)?.[1]
        console.log(name, to.params[name])
        state.push(to.params[name])
      } else {
        state.push(el)
      }
      return state
    }, [])
    routes.push({
      name: route.name,
      path: path.join('/'),
    })
    return routes
  }, [])

  const breadcrumb = useBreadcrumb()

  breadcrumb.breadcrumbs = routes
  next()
})

router.beforeEach(async (to, from) => {
  // Temporarily bypass login - go directly to dashboard
  if (to.path === '/login') {
    return { path: '/dashboard' };
  }
  
  if (to.path === '/') {
    return { path: '/dashboard' };
  }
  
  // Allow all other routes without authentication
  return true;
});

export default router;

