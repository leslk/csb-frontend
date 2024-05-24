<template>
    <header class="header">
        <div class="header-image">
            <img :src="Logo" alt="logo" />
        </div>
        <div ref="toggleMenu" v-if="isSmallDevice" class="header-toggle">
            <i @click="showSmallDeviceMenu = !showSmallDeviceMenu" class="fa-solid fa-bars"></i>
        </div>
        <Transition name="slide-fade">
            <div class="header-main-content" v-if="(isSmallDevice && showSmallDeviceMenu) || !isSmallDevice">
                <nav class="header-menu">
                    <li v-for="(item, index) in adminRoutes" :key="index">
                        <MenuItem :item="item" @click="showSmallDeviceMenu = false"/>
                    </li>
                </nav>
                <div class="header-logout" @click="logout">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <p>Déconnexion</p>
                </div>
            </div>
        </Transition>
    </header>
</template>

<script setup lang="ts">
import Logo from '@/assets/csb_logo.png';
import MenuItem from '@/layout/MenuItem.vue';
import  {useRouter}  from 'vue-router';
import { onBeforeMount, onUnmounted, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useServicesStore } from '@/stores/services';

/**
 * This component displays the header of the admin page.
 * The user can navigate through the different pages of the admin section.
 * @component AdminHeader
 * @exemple <AdminHeader />
 */

const router = useRouter(); 
const toggleMenu = ref<HTMLElement | null>(null);
const servicesStore = useServicesStore();
const isSmallDevice = computed(() => servicesStore.getSmallDeviceScreen);
const showSmallDeviceMenu = ref<boolean>(false);
function isSmallScreen() {
    servicesStore.setSmallDeviceScreen(window.innerWidth < 1024);
}
// function clickOutsideOfToggleMenu(event: Event) {
//     console.log('clickOutsideOfToggleMenu');
//     if (toggleMenu.value && !toggleMenu.value.contains(event.target as Node)) {
//         if (showSmallDeviceMenu.value) {
//             showSmallDeviceMenu.value = false;
//         }
//     }
// }

function logout() {
    useAuthStore().logout();
    router.push({ name: 'Login' });
}

/**
 * @computed adminRoutes - A computed property that returns the routes of the admin page.
 */
const adminRoutes = router.options.routes.filter(
    (route: any) => route.path === '/admin')[0].children?.filter((route: any) => route.meta.isInTheMenu);
    



onBeforeMount(() => {
    isSmallScreen();
    // window.addEventListener('click', clickOutsideOfToggleMenu);
    window.addEventListener('resize', isSmallScreen);
});

onUnmounted(() => {
    // window.removeEventListener('click', clickOutsideOfToggleMenu);
    window.removeEventListener('resize', isSmallScreen);
});
</script>

<style scoped lang="scss">
.header {
    background-color: $secondaryColor;
    color: $white;
    position: fixed;
    padding: 1.25rem 0;
    width: 300px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    &-main-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: space-between;
    }
    &-image {
        margin-left: auto;
        margin-right: auto;
        height: 150px;
        width: 150px;
        margin-bottom: 3.125rem;
        img {
            height: 100%;
            width: 100%;
        }
    }
    &-menu {
        display: flex;
        flex-direction: column;
    }
    &-logout {
        cursor: pointer;
        padding: 0.938rem 1.25rem;
        display: flex;
        align-items: center;
        gap: 0.625rem;
    }
    @media (max-width: 1024px) {
        width: 100%;
        height: auto;
        position: fixed;
        z-index: 1000;
        &-main-content {  
            gap: 1.25rem;
        }
        &-image {
            height: 3.75rem;
            width: 3.73rem;
            margin-bottom: 0;
        }
        &-toggle {
            position: absolute;
            cursor: pointer;
            top: calc(50px - (1.25rem / 2));
            left: 1.25rem;
            i {
                font-size: 1.5rem;
            }
        }
        &-main-content {
            z-index: 1000;
            position: fixed;
            top: 90px;
            left: 0;
            background-color: $secondaryColor;
            width: 30%;
            height: calc(100vh - 90px);
        }
        .slide-fade-enter-active {
            transition: all 0.1s ease-out;
          }
          
          .slide-fade-leave-active {
            transition: all 0.1s;
          }
          
          .slide-fade-enter-from,
          .slide-fade-leave-to {
            transform: translateX(-100px);
            opacity: 0;
          }
    }
    @media (max-width: 768px) {
        &-main-content {
            width: 50%;
        }
    }
}
</style>