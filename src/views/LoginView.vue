<template>
    <div class="login-view">
        <div class="login-view-content">
            <img :src="Logo" alt="logo" class="login-view-logo" />
            <template v-if="forgetPasswordView">
                <AdminForgetPassword
                    @update-email="userCredentials.email = $event"
                    @submit="forgetPassword"
                    @go-to-login="goToLogin"
                    :show="forgetPasswordView"
                    :success="forgetPasswordSuccess"
                    :email="userCredentials.email"
                    :emailError="emailError"
                />
            </template>
            <template v-else>
                <AdminLoginForm
                    @update-email="userCredentials.email = $event"
                    @update-password="userCredentials.password = $event"
                    @login="login"
                    @show-forget-password="setShowforgetPasswordView($event)"
                    :userCredentials="userCredentials"
                    :emailError="emailError"
                    :passwordError="passwordError"
                    :forgetPasswordView="forgetPasswordView"
                />
            </template>
        </div>
        <div class="login-view-content__right">
            <img :src="LetterLogo" alt="logo" class="login-view-letter-logo" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/csb_logo_yellow.png';
import LetterLogo from '@/assets/csb_logo_letter.png';
import AdminForgetPassword from '@/components/admin/AdminForgetPassword.vue';
import AdminLoginForm from '@/components/admin/AdminLoginForm.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import { Auth, ErrorMessage } from '@/services/services';

/**
 * Vue component for the login view.
 * @component LoginView
 * @example <LoginView />
 */


/**
 * Reference to the auth store.
 */
const authStore = useAuthStore();

/**
 * Reference to the forget password view.
 */
const forgetPasswordView = ref(false);

/**
 * Reference to the forget password success.
 */
const forgetPasswordSuccess = ref(false);

/**
 * Reference to the email error.
 */
const emailError = ref('');

/**
 * Reference to the password error.
 */
const passwordError = ref('');

/**
 * Router to navigate
 */
const router = useRouter();

/**
 * @computed userCredentials - A computed property that returns the user credentials.
 */
const userCredentials = computed(() => {
    return {
        email: '',
        password: ''
    };
});

function setShowforgetPasswordView(show: boolean) {
    resetErrors();
    forgetPasswordView.value = show;
}

/**
 * Resets the errors.
 */
function resetErrors() {
    emailError.value = '';
    passwordError.value = '';
}

/**
 * Navigates to the login view.
 */
function goToLogin() {
    forgetPasswordView.value = false;
    forgetPasswordSuccess.value = false;
}

/**
 * Resets the user credentials.
 */
function resetCredentials() {
    userCredentials.value.email = '';
    userCredentials.value.password = '';
}

/**
 * Logs the user in.
 */
async function login() {
    resetErrors();
    try {
        const response = await Auth.login(userCredentials.value);
        authStore.login(response.data.user);
        router.push({ name: 'Les comptes' });
    } catch (error: any) {
        const errorMessage = ErrorMessage.getErrorMessage(error);
        for (const error of errorMessage.message) {
            if (error.error.includes('EMAIL')) {
                emailError.value = 'Email invalide';
            }
            if (error.error.includes('PASSWORD')) {
                passwordError.value = 'Mot de passe invalide';
            }
        }
    }
}

/**
 * Sends a request to reset the password.
 */
async function forgetPassword() {
    emailError.value = '';
    try {
        await Auth.forgetPassword(userCredentials.value.email);
        forgetPasswordSuccess.value = true;
        resetCredentials();
    } catch (error: any) {
        const errorMessage = ErrorMessage.getErrorMessage(error);
        if (errorMessage.message.error.includes('EMAIL')) {
            emailError.value = 'Email invalide';
        }
    }
}
</script>

<style scoped lang="scss">
.login-view {
    display: flex;
    gap: 1.25rem;
    height: 100vh;
    width: 100%;
    &-content {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        background-color: $white;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        max-width: 50%;
        width: 100%;
        height: 100%;
        gap: 2rem;
        animation: slideToRight 0.5s;
        padding: 20px;
        &__right {
            position: fixed;
            top: 0;
            left: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50%;
            height: 100%;
            padding: 2rem;
            img {
                width: 100%;
                height: auto;
            }
        }
    }
    &-logo {
        width: 200px;
        height: 200px;
    }
    @media (max-width: 1024px) {
        padding: 0;
    }
    @media (max-width: 768px) {
        &-content {
            max-width: 100vw;
            background-color: rgba($white, 0.8);
            animation: fadeIn 0.5s ease-in-out;
            &__right {
                display: none;
            }
        }
        &-logo {
            width: 150px;
            height: 150px;
        }
    }
}
</style>
