<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Détails du tournoi</h2>
        </template>
        <template #content>
            <div class="tournament-details-content">
                <div class="tournament-details-item" v-if="tournament.description">
                    <p>Description :</p>
                    <p>{{ tournament.description }}</p>
                </div>
                <p class="tournament-details-total-participants">
                    {{
                        `${tournament.participants?.length} / ${tournament.availablePlaces} participants`
                    }}
                </p>

                <h2
                    v-if="
                        (tournament.participants && tournament.participants.length > 0) ||
                        showAddParticipant
                    "
                >
                    Liste des paricipants
                </h2>
                <div
                    class="tournament-details-participants-content"
                    v-if="
                        (tournament.participants && tournament.participants.length > 0) ||
                        showAddParticipant
                    "
                >
                    <table class="tournament-details-participants">
                        <tr>
                            <!-- <th class="tournament-details-participants-empty-header"></th> -->
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                        </tr>
                        <tr v-for="participant in participants" :key="participant._id">
                            <td>{{ participant.firstName }}</td>
                            <td>{{ participant.lastName }}</td>
                            <td>{{ participant.email }}</td>
                            <td>{{ participant.phoneNumber }}</td>
                            <i
                                v-if="isOpenTournament"
                                class="fa-solid fa-trash tournament-details-participants-delete"
                                @click="deleteParticipant(participant, tournament._id!)"
                            />
                        </tr>
                    </table>
                </div>
            </div>
        </template>
        <template #footer>
            <CsbButton label="Fermer" @click="close" />
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { type Tournament as TournamentType } from '@/services/types';
import { type PropType, computed, ref, watch } from 'vue';
import { type Participant as ParticipantType } from '@/services/types';

/**
 * Vue component for the tournament details modal.
 *
 * @component TournamentDetailsModal
 * @example <TournamentDetailsModal :show="show" :tournament="tournament" @close="close" @deleteParticipant="deleteParticipant" @addParticipant="addParticipant" />
 */

/**
 * Props of the component.
 * @prop {Boolean} show - Determines whether the modal is shown or not.
 * @prop {TournamentType} tournament - The tournament to be displayed.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    tournament: {
        type: Object as PropType<TournamentType>,
        required: true
    }
});

/**
 * @ref {Ref<ParticipantType[]>} participants - Participants of the tournament.
 */
const participants = ref(props.tournament.participants);

/**
 * @ref {Ref<ParticipantType>} participantForm - Form for adding a participant.
 */
const participantForm = ref({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    payment: 0
});

/**
 * @ref {Ref<Boolean>} isOpenTournament - Determines whether the tournament is open.
 */
const isOpenTournament = computed(() => {
    return props.tournament.status === 'open';
});

/**
 * @ref {Ref<Boolean>} showAddParticipant - Determines whether the add participant form is shown.
 */
const showAddParticipant = ref(false);

/**
 * emit of the component
 * @emit close - Event emitted when the modal is closed.
 * @emit deleteParticipant - Event emitted when the participant is deleted. Passes the participant and the tournament ID as parameters.
 * @emit addParticipant - Event emitted when a participant is added. Passes the participant and the tournament ID as parameters.
 */
const emit = defineEmits(['close', 'deleteParticipant', 'addParticipant']);

/**
 * @function close
 * Close the modal
 */
const close = () => {
    emit('close');
};

/**
 * @function deleteParticipant
 * Delete the participant
 * @param {ParticipantType} participant - The participant to be deleted
 * @param {string} tournamentId - The ID of the tournament
 */
function deleteParticipant(participant: ParticipantType, tournamentId: string) {
    emit('deleteParticipant', participant, tournamentId);
}

/**
 * @function resetParticipantForm
 * Reset the participant form
 */
function resetParticipantForm() {
    participantForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        payment: 0
    };
}

/**
 * watch the participants and update the participants value
 * @param {ParticipantType[]} newValue - The new value of the participants
 */
watch(
    () => props.tournament.participants,
    (newValue) => {
        participants.value = newValue;
    }
);

/**
 * watch the show prop and reset the participant form
 * @param {Boolean} newValue - The new value of the show prop
 */
watch(
    () => props.show,
    (newValue) => {
        if (!newValue) {
            resetParticipantForm();
        }
    }
);
</script>

<style scoped lang="scss">
.csb-modal {
    ::v-deep(.csb-modal-content) {
        max-width: 1000px;
    }
}
.tournament-details {
    &-content {
        @include form-layout;
    }
    &-item {
        p:first-child {
            font-weight: bold;
            padding-bottom: 0.625rem;
        }
        gap: 0.5rem;
        word-break: break-all;
    }
    &-total-participants,
    &-payment {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: bold;
        margin: auto;
        p {
            font-size: 1.5rem;
        }
    }
    &-participants-content {
        overflow: scroll;
    }
    &-participants {
        border-collapse: collapse;
        border: 1px solid $lightGrey;
        font-family: sans-serif;
        font-size: 0.8rem;
        letter-spacing: 1px;
        width: 100%;
        td,
        th {
            padding: 10px;
            border: 1px solid $lightGrey;
            white-space: nowrap;
        }
        &-delete {
            height: 20px;
            width: 20px;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        &-empty-header {
            width: 25px;
            border: none !important;
        }
    }
    &-add-participant {
        width: min-content;
        white-space: nowrap;
    }
}
</style>
