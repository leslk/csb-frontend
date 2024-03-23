<template>
    <div class="forget-password-view">
        <div class="forget-password-view-content">
            <img :src="Logo" alt="logo" class="forget-password-view-logo" />
            <template v-if="expiredToken">
                <AdminExpiredLink @goToLogin="goToLogin" />
            </template>
            <template v-else>
                <AdminPasswordForm
                    buttonText="Réinitialiser votre mot de passe"
                    title="Bienvenue sur CAEN STREET BALL. Réinitialiser votre mot de passe pour accéder à votre compte"
                    :passwordData="passwordData"
                    :passwordValidate="passwordValidate"
                    @createPassword="createPassword"
                    @updatePassword="passwordData.password = $event"
                    @updateConfirmPassword="passwordData.confirmPassword = $event"
                />
            </template>
        </div>
        <div class="forget-password-view-content__right">
            <img :src="LetterLogo" alt="logo" class="login-view-letter-logo" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/csb_logo_yellow.png';
import LetterLogo from '@/assets/csb_logo_letter.png';
import AdminPasswordForm from '@/components/admin/AdminPasswordForm.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { Admin, Auth } from '@/services/services';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import AdminExpiredLink from '@/components/admin/AdminExpiredLink.vue';

const route = useRoute();
const router = useRouter();
const passwordData = ref({
    password: '',
    confirmPassword: ''
});
const expiredToken = ref(false);

function resetPasswordData() {
    passwordData.value.password = '';
    passwordData.value.confirmPassword = '';
}

const passwordRules = {
    password: {
        required: helpers.withMessage('Veuillez entrer votre ancien mot de passe', required)
    },
    confirmPassword: {
        required: helpers.withMessage('Les mots de passe ne correspondent pas', () => {
            if (passwordData.value.confirmPassword.length === 0) {
                return true;
            }
            return passwordData.value.password === passwordData.value.confirmPassword;
        })
    }
};

const passwordValidate = useVuelidate(passwordRules, passwordData);

async function createPassword() {
    const adminId = route.params.id as string;
    try {
        if (adminId) {
            await Auth.resetPassword(adminId, passwordData.value);
            toast.success('Votre mot de passe a été créé avec succès');
            setTimeout(() => router.push({ name: 'Login' }), 1000);
        }
    } catch (error: any) {
        toast.error('Une erreur est survenue');
    }
}

function goToLogin() {
    router.push({ name: 'Login' });
}

watch(
    () => passwordData.value,
    (newValue: { password: string; confirmPassword: string }) => {
        if (newValue.password.length > 3 && newValue.confirmPassword !== newValue.password) {
            passwordValidate.value.confirmPassword.$touch();
            console.log('touched');
        }
    },
    { deep: true }
);

onMounted(async () => {
    resetPasswordData();
    const adminId = route.params.id as string;
    const adminToken = route.params.token as string;
    try {
        if (adminId && adminToken) {
            await Admin.checkToken(adminId, adminToken);
        }
    } catch (error: any) {
        expiredToken.value = true;
    }
});
</script>

<style scoped lang="scss">
.forget-password-view {
    display: flex;
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
        border-radius: $borderRadius;
    }
    &-content {
        position: fixed;
        top: 0;
        left: 0;
        background-color: $white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 50%;
        width: 100%;
        height: 100%;
        gap: 1.25rem;
        padding: 20px;
        animation: slideToRight 0.5s;
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
        &-title {
            max-width: 400px;
            font-size: 1.5rem;
        }
        &-logo {
            width: 150px;
            height: 150px;
        }
    }
}
</style>
