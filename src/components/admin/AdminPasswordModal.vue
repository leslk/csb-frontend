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
                <CsbButton label="Annuler" @click="close"/>
                <CsbButton label="Modifier" @click="changePassword"/>
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
import { required, helpers, sameAs } from '@vuelidate/validators';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close', 'updatePassword']);

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const passwordRules = {
        oldPassword: { required: helpers.withMessage('Veuillez entrer votre ancien mot de passe', required) },
        newPassword: { required: helpers.withMessage('Veuillez entrer un nouveau mot de passe', required) },
        confirmPassword: { required: helpers.withMessage('Les mots de passe ne correspondent pas', () => {
            return form.value.newPassword === form.value.confirmPassword;
        }) },
    };

const passwordValidate = useVuelidate(passwordRules, form);

function close() {
    emit('close');
    passwordValidate.value.$reset();
}

function resetForm() {
    form.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
}

async function changePassword() {
    const valid = await passwordValidate.value.$validate();
    if (!valid) return;
    emit('updatePassword', form.value);
}

watch(() => props.show, () => {
    resetForm();
    passwordValidate.value.$reset();
});

watch(() => form.value, (newValue) => {
    if (newValue.newPassword.length > 3 && newValue.newPassword !== newValue.confirmPassword)
    passwordValidate.value.confirmPassword.$touch();
}, {deep: true});

</script>

<style scoped lang="scss">
    .admin-password-modal-body {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .admin-password-modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.625rem;
        .csb-button:first-child {
            background-color: lighten($errorColor, 30%);
        }
    }
</style>