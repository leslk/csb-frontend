<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Supprimer un participant</h2>
        </template>
        <template #content>
            <p>
                {{
                    `Êtes-vous sûr de vouloir supprimer ${participantToDelete.firstName} ${participantToDelete.lastName} de ce tournoi ?`
                }}
            </p>
        </template>
        <template #footer>
            <div class="tournament-delete-modal-buttons">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Confirmer" @click="deleteParticipant" />
            </div>
        </template>
    </CsbModal>
</template>

<script lang="ts" setup>
import CsbModal from '@/components/common/CsbModal.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { type Participant as ParticipantType } from '@/services/types';
import { type PropType } from 'vue';

/**
 * Vue component for the tournament delete participant modal.
 *
 * @component TournamentDeleteParticipantModal
 * @example <TournamentDeleteParticipantModal :show="show" :participantToDelete="participant" @close="close" @deleteParticipant="deleteParticipant" />
 */

/**
 * Props of the component.
 * @prop {Boolean} show - Determines whether the modal is shown or not.
 * @prop {String} tournamentId - The ID of the tournament the participant is in.
 * @prop {ParticipantType} participantToDelete - The participant to be deleted.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    tournamentId: {
        type: String,
        required: false
    },
    participantToDelete: {
        type: Object as PropType<ParticipantType>,
        required: true
    }
});

/**
 * Emits of the component.
 * @emit close - Event emitted when the modal is closed.
 * @emit deleteParticipant - Event emitted when the participant is deleted. Passes the participant ID and the tournament ID as parameters.
 */
const emit = defineEmits(['close', 'deleteParticipant']);

/**
 * @function close
 * Close the modal.
 */
const close = () => {
    emit('close');
};

/**
 * @function deleteParticipant
 * Delete the participant.
 */
function deleteParticipant() {
    emit('deleteParticipant', props.participantToDelete._id, props.tournamentId);
    close();
}
</script>

<style lang="scss" scoped>
.tournament-delete-modal-buttons {
    @include modal-footer;
}
</style>
