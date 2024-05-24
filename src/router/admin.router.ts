import AdminLayout from '@/layout/AdminLayout.vue';
import AccountsView from '@/views/AccountsView.vue';
import TournamentsView from '@/views/TournamentsView.vue';
import SiteContentView from '@/views/SiteContentView.vue';
import LoginView from '@/views/LoginView.vue';
import CreatePasswordView from '@/views/CreatePasswordView.vue';
import ForgetPasswordView from '@/views/ForgetPasswordView.vue';
import Logo from '@/assets/csb_logo_yellow.png';
import NotFound from '@/views/NotFound.vue';

const adminRouter = {
    path: '/admin',
    component: AdminLayout,
    name: 'Admin',
    redirect: { name: 'Les comptes' },
    meta: {
        title: 'CSB - Admin',
        logo: Logo,
    },
    children: [
        {
            path: 'accounts',
            name: 'Les comptes',
            component: AccountsView,
            meta: {
                isInTheMenu: true,
                title: 'Caen Street Ball Admin - Comptes',
                metaIcon: 'fa-regular fa-address-card',
                requiresAuth: true
            }
        },
        {
            path: 'tournaments',
            name: 'Les tournois',
            component: TournamentsView,
            meta: {
                isInTheMenu: true,
                title: 'Caen Street Ball Admin - Tournois',
                metaIcon: 'fa-solid fa-basketball',
                requiresAuth: true
            }
        },
        {
            path: 'site-content',
            name: 'Le contenu du site',
            component: SiteContentView,
            meta: {
                isInTheMenu: true,
                title: 'Caen Street Ball Admin - Contenu du site',
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
        },
        {
            path: '404',
            name : 'AdminNotFound',
            component: NotFound,
            meta: {
                title: 'Not Found',
                isInTheMenu: false,
            }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: 'AdminNotFound' },
            meta: {
                title: 'Not Found',
                isInTheMenu: false,
            }
        }
    ]
};

export default adminRouter;
