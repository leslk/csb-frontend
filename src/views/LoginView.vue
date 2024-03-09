<template>
    <div class="login-view">
        <img :src="Logo" alt="logo" />
        <div class="login-view-content">
            <CsbTitle class="login-view-title" title="Bienvenue sur le tableau de bord de Caen Street Ball" />
            <div class="login-view-form">
                <CsbInput 
                    class="login-view-form-input"
                    :value="userCredentials.email" 
                    type="text" 
                    placeholder="Email"
                    @update:value="userCredentials.email = $event"
                 />
                <CsbInput 
                    class="login-view-form-input"
                    @update:value="userCredentials.password = $event"
                    :value="userCredentials.password" 
                    type="password" 
                    placeholder="Password" 
                />
                <CsbButton label="Se connecter" @click="login"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/logo.jpeg';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import  { auth } from '@/services/auth';
import CsbInput from '@/components/common/CsbInput.vue';

const authStore = useAuthStore();
const router = useRouter();
const userCredentials = computed(() => {
    return {
        email: '',
        password: ''
    }
});

async function login() {
    try {
        const response = await auth.login(userCredentials.value);
        authStore.login(response.data.user);
        router.push({ name: 'Accueil' });
    } catch (error: any) {
        console.error(error);
    }   
}
</script>

<style scoped lang="scss">
.login-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    gap: 1.25rem;
    height: calc(100vh - (1.25rem * 2));
    justify-content: center;
    &-title {
        max-width: 600px;
        text-align: center;
    }
    img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
    }
    h1 {
        font-size: 2rem;
        margin: 1rem 0;
    }
    &-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 3.75rem 1rem;
        &-input {
            width: 100%;
            max-width: 400px;
        }
    }
    @media (max-width: 1024px) {
        padding: 0;
    }
}
</style>