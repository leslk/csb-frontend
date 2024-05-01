import AdminLayout from '@/layout/AdminLayout.vue';
import AccountsView from '@/views/AccountsView.vue';
import TournamentsView from '@/views/TournamentsView.vue';
import SiteContentView from '@/views/SiteContentView.vue';
import LoginView from '@/views/LoginView.vue';
import CreatePasswordView from '@/views/CreatePasswordView.vue';
import ForgetPasswordView from '@/views/ForgetPasswordView.vue';

const adminRouter = {
    path: '/admin',
    component: AdminLayout,
    name: 'Admin',
    redirect: { name: 'Comptes' },
    meta: {
        title: 'CSB - Admin'
    },
    children: [
        {
            path: 'accounts',
            name: 'Comptes',
            component: AccountsView,
            meta: {
                isInTheMenu: true,
                title: 'Accounts',
                metaIcon: 'fa-regular fa-address-card',
                requiresAuth: true
            }
        },
        {
            path: 'tournaments',
            name: 'Tournois',
            component: TournamentsView,
            meta: {
                isInTheMenu: true,
                title: 'Tournaments',
                metaIcon: 'fa-solid fa-basketball',
                requiresAuth: true
            }
        },
        {
            path: 'site-content',
            name: 'Contenu du site',
            component: SiteContentView,
            meta: {
                isInTheMenu: true,
                title: 'Site Content',
                metaIcon: 'fa-solid fa-pager',
                requiresAuth: true
            }
        },
        {
            path: 'login',
            name: 'Login',
            component: LoginView,
            meta: {
                isInTheMenu: false,
                title: 'Login',
                requiresAuth: false
            }
        },
        {
            path: 'create-password/:id/:token',
            name: 'create-password',
            component: CreatePasswordView,
            meta: {
                isInTheMenu: false,
                title: 'Create Password',
                requiresAuth: false
            }
        },
        {
            path: 'forget-password/:id/:token',
            name: 'forget-password',
            component: ForgetPasswordView,
            meta: {
                isInTheMenu: false,
                title: 'Create Password',
                requiresAuth: false
            }
        }
    ]
};

export default adminRouter;
