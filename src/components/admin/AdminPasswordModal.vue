<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Modifier le mot de passe</h2>
        </template>
        <template #content>
            <div class="admin-password-modal-body">
                <CsbInput
                    type="password"
                    label="Ancien mot de passe"
                    :value="form.oldPassword"
                    @update:value="form.oldPassword = $event"
                    :error="passwordValidate?.oldPassword.$errors[0]?.$message"
                    password
                />
                <CsbInput
                    type="password"
                    label="Nouveau mot de passe"
                    :value="form.newPassword"
                    @update:value="form.newPassword = $event"
                    :error="passwordValidate?.newPassword.$errors[0]?.$message"
                    password
                />
                <CsbPasswordProgressBar :password="form.newPassword" />
                <CsbInput
                    type="password"
                    label="Confirmer le nouveau mot de passe"
                    :value="form.confirmPassword"
                    :error="passwordValidate?.confirmPassword.$errors[0]?.$message"
                    @update:value="form.confirmPassword = $event"
                    password
                />
            </div>
        </template>
        <template #footer>
            <div class="admin-password-modal-footer">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Modifier" @click="changePassword" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CsbModal from '@/components/common/CsbModal.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import CsbPasswordProgressBar from '../common/CsbPasswordProgressBar.vue';

/**
 * Vue component for the admin password modal.
 *
 * @component AdminPasswordModal
 * @example <AdminPasswordModal :show="show" @close="close" @updatePassword="updatePassword" />
 */

/**
 * Props of the component.
 *  @prop {Boolean} show - Determines whether the modal is shown or not.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
});

/**
 * Emits of the component.
 * @emit close - Event emitted when the modal is closed.
 * @emit updatePassword - Event emitted when the password is updated. Passes the new password as a parameter.
 */
const emit = defineEmits(['close', 'updatePassword']);

/**
 * Form data for the password.
 */
const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

/**
 * Rules for the password form.
 */
const passwordRules = {
    oldPassword: {
        required: helpers.withMessage('Veuillez entrer votre ancien mot de passe', required)
    },
    newPassword: {
        required: helpers.withMessage('Veuillez entrer un nouveau mot de passe', required)
    },
    confirmPassword: {
        required: helpers.withMessage('Les mots de passe ne correspondent pas', () => {
            if (form.value.confirmPassword.length === 0) {
                return true;
            }
            return form.value.newPassword === form.value.confirmPassword;
        })
    }
};

/**
 * Password validation.
 */
const passwordValidate = useVuelidate(passwordRules, form);

/**
 * @function close
 * Close the modal.
 */
function close() {
    emit('close');
    passwordValidate.value.$reset();
}

/**
 * @function resetForm
 * Reset the form.
 */
function resetForm() {
    form.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
}

/**
 * @function changePassword
 * Change the password if the form is valid.
 * Emits the updatePassword event.
 */
async function changePassword() {
    const valid = await passwordValidate.value.$validate();
    if (!valid) return;
    emit('updatePassword', form.value);
}

/**
 * @function updatePassword
 * Update the password.
 * @param {String} password - The new password.
 */
watch(
    () => props.show,
    () => {
        resetForm();
        passwordValidate.value.$reset();
    }
);

/**
 * @function updatePassword
 * Update the password.
 * @param {String} password - The new password.
 */
watch(
    () => form.value,
    (newValue) => {
        if (newValue.newPassword.length > 3 && newValue.newPassword !== newValue.confirmPassword)
            passwordValidate.value.confirmPassword.$touch();
    },
    { deep: true }
);
</script>

<style scoped lang="scss">
.admin-password-modal-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.admin-password-modal-footer {
    @include modal-footer;
}
</style>
