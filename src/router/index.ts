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


/**
 * This function is called before each route change.
 * it sets the title of the page to the title defined in the route's meta.
 * It checks if the user is authenticated and if the route requires authentication.
 * If the user is not authenticated and the route requires authentication, the user is redirected to the login page.
 * If the user is authenticated and tries to access the login page, the user is redirected to the admin page.
 * @param to The route the user is going to
 * @param from The route the user is coming from
 * @param next The function to call to continue the navigation
 */
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuth = authStore.isLoggedIn;
    document.title = to.meta.title as string;

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

