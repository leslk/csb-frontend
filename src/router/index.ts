import { createRouter, createWebHistory } from 'vue-router'
import adminRouter from './admin.router';
import { useAuthStore } from '@/stores/auth';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: () => {
        const hostname = window.location.hostname;
        if (hostname.includes('admin')) {
          return { name: 'AdminHome' }
        }
        return { name: 'home' }
      }
    },
    adminRouter,
  ]
  
})



router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isLoggedIn;
  
  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'Login' });
  } else {
    next();
  } 
});

export default router;

