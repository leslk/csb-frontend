<template>
    <template v-if="show && !success">
        <CsbTitle
            class="admin-forget-password-title"
            title="Demande de réinitialisation de mot de passe par e-mail"
        />
        <form class="admin-forget-password-form" @submit.prevent="submit">
            <CsbInput
                class="admin-forget-password-form-input"
                :value="email"
                type="text"
                placeholder="Email"
                @update:value="updateEmail"
                :error="emailError"
                icon="fa-solid fa-user"
            />
            <CsbButton
                class="admin-forget-password-button"
                label="Envoyer"
                @click="submit"
                color="#000000"
            />
        </form>
    </template>
    <template v-if="show && success">
        <CsbTitle
            class="admin-forget-password-title"
            title="Votre demande de réinitialsation de mot de passe a bien été prise en compte, Veuillez consulter votre boîte mail"
        />
        <CsbButton
            class="admin-forget-password-button__succcess"
            label="Retour à la connexion"
            @click="goToLogin"
            color="#000000"
        />
    </template>
</template>

<script setup lang="ts">
import CsbButton from '@/components/common/CsbButton.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbInput from '@/components/common/CsbInput.vue';
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emailError: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['updateEmail', 'submit', 'goToLogin']);

function submit(e: Event) {
    e.preventDefault();
    emit('submit');
}

function updateEmail(email: string) {
    emit('updateEmail', email);
}

function goToLogin() {
    emit('goToLogin');
}
</script>

<style scoped lang="scss">
.admin-forget-password {
    &-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        padding: 3.75rem 1rem;
        max-width: 400px;
        &-input {
            width: 100%;
        }
    }
    &-button {
        width: 100%;
        border-radius: $borderRadius;
        &__succcess {
            width: min-content;
            border-radius: $borderRadius;
            white-space: nowrap;
        }
    }
    &-title {
        width: 70%;
        text-align: center;
    }
}
</style>
