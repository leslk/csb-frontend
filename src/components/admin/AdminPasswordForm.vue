<template>
    <CsbTitle class="admin-password-title" :title="title" />
    <div class="admin-password-form">
        <CsbInput
            class="admin-password-form-input"
            :value="passwordData.password"
            type="text"
            placeholder="Mot de passe"
            @update:value="updatePassword"
            :error="passwordValidate.password.$errors[0]?.$message"
            password
        />
        <CsbPasswordProgressBar :password="passwordData.password" />
        <CsbInput
            class="admin-password-form-input"
            @update:value="updateConfirmPassword"
            :value="passwordData.confirmPassword"
            type="password"
            placeholder="Confirmation de mot de passe"
            :error="passwordValidate.confirmPassword.$errors[0]?.$message"
            password
        />
        <CsbButton
            class="admin-password-button"
            :label="buttonText"
            @click="createPassword"
            color="#000000"
        />
    </div>
</template>

<script setup lang="ts">
import CsbButton from '@/components/common/CsbButton.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbPasswordProgressBar from '@/components/common/CsbPasswordProgressBar.vue';
import type { PropType } from 'vue';

/**
 * Vue component for the admin password form.
 *
 * @component AdminPasswordForm
 * @exemple <AdminPasswordForm :title="title" :buttonText="buttonText" :passwordData="passwordData" :passwordValidate="passwordValidate" @createPassword="createPassword" @updatePassword="updatePassword" @updateConfirmPassword="updateConfirmPassword" />
 */

/**
 * Props of the component
 * @props title: The title of the form.
 * @props buttonText: The text of the button.
 * @props passwordData: The password data.
 * @props passwordValidate: The password validation.
 */
defineProps({
    title: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        required: true
    },
    passwordData: {
        type: Object as PropType<{ password: string; confirmPassword: string }>,
        required: true
    },
    passwordValidate: {
        type: Object,
        required: true
    }
});

/**
 * Emits
 * @emits createPassword - Event emitted when the create password action is triggered.
 * @emits updatePassword}- Event emitted when the password value is updated.
 * @emits updateConfirmPassword - Event emitted when the confirmPassword value is updated.
 
 */
const emit = defineEmits(['createPassword', 'updatePassword', 'updateConfirmPassword']);

/**
 * Function to handle the create password action.
 *
 * @function createPassword
 * @emits {createPassword} - Event emitted when the create password action is triggered.
 */
function createPassword() {
    emit('createPassword');
}

/**
 * Function to handle the update password action.
 *
 * @function updatePassword
 * @param {string} value - The updated password value.
 * @emits {updatePassword} - Event emitted when the password value is updated.
 */
function updatePassword(value: string) {
    emit('updatePassword', value);
}

/**
 * Function to handle the update confirmPassword action.
 *
 * @function updateConfirmPassword
 * @param {string} value - The updated confirmPassword value.
 * @emits {updateConfirmPassword} - Event emitted when the confirmPassword value is updated.
 */
function updateConfirmPassword(value: string) {
    emit('updateConfirmPassword', value);
}
</script>

<style scoped lang="scss">
.admin-password {
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
            max-width: 400px;
            font-size: 1.5rem;
        }
    }
}
</style>
