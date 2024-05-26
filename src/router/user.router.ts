import UserLayout from '@/layout/UserLayout.vue';
import HomeView from '@/views/HomeView.vue';
import NotFound from '@/views/NotFound.vue';
import UserTournamentsView from '@/views/UserTournamentsView.vue';
import UserTournamentView from '@/views/UserTournamentView.vue';
import UserContactView from '@/views/UserContactView.vue';
import Logo from '@/assets/csb_logo_yellow.png';
import LegaleNotice from '@/views/LegaleNotice.vue';

const userRouter = {
    path: '/',
    component: UserLayout,
    redirect: { name: 'Accueil' },
    meta: {
        title: 'Caen Street Ball',
        logo: Logo,
    },
    children: [
        {
            path: '/home-page',
            name: 'Accueil',
            component: HomeView,
            meta: {
                isInTheMenu: true,
                title: 'Caen Street Ball - Accueil',
                metaIcon: 'fa-regular fa-address-card',
                requiresAuth: false
            }
        },
        {
            path: '/tournaments',
            name: 'Tournois',
            component: UserTournamentsView,
            meta: {
                isInTheMenu: true,
                title: 'Caen Street Ball - Tournaments',
                metaIcon: 'fa-solid fa-basketball',
                requiresAuth: false
            }
        },
        {
            path: '/tournaments/:id',
            name: 'TournamentDetails',
            component: UserTournamentView,
            meta: {
                isInTheMenu: false,
                title: 'Caen Street Ball - Tournament',
                requiresAuth: false
            }
        },
        {
            path: '/contact',
            name: 'Contact',
            component: UserContactView,
            meta: {
                isInTheMenu: true,
                title: 'Caen Street Ball - Contact',
                metaIcon: 'fa-solid fa-pager',
                requiresAuth: false
            }
        },
        {
            path: '/legale-notice',
            name: 'MentionsLegales',
            component: LegaleNotice,
            meta: {
                isInTheMenu: false,
                title: 'Caen Street Ball - Mentions Légales',
                requiresAuth: false
            }
        },
        {
            path: '/404',
            name : 'NotFound',
            component: NotFound,
            meta: {
                title: 'Not Found',
                isInTheMenu: false,
            }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: 'NotFound' },
            meta: {
                title: 'Not Found',
                isInTheMenu: false,
            }
        }
    ]
};

export default userRouter;
