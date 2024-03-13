<template>
    <div class="admin-layout">
        <admin-header v-if="isAuth"/>
        <CsbLoading :loading="loading"/>
        <div :class="viewStyle">
            <router-view/>
        </div>

    </div>
</template>

<script setup lang="ts">
import {useAuthStore} from '@/stores/auth';
import AdminHeader from './AdminHeader.vue';
import { RouterView } from 'vue-router';
import { computed } from 'vue';
import CsbLoading from '@/components/common/CsbLoading.vue';
import { useServicesStore } from '@/stores/services';

const authStore = useAuthStore();
const isAuth = computed(() => authStore.isLoggedIn);
const servicesStore = useServicesStore();
const loading = computed(() => servicesStore.loading);
const viewStyle = computed(() => isAuth.value ? 'view' : 'view no-auth');
</script>

<style scoped lang="scss">

.admin-layout {
    position: relative;
    display: flex;
    min-height: 100vh;

    .view {
        padding: 1.25rem;
        flex-grow: 1;
        margin-left: 300px;
        background-color: $lighterGrey;
        background-image: linear-gradient(rgba($white, 0.6), rgba($white, 0.6)), url("../assets/csb_tournament2.jpeg");
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    }
    .no-auth {
        width: 100vw;
        margin-left: 0;
        padding: 0;
        background-image: linear-gradient(rgba($white, 0.3), rgba($white, 0.3)), url("../assets/csb_tournament2.jpeg");
    }
    @media (max-width: 1024px) {
        .view {
            margin-top: 100px;
            margin-left: 0;
        }
        flex-direction: column;
    }
}


</style>