<template>
    <div class="user-layout">
        <UserHeader />
        <CsbUserLoading :loading="loading" />
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
import { computed, onMounted } from 'vue';
import CsbUserLoading from '@/components/common/CsbUserLoading.vue';
import { useServicesStore } from '@/stores/services';

/**
 * the component displays the layout of the user page
 * @component UserLayout
 * @exemple <UserLayout />
 */

const servicesStore = useServicesStore();
const loading = computed(() => servicesStore.loading);

onMounted(() => {
    servicesStore.setSiteContent();
});
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
