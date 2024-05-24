<template>
    <div class="tournaments-view">
        <div class="tournaments-view-header">
            <CsbTitle title="Tournaments" />
            <CsbButton
                :is-icon-button="isSmallScreen"
                icon="fa-solid fa-plus"
                label="Créer un nouveau tournoi"
                @click="setShowTournamentModal"
            />
        </div>
        <CsbSection>
            <template #header>
                <h2>Tournois à venir</h2>
            </template>
            <template #content>
                <div class="tournaments-view-tournaments" v-if="openTournaments.length > 0">
                    <div v-for="tournament in openTournaments" :key="tournament._id">
                        <TournamentCard
                            :tournament="tournament"
                            @show-update-modal="setShowTournamentModal"
                            @show-details-modal="setShowInfosModal"
                            @show-participant-modal="setShowParticipantModal"
                            @show-delete-tournament="setShowDeleteModal"
                        />
                    </div>
                </div>
                <CsbEmptyState v-else text="Aucun tournoi en cours" />
            </template>
        </CsbSection>
        <CsbSection>
            <template #header>
                <h2>Tournois passés</h2>
            </template>
            <template #content>
                <div class="tournaments-view-tournaments" v-if="closedTournaments.length > 0">
                    <div v-for="tournament in closedTournaments" :key="tournament._id">
                        <TournamentCard
                            :tournament="tournament"
                            @show-update-modal="setShowTournamentModal"
                            @show-history-modal="setShowHistoryModal"
                            @show-details-modal="setShowInfosModal"
                        />
                    </div>
                </div>
                <CsbEmptyState v-else text="Aucun tournoi en cours" />
            </template>
        </CsbSection>
        <CsbSection>
            <template #header>
                <h2>Tournois annulés</h2>
            </template>
            <template #content>
                <div class="tournaments-view-tournaments" v-if="closedTournaments.length > 0">
                    <div v-for="tournament in cancelledTournaments" :key="tournament._id">
                        <TournamentCard
                            :tournament="tournament"
                            @show-update-modal="setShowTournamentModal"
                            @show-history-modal="setShowHistoryModal"
                            @show-details-modal="setShowInfosModal"
                        />
                    </div>
                </div>
                <CsbEmptyState v-else text="Aucun tournoi en cours" />
            </template>
        </CsbSection>
    </div>
    <TournamentInfosModal
        :tournament="tournament"
        :show="showCreateTournamentModal"
        @close="closeTournamentModal"
        @confirm="updateTournament"
    />
    <TournamentHistoryModal
        :tournament="tournament"
        :show="showHistoryModal"
        @close="closeTournamentHistoryModal"
        @add-history="addHistory"
        @add-image="addImage"
        @remove-image="removeImage"
        @delete-tournament-history="deleteTournamentHistory"
    />
    <TournamentDetailsModal
        :tournament="tournament"
        @add-participant="addParticipant"
        @delete-participant="setShowDeleteParticipantModal"
        :show="showInfosModal"
        @close="closeTournamentInfosModal"
    />
    <TournamentDeleteParticipantModal
        :show="showDeleteParticipantModal"
        :tournamentId="tournament._id"
        :participantToDelete="participantToDelete!"
        @close="closeTournamentDeleteParticipantModal"
        @deleteParticipant="deleteParticipant"
    />
    <TournamentParticipantModal
        :show="showParticipantModal"
        @close="closeTournamentParticipantModal"
        @add-participant="addParticipant"
    />
    <TournamentDeleteModal
        :show="showDeleteModal"
        @close="closeTournamentDeleteModal"
        @delete-tournament="deleteTournament"
    />
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import TournamentCard from '@/components/tournament/TournamentCard.vue';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import TournamentInfosModal from '@/components/tournament/TournamentInfosModal.vue';
import TournamentHistoryModal from '@/components/tournament/TournamentHistoryModal.vue';
import TournamentDetailsModal from '@/components/tournament/TournamentDetailsModal.vue';
import TournamentDeleteParticipantModal from '@/components/tournament/TournamentDeleteParticipantModal.vue';
import TournamentDeleteModal from '@/components/tournament/TournamentDeleteModal.vue';
import { ref, computed, onMounted } from 'vue';
import { useServicesStore } from '@/stores/services';
import { Tournament as TournamentActions, Upload } from '@/services/services';
import { toast } from 'vue3-toastify';
import CsbSection from '@/components/common/CsbSection.vue';
import TournamentParticipantModal from '@/components/tournament/TournamentParticipantModal.vue';
import type {
    Tournament as TournamentType,
    TournamentHistory as TournamentHistoryType,
    Participant as ParticipantType
} from '@/services/types';
import moment from 'moment';

/**
 * component for the tournaments view
 * @component TournamentsView
 * @example <TournamentsView />
 */


 /**
  * @ref {Ref<boolean>} showCreateTournamentModal - Determines whether the create tournament modal is shown or not.
  */
const showCreateTournamentModal = ref(false);

/**
 * @ref {Ref<boolean>} showHistoryModal - Determines whether the history modal is shown or not.
 */
const showHistoryModal = ref(false);

/**
 * @ref {Ref<boolean>} showInfosModal - Determines whether the infos modal is shown or not.
 */
const showInfosModal = ref(false);

/**
 * @ref {Ref<boolean>} showParticipantModal - Determines whether the participant modal is shown or not.
 */
const showParticipantModal = ref(false);

/**
 * @ref {Ref<TournamentType[]>} tournaments - The list of tournaments.
 */
const tournaments = ref<TournamentType[]>([]);

/**
 * services store
 */
const servicesStore = useServicesStore();

/**
 * @ref {Ref<boolean>} showDeleteParticipantModal - Determines whether the delete participant modal is shown or not.
 */
const showDeleteParticipantModal = ref(false);

/**
 * @ref {Ref<boolean>} showDeleteModal - Determines whether the delete modal is shown or not.
 */
const showDeleteModal = ref(false);

/**
 * @ref {Ref<ParticipantType>} participantToDelete - The participant to delete.
 */
const participantToDelete = ref<ParticipantType>();

/**
 * @ref {Ref<TournamentHistoryType>} tournamentHistory - The history of the tournament.
 */
const tournamentHistory = ref<TournamentHistoryType>({
    content: '',
    images: [],
    title: '',
    _id: ''
});

/**
 * @ref {Ref<TournamentType>} tournament - The tournament to update or create.
 */
const tournament = ref<TournamentType>({
    city: '',
    address: '',
    zipCode: '',
    availablePlaces: 0,
    participants: [],
    startDate: moment(new Date()).format(),
    status: '',
    tournamentHistory: tournamentHistory.value,
    price: 0
});


/**
 * @function setShowDeleteParticipantModal - Function to show the delete participant modal.
 */
function setShowDeleteParticipantModal(participant: ParticipantType) {
    participantToDelete.value = participant;
    showDeleteParticipantModal.value = true;
}

/**
 * @function setShowDeleteModal - Function to show the delete modal.
 */
function setShowDeleteModal(tournamentToDelete: TournamentType) {
    tournament.value = tournamentToDelete;
    showDeleteModal.value = true;
}

/**
 * @function setShowParticipantModal - Function to show the participant modal.
 */
function setShowParticipantModal(tournamentToUpdate: TournamentType) {
    tournament.value = tournamentToUpdate;
    showParticipantModal.value = true;
}

/**
 * @computed {TournamentType[]} openTournaments - The list of open tournaments.
 */
const openTournaments = computed(() =>
    tournaments.value.filter((tournament) => tournament.status === 'open')
);

/**
 * @computed {TournamentType[]} closedTournaments - The list of closed tournaments.
 */
