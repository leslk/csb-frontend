<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Suppression d'un compte</h2>
        </template>
        <template #content>
            <div class="admin-password-modal-body">
                <p>
                    {{
                        `Êtes-vous sûr de vouloir supprimer le compte de ${account.firstName} ${account.lastName}?`
                    }}
                </p>
            </div>
        </template>
        <template #footer>
            <div class="admin-password-modal-footer">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Confirmer" @click="changePassword" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { type AdminAccount } from '@/services/types';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    account: {
        type: Object as () => AdminAccount,
        required: true
    }
});

const emit = defineEmits(['close', 'confirm']);

function close() {
    emit('close');
}

function changePassword() {
    emit('confirm', props.account._id);
}
</script>

<style scoped lang="scss">
.admin-password-modal-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    * {
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.admin-password-modal-footer {
    @include modal-footer;
}
</style>
