import AdminLayout from '@/layout/AdminLayout.vue';
import HomeView from '@/views/HomeView.vue';
import AccountsView from '@/views/AccountsView.vue';
import TournamentsView from '@/views/TournamentsView.vue';
import SiteContentView from '@/views/SiteContentView.vue';
import LoginView from '@/views/LoginView.vue';

const adminRouter = {
    path: '/admin',
    component: AdminLayout,
    meta: {
        title: 'CSB - Admin'
    },
    children: [
        {
            path: '/home',
            name: 'Accueil',
            component: HomeView,
            meta: {
            title: 'Home',
            metaIcon: 'fa-solid fa-house',
            requiresAuth: true
            }
        },
        {
            path: '/accounts',
            name: 'Comptes',
            component: AccountsView,
            meta: {
            title: 'Accounts',
            metaIcon: 'fa-solid fa-user',
            requiresAuth: true
            }
        },
        {
            path: '/tournaments',
            name: 'Tournois',
            component: TournamentsView,
            meta: {
            title: 'Tournaments',
            metaIcon: 'fa-solid fa-trophy',
            requiresAuth: true
            }
        },
        {
            path: '/site-content',
            name: 'Contenu du site',
            component: SiteContentView,
            meta: {
            title: 'Site Content',
            metaIcon: 'fa-solid fa-pager',
            requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginView,
            meta: {
                title: 'Login',
                requiresAuth: false
            }

        }
    ]
}

export default adminRouter;