<template>
    <div class="create-password-view">
        <div class="create-password-view-content">
        <img :src="Logo" alt="logo" class="create-password-view-logo"/>
            <CsbTitle class="create-password-view-title" title="Bienvenue sur CAEN STREET BALL Créez votre mot de passe pour accéder à votre compte" />
            <div class="create-password-view-form">
                <CsbInput 
                    class="create-password-view-form-input"
                    :value="passwordData.password" 
                    type="text" 
                    placeholder="Mot de passe"
                    @update:value="passwordData.password = $event"
                    :error="emailError"
                    password
                />
                <CsbInput 
                    class="create-password-view-form-input"
                    @update:value="passwordData.confirmPassword = $event"
                    :value="passwordData.confirmPassword" 
                    type="password" 
                    placeholder="Confirmation de mot de passe" 
                    :error="passwordError"
                    password
                />
                <CsbButton class="create-password-view-button" label="Creation de votre mot de passe" @click="createPassword" color="#000000"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/csb_logo.png';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import  { Admin, ErrorMessage } from '@/services/services';
import CsbInput from '@/components/common/CsbInput.vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';

const emailError = ref("");
const route = useRoute();
const passwordError = ref("");
const router = useRouter();
const passwordData = computed(() => {
    return {
        password: '',
        confirmPassword: ''
    }
});

const passwordRules = {
        password: { required: helpers.withMessage('Veuillez entrer un nouveau mot de passe', required) },
        confirmPassword: { required: helpers.withMessage('Les mots de passe ne correspondent pas', () => {
            return passwordData.value.password === passwordData.value.confirmPassword;
        }) },
    };

const passwordValidate = useVuelidate(passwordRules, passwordData);

async function createPassword() {
    const adminId = route.params.id as string;
    try {
        if (adminId) {
            await Admin.createPassword(adminId, passwordData.value);
            router.push({ name: 'Login' });
            toast.success('Votre mot de passe a été créé avec succès');
        }
    } catch (error: any) {
        const errorMessage = ErrorMessage.getErrorMessage(error);
        console.log(errorMessage);
        toast.error('Une erreur est survenue');
    }   
}
</script>

<style scoped lang="scss">
.create-password-view {
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
        max-width: 500px;
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