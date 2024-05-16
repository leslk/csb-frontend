<template>
    <div class="user-layout">
        <UserHeader />
        <CsbLoading :loading="loading" />
        <div class="view">
            <router-view />
        </div>
        <UserFooter />
    </div>
</template>

<script setup lang="ts">
import UserHeader from '@/layout/UserHeader.vue';
import UserFooter from '@/layout/UserFooter.vue';
import { RouterView } from 'vue-router';
import { computed } from 'vue';
import CsbLoading from '@/components/common/CsbLoading.vue';
import { useServicesStore } from '@/stores/services';

const servicesStore = useServicesStore();
const loading = computed(() => servicesStore.loading);
</script>

<style scoped lang="scss">
.user-layout {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    .view {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    @include tablet-break-point {
        .view {
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
