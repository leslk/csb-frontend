<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Supprimer un participant</h2>
        </template>
        <template #content>
            <p>Êtes-vous sûr de vouloir annuler ce tournoi ?</p>
            <p>
                Suite à cette annulation, les participants seront prévenu par e-mail mais vous
                devrez cependant effectuer les remboursements pour tous les participants.
            </p>
        </template>
        <template #footer>
            <div class="tournament-delete-modal-buttons">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Confirmer" @click="deleteTournament" />
            </div>
        </template>
    </CsbModal>
</template>

<script lang="ts" setup>
import CsbModal from '@/components/common/CsbModal.vue';
import CsbButton from '@/components/common/CsbButton.vue';

/**
 * Vue component for the tournament delete modal.
 *
 * @component TournamentDeleteModal
 * @example <TournamentDeleteModal :show="show" @close="close" @deleteTournament="deleteTournament" />
 */

/**
 * Props of the component.
 * @prop {Boolean} show - Determines whether the modal is shown or not.
 */
defineProps({
    show: {
        type: Boolean,
        required: true
    }
});

/**
 * Emits of the component.
 * @emit close - Event emitted when the modal is closed.
 * @emit deleteTournament - Event emitted when the tournament is deleted.
 */
const emit = defineEmits(['close', 'deleteTournament']);

/**
 * @function close
 * Close the modal.
 */
const close = () => {
    emit('close');
};

/**
 * @function deleteTournament
 * Delete the tournament.
 */
function deleteTournament() {
    emit('deleteTournament');
    close();
}
</script>

<style lang="scss" scoped>
.tournament-delete-modal-buttons {
    @include modal-footer;
}
</style>
