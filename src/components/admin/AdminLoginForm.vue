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

/**
 * Vue component for the admin login form.
 *
 * @component
 * @exemple <AdminLoginForm :emailError="emailError" :passwordError="passwordError" :userCredentials="userCredentials" :forgetPasswordView="forgetPasswordView" @login="login" @showForgetPassword="showForgetPassword" @updateEmail="updateEmail" @updatePassword="updatePassword" />
 */

 /**
  * Props of the component
  * @props emailError: The error message for the email input.
  * @props passwordError: The error message for the password input.
  * @props userCredentials: The user credentials.
  * @props forgetPasswordView: Determines whether the forget password view should be shown or not.
  */
defineProps({
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

/**
 * Emits of the component
 * @emit login - Event emitted when the login button is clicked.
 * @emit showForgetPassword - Event emitted when the forget password link is clicked.
 * @emit updateEmail - Event emitted when the email input is updated.
 * @emit updatePassword - Event emitted when the password input is updated.
 */
const emit = defineEmits(['login', 'showForgetPassword', 'updateEmail', 'updatePassword']);

/**
 * Updates the email input
 *
 * @param {Event} e - The event object
 */
function updateEmail(e: Event) {
    emit('updateEmail', e);
}

/**
 * Updates the password input
 *
 * @param {Event} e - The event object
 */
function updatePassword(e: Event) {
    emit('updatePassword', e);
}

/**
 * Logs the user in
 *
 * @param {Event} e - The event object
 */
function login(e: Event) {
    e.preventDefault();
    emit('login');
}

/**
 * Shows the forget password view
 */
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
