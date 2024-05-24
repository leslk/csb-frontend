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
import { type AdminAccount } from '@/services/types';

/**
 * Vue component for the admin invitation modal.
 *
 * @component AdminInvitationModal
 * @example <AdminInvitationModal :show="show" :account="account" @close="close" @confirm="resendInvitation" />
 */

/**
 * Props of the component.
 * @prop {Boolean} show - Determines whether the modal is shown or not.
 * @prop {AdminAccount} account - The account to resend the invitation to.
 */
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

/**
 * Emits of the component.
 * @emit close - Event emitted when the modal is closed.
 * @emit confirm - Event emitted when the invitation is resent. Passes the account ID as a parameter.
 */
const emit = defineEmits(['close', 'confirm']);

/**
 * Closes the modal by emitting the 'close' event.
 *
 * @function close
 */
function close() {
    emit('close');
}

/**
 * Resends the invitation by emitting the 'confirm' event with the account ID as the payload.
 *
 * @function resendInvitation
 */
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
    @include modal-footer;
}
</style>