const closedTournaments = computed(() =>
    tournaments.value.filter((tournament) => tournament.status === 'closed')
);

/**
 * @computed {TournamentType[]} cancelledTournaments - The list of cancelled tournaments.
 */
const cancelledTournaments = computed(() =>
    tournaments.value.filter((tournament) => tournament.status === 'cancelled')
);

/**
 * @computed {boolean} isSmallScreen - Determines whether the screen is small or not.
 */
const isSmallScreen = computed(() => servicesStore.smallDeviceScreen);

/**
 * @function setShowTournamentModal - Function to show the tournament modal.
 */
function setShowTournamentModal(tournamentToUpdate: TournamentType) {
    tournament.value = tournamentToUpdate;
    showCreateTournamentModal.value = true;
}

/**
 * @function closeTournamentModal - Function to close the tournament modal.
 */
function closeTournamentModal() {
    resetTournament();
    showCreateTournamentModal.value = false;
}

/**
 * @function closeTournamentHistoryModal - Function to close the tournament history modal.
 */
async function closeTournamentHistoryModal() {
    resetTournament();
    showHistoryModal.value = false;
    await getTournaments();
}

/**
 * @function closeTournamentInfosModal - Function to close the tournament infos modal.
 */
function closeTournamentInfosModal() {
    resetTournament();
    showInfosModal.value = false;
}

/**
 * @function closeTournamentParticipantModal - Function to close the tournament participant modal.
 */
function closeTournamentParticipantModal() {
    resetTournament();
    showParticipantModal.value = false;
}

/**
 * @function closeTournamentDeleteParticipantModal - Function to close the tournament delete participant modal.
 */
function closeTournamentDeleteParticipantModal() {
    showDeleteParticipantModal.value = false;
}

/**
 * @function closeTournamentDeleteModal - Function to close the tournament delete modal.
 */
function closeTournamentDeleteModal() {
    resetTournament();
    showDeleteModal.value = false;
}

/**
 * @function deleteTournament - Function to delete the tournament.
 */
async function deleteTournament() {
    const toastText = 'Tournois annulé';
    const toastErrorText = 'Erreur lors de la annulation du tournois';
    try {
        tournament.value.status = 'cancelled';
        await TournamentActions.updateTournament(tournament.value);
        toast.success(toastText);
        await getTournaments();
    } catch (error) {
        toast.error(toastErrorText);
    }
}

/**
 * @function addImage - Function to add an image to the tournament history.
 */
function addImage(image: string) {
    tournament.value.tournamentHistory.images.push(image);
}

/**
 * @function removeImage - Function to remove an image from the tournament history.
 */
async function removeImage(image: string) {
    const index = tournament.value.tournamentHistory.images.findIndex((img) => img === image);
    tournament.value.tournamentHistory.images.splice(index, 1);
    if (tournament.value._id) {
        await TournamentActions.updateTournament(tournament.value);
    }

}

/**
 * @function setShowHistoryModal - Function to show the history modal.
 * @param {TournamentType} tournamentToUpdate - The tournament to update.
 */
function setShowHistoryModal(tournamentToUpdate: TournamentType) {
    tournament.value = tournamentToUpdate;
    showHistoryModal.value = true;
}

/**
 * @function setShowInfosModal - Function to show the infos modal.
 * @param {TournamentType} tournamentToShow - The tournament to show.
 */
function setShowInfosModal(tournamentToShow: TournamentType) {
    tournament.value = tournamentToShow;
    showInfosModal.value = true;
}

/**
 * @function addParticipant - Function to add a participant to the tournament.
 * @param {ParticipantType} participant - The participant to add.
 * @param {string} tournamentId - The id of the tournament.
 */
async function addParticipant(participant: ParticipantType, tournamentId: string) {
    const toastText = 'Participant ajouté';
    const toastErrorText = "Erreur lors de l'ajout du participant";
    try {
        await TournamentActions.addParticipant(tournament.value._id!, participant);
        toast.success(toastText);
        await getTournaments();
        tournament.value = tournaments.value.find((tournament) => tournament._id === tournamentId)!;
    } catch (error) {
        toast.error(toastErrorText);
    }
}

