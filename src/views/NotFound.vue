<template>
    <div class="not-found">
        <div class="not-found__content">
            <h1>404</h1>
            <p>Cette page n'existe pas</p>
            <CsbButton @click="redirectTohome" label="Retour à l'accueil"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import CsbButton from '@/components/common/CsbButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function redirectTohome() {
    router.push({ name: 'Accueil' });
}
</script>

<style scoped lang="scss">
.not-found {
    flex-grow: 1;
    display: flex;
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