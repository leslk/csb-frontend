<template>
    <div class="create-password-view">
        <img :src="Logo" alt="logo" />
        <div class="create-password-view-content">
            <CsbTitle class="create-password-view-title" title="Votre compte Administrateur Caen street ball vient d'être créer, merci de compléter votre mot de passe pour le valider" />
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
import Logo from '@/assets/logo.jpeg';
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
    padding: 40px;
    gap: 1.25rem;
    height: 100vh;
    justify-content: center;
    &-title {
        max-width: 600px;
        text-align: center;
    }
    &-button {
        width: 100%;
        max-width: 400px;
        border-radius: 2px;
    }
    &-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(black, 0.5);
        box-shadow: none;
        border-radius: 0;
        &:hover {
            box-shadow: none;
        }
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