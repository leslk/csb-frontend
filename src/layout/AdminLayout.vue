<template>
    <div class="admin-layout">
        <img :src="BgImage" alt="bg" class="admin-layout-bg-image" />
        <admin-header v-if="isAuth && isNotCreatePasswordView" />
        <CsbLoading :loading="loading" />
        <div :class="viewStyle">
            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import BgImage from '@/assets/csb_tournament2.jpeg';
import AdminHeader from './AdminHeader.vue';
import { RouterView, useRouter } from 'vue-router';
import { computed } from 'vue';
import CsbLoading from '@/components/common/CsbLoading.vue';
import { useServicesStore } from '@/stores/services';

/**
 * This component displays the layout of the admin page.
 * @component AdminLayout
 * @exemple <AdminLayout />
 */


/**
 * Reference to the auth store.
 */
const authStore = useAuthStore();

/**
 * @computed isAuth - A computed property that returns a boolean value indicating whether the user is authenticated or not.
 */
const isAuth = computed(() => authStore.isLoggedIn);
const router = useRouter();
/**
 * @computed isNotCreatePasswordView - A computed property that returns a boolean value indicating whether the current view is not the create password view.
 */
const isNotCreatePasswordView = computed(
    () => router.currentRoute.value.name !== 'create-password'
);
const servicesStore = useServicesStore();
const loading = computed(() => servicesStore.loading);

/**
 * @computed viewStyle - A computed property that returns the style of the view.
 */
const viewStyle = computed(() => (isAuth.value ? 'view' : 'view no-auth'));
</script>

<style scoped lang="scss">
.admin-layout {
    position: relative;
    display: flex;
    min-height: 100vh;

    .admin-layout-bg-image {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        z-index: -1;
    }

    .view {
        padding: 1.25rem;
        max-width: calc(100vw - 300px);
        flex-grow: 1;
        margin-left: 300px;
        background: linear-gradient(rgba($white, 0.7), rgba($white, 0.7));
    }
    .no-auth {
        width: 100vw;
        max-width: 100vw;
        margin-left: 0;
        padding: 0;
        background: none;
        ::v-deep(.not-found) {
            background-color: rgba($white, 0.7);
        }
    }
    @include tablet-break-point {
        .view {
            margin-top: 100px;
            width: 100vw;
            max-width: 100vw;
            margin-left: 0;
        }
        .no-auth {
            margin-top: 0px;
        }
        flex-direction: column;
    }
}
</style>
