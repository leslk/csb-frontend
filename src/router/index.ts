import { createRouter, createWebHistory } from 'vue-router';
import adminRouter from './admin.router';
import userRouter from './user.router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '',
            redirect: () => {
                const url = window.location.origin;
                if (url.includes('admin')) {
                    return { name: 'Admin' };
                }
                return { name: 'Accueil' };
            }
        },
        adminRouter,
        userRouter
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuth = authStore.isLoggedIn;

    if (to.meta.requiresAuth && !isAuth) {
        router.push({ name: 'Login' });
    } else {
        if (to.name === 'Login' && isAuth) {
            next({ name: 'Admin' });
        }
        next();
    }
});

export default router;

