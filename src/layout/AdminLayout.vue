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

    .view {
        padding: 1.25rem;
        flex-grow: 1;
        margin-left: 300px;
        background-color: $lighterGrey;
        border-right: 2px solid $lightGrey;
    }
    .no-auth {
        width: 100%;
        margin-left: 0;
    }
    @media (max-width: 1024px) {
        .view {
            margin-left: 0;
        }
        flex-direction: column;
    }
}


</style>