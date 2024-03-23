<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Renvoyer une invitation</h2>
        </template>
        <template #content>
            <div class="admin-password-modal-body">
                <p>
                    {{
                        `Êtes-vous sûr de vouloir envoyer de nouveau une invitation à  ${account.firstName} ${account.lastName}?`
                    }}
                </p>
            </div>
        </template>
        <template #footer>
            <div class="admin-password-modal-footer">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Confirmer" @click="resendInvitation" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbButton from '@/components/common/CsbButton.vue';

interface AdminAccount {
    email: string;
    firstName: string;
    lastName: string;
    _id?: string | null;
    isSuperAdmin: boolean;
    status: string;
}

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

function resendInvitation() {
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
    display: flex;
    justify-content: flex-end;
    gap: 0.625rem;
    .csb-button:first-child {
        background-color: lighten($errorColor, 30%);
    }
}
</style>