/**
 * @function deleteParticipant - Function to delete a participant from the tournament.
 * @param {string} participantId - The id of the participant.
 * @param {string} tournamentId - The id of the tournament.
 */
async function deleteParticipant(participantId: string, tournamentId: string) {
    const toastText = 'Participant supprimé';
    const toastErrorText = 'Erreur lors de la suppression du participant';
    try {
        await TournamentActions.deleteParticipant(tournament.value._id!, participantId);
        toast.success(toastText);
        await getTournaments();
        tournament.value = tournaments.value.find((tournament) => tournament._id === tournamentId)!;
    } catch (error) {
        toast.error(toastErrorText);
    }
}

/**
 * @function deleteTournamentHistory - Function to delete the tournament history.
 * @param {TournamentType} tournamentToUpdate - The tournament to update.
 */
async function deleteTournamentHistory(tournamentToUpdate: TournamentType) {
    const toastText = 'Historique supprimé';
    const toastErrorText = 'Erreur lors de la suppression du contenu';
    try {
        for (let image of tournamentToUpdate.tournamentHistory.images) {
            await Upload.deleteImage(image);
        }
        tournamentToUpdate.tournamentHistory = {
            content: null,
            images: [],
            title: null
        };
        await TournamentActions.updateTournament(tournamentToUpdate);
        toast.success(toastText);
        await getTournaments();
    } catch (error) {
        toast.error(toastErrorText);
    }
}

/**
 * @function getTournaments - Function to get the tournaments.
 */
async function getTournaments() {
    const response = await TournamentActions.getTournaments();
    tournaments.value = response.data;
}

/**
 * @function updateTournament - Function to update the tournament.
 * @param {TournamentType} tournament - The tournament to update.
 */
async function updateTournament(tournament: TournamentType) {
    const toastText = tournament._id ? 'Tournois modifié' : 'Tournois créé';
    const toastErrorText = tournament._id
        ? 'Erreur lors de la modification du tournois'
        : 'Erreur lors de la création du tournois';
    try {
        if (tournament._id) {
            await TournamentActions.updateTournament(tournament);
        } else {
            await TournamentActions.createTournament(tournament);
        }
        closeTournamentModal();
        await getTournaments();
        toast.success(toastText);
    } catch (error) {
        toast.error(toastErrorText);
    }
}

/**
 * @function addHistory - Function to add the history to the tournament.
 * @param {TournamentHistoryType} history - The history to add.
 */
async function addHistory(history: TournamentHistoryType) {
    const toastText = 'Historique ajouté';
    const toastErrorText = "Erreur lors de l'ajout de l'historique";
    tournament.value.tournamentHistory = history;
    try {
        await TournamentActions.addTournamentHistory(tournament.value._id!, history);
        await getTournaments();
        toast.success(toastText);
    } catch (error) {
        toast.error(toastErrorText);
    }
}

/**
 * @function resetTournament - Function to reset the tournament.
 */
function resetTournament() {
    tournament.value = {
        city: '',
        address: '',
        zipCode: '',
        availablePlaces: 0,
        participants: [],
        startDate: moment(new Date()).format('JJ-MM-AAAATHH:MM'),
        status: '',
        tournamentHistory: tournamentHistory.value,
        price: 0
    };
}

/**
 * @event onMounted - Lifecycle hook that is called after the component has been mounted.
 * Get the tournaments and reset the tournament.
 * reset the tournament
 */
onMounted(async () => {
    await getTournaments();
    resetTournament();
});
</script>

<style scoped lang="scss">
.tournaments-view {
    @include view-layout;
    &-header {
        @include header-layout;
    }
    &-tournaments {
        @include card-container;
    }
}
</style>
