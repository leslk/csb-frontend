<template>
    <CsbTitle class="login-title" title="CAEN STREET BALL © Connexion" />
    <form class="login-form" @submit.prevent="login">
        <CsbInput
            class="login-form-input"
            :value="userCredentials.email"
            type="text"
            placeholder="Email"
            @update:value="updateEmail"
            :error="emailError"
            icon="fa-solid fa-user"
        />
        <CsbInput
            class="login-form-input"
            @update:value="updatePassword"
            :value="userCredentials.password"
            type="password"
            placeholder="Password"
            :error="passwordError"
            password
        />
        <CsbButton class="login-button" label="Connexion" @click="login" color="#000000" />
        <p class="login-forget-password" @click="showForgetPassword">Mot de passe oublié ?</p>
    </form>
</template>

<script setup lang="ts">
import CsbInput from '@/components/common/CsbInput.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import type { PropType } from 'vue';

const props = defineProps({
    emailError: {
        type: String,
        default: ''
    },
    passwordError: {
        type: String,
        default: ''
    },
    userCredentials: {
        type: Object as PropType<{ email: string; password: string }>,
        required: true
    },
    forgetPasswordView: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['login', 'showForgetPassword', 'updateEmail', 'updatePassword']);

function updateEmail(e: Event) {
    emit('updateEmail', e);
}

function updatePassword(e: Event) {
    emit('updatePassword', e);
}

function login(e: Event) {
    e.preventDefault();
    emit('login');
}

function showForgetPassword() {
    emit('showForgetPassword', true);
}
</script>

<style scoped lang="scss">
.login {
    &-title {
        max-width: 600px;
        text-align: center;
        font-size: 2rem;
    }
    &-button {
        width: 100%;
        border-radius: $borderRadius;
    }
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
    @media (max-width: 768px) {
        &-title {
            max-width: 200px;
            font-size: 1.5rem;
        }
    }
    &-forget-password {
        cursor: pointer;
    }
}
</style>
