<template>
    <CsbTitle
        class="admin-expired-link-title"
        title="Ce lien est expiré, veuillez contacter l'administrateur du site"
    />
    <CsbButton label="retour à la connexion" @click="goToLogin" color="#000000" />
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbButton from '@/components/common/CsbButton.vue';

const emit = defineEmits(['goToLogin']);

function goToLogin() {
    emit('goToLogin');
}
</script>

<style scoped lang="scss">
.admin-expired-link {
    &-title {
        max-width: 600px;
        text-align: center;
        font-size: 2rem;
    }
    &-button {
        width: 100%;
        border-radius: $borderRadius;
    }

    @media (max-width: 768px) {
        &-title {
            max-width: 400px;
            font-size: 1.5rem;
        }
    }
}
</style>
