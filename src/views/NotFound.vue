<template>
    <div class="not-found">
        <div class="not-found__content">
            <h1>404</h1>
            <p>Cette page n'existe pas</p>
            <CsbButton label="Retour" @click="goBack"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import CsbButton from '@/components/common/CsbButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
function goBack() {
    router.go(-1);
}
</script>

<style scoped lang="scss">
.not-found {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;

    &__content {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        h1 {
            font-size: 10rem;
            font-family: 'breakside';
        }

        p {
            font-size: 2rem;
            margin: 0;
        }
    }
}
</style>