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
import { type Tournament as TournamentType } from '@/services/types';
import { ref, watch, type PropType } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close', 'deleteTournament']);

const close = () => {
    emit('close');
};

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
