<template>
    <div class="login-view">
        <div class="login-view-content">
            <img :src="Logo" alt="logo" class="login-view-logo"/>
            <CsbTitle class="login-view-title" title="CAEN STREET BALL © Connexion" /> 
            <form class="login-view-form" @submit.prevent="login">
                <CsbInput 
                    class="login-view-form-input"
                    :value="userCredentials.email" 
                    type="text" 
                    placeholder="Email"
                    @update:value="userCredentials.email = $event"
                    :error="emailError"
                    icon="fa-solid fa-user"
                />
                <CsbInput 
                    class="login-view-form-input"
                    @update:value="userCredentials.password = $event"
                    :value="userCredentials.password" 
                    type="password" 
                    placeholder="Password" 
                    :error="passwordError"
                    password
                />
                <CsbButton class="login-view-button" label="Connexion" @click="login" color="#000000"/>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/csb_logo.png';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import  { Auth, ErrorMessage } from '@/services/services';
import CsbInput from '@/components/common/CsbInput.vue';

const authStore = useAuthStore();
const emailError = ref("");
const passwordError = ref("");
const router = useRouter();
const userCredentials = computed(() => {
    return {
        email: '',
        password: ''
    }
});

async function login() {
    emailError.value = "";
    passwordError.value = "";
    try {
        const response = await Auth.login(userCredentials.value);
        authStore.login(response.data.user);
        router.push({ name: 'Accueil' });
    } catch (error: any) {
        const errorMessage = ErrorMessage.getErrorMessage(error);
        for (const error of errorMessage.message) {
            if (error.error.includes("EMAIL")) {
                emailError.value = "Email invalide";
            }
            if (error.error.includes("PASSWORD")) {
                passwordError.value = "Mot de passe invalide";
            } 
        }
    }   
}
</script>

<style scoped lang="scss">
.login-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    gap: 1.25rem;
    height: 100vh;
    width: 100%;
    justify-content: center;
    &-title {
        max-width: 600px;
        text-align: center;
        font-size: 2rem;
    }
    &-button {
        width: 100%;
        border-radius: 2px;
    }
    &-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 400px;
        width: 100%;
        gap: 1.25rem;
    }
    &-logo {
        width: 300px;
        height: 300px;
        border-radius: 50%;
    }
    &-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        padding: 3.75rem 1rem;
        &-input {
            width: 100%;
        }
    }
    @media (max-width: 1024px) {
        padding: 0;
    }
    @media (max-width: 768px) {
        &-content {
            max-width: 100vw;
        }
        &-title {
            max-width: 200px;
            font-size: 1.5rem;
        }
    }
}

</style>