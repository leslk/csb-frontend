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

const emit = defineEmits(['close', 'deleteParticipant']);

const close = () => {
    emit('close');
};

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
