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
                />
                <CsbInput 
                    type="password" 
                    label="Nouveau mot de passe" 
                    :value="form.newPassword"
                    @update:value="form.newPassword = $event"
                />
                <CsbInput 
                    type="password" 
                    label="Confirmer le nouveau mot de passe" 
                    :value="form.confirmPassword"
                    :error="passwordError"
                    @update:value="form.confirmPassword = $event"
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
import { computed, ref } from 'vue';
import CsbModal from '@/components/common/CsbModal.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbButton from '@/components/common/CsbButton.vue';

defineProps({
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
const passwordError = computed(() => {
    if (form.value.newPassword !== form.value.confirmPassword) {
        return "Les mots de passe ne correspondent pas";
    }
    return "";
});

function close() {
    emit('close');
}

function changePassword() {
    emit('updatePassword', form.value);
}

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