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

const showCreateTournamentModal = ref(false);
const showHistoryModal = ref(false);
const showInfosModal = ref(false);
const showParticipantModal = ref(false);
const tournaments = ref<TournamentType[]>([]);
const servicesStore = useServicesStore();
const showDeleteParticipantModal = ref(false);
const showDeleteModal = ref(false);
const participantToDelete = ref<ParticipantType>();
const tournamentHistory = ref<TournamentHistoryType>({
    content: '',
    images: [],
    title: ''
});
const tournament = ref<TournamentType>({
    location: '',
    availablePlaces: 0,
    participants: [],
    startDate: moment(new Date()).format(),
    status: '',
    tournamentHistory: tournamentHistory.value,
    price: 0
});

function setShowDeleteParticipantModal(participant: ParticipantType) {
    participantToDelete.value = participant;
    showDeleteParticipantModal.value = true;
}

function setShowDeleteModal(tournamentToDelete: TournamentType) {
    tournament.value = tournamentToDelete;
    showDeleteModal.value = true;
}

function setShowParticipantModal(tournamentToUpdate: TournamentType) {
    tournament.value = tournamentToUpdate;
    showParticipantModal.value = true;
}

const openTournaments = computed(() =>
    tournaments.value.filter((tournament) => tournament.status === 'open')
);
const closedTournaments = computed(() =>
    tournaments.value.filter((tournament) => tournament.status === 'closed')
);

const cancelledTournaments = computed(() =>
    tournaments.value.filter((tournament) => tournament.status === 'cancelled')
);

const isSmallScreen = computed(() => servicesStore.smallDeviceScreen);

function setShowTournamentModal(tournamentToUpdate: TournamentType) {
    tournament.value = tournamentToUpdate;
    showCreateTournamentModal.value = true;
}

function closeTournamentModal() {
    resetTournament();
    showCreateTournamentModal.value = false;
}

async function closeTournamentHistoryModal() {
    resetTournament();
    showHistoryModal.value = false;
    await getTournaments();
}

function closeTournamentInfosModal() {
    resetTournament();
    showInfosModal.value = false;
}

function closeTournamentParticipantModal() {
    resetTournament();
    showParticipantModal.value = false;
}

function closeTournamentDeleteParticipantModal() {
    showDeleteParticipantModal.value = false;
}

function closeTournamentDeleteModal() {
    resetTournament();
    showDeleteModal.value = false;
}

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

function addImage(image: string) {
    tournament.value.tournamentHistory.images.push(image);
}

function removeImage(image: string) {
    const index = tournament.value.tournamentHistory.images.findIndex((img) => img === image);
    tournament.value.tournamentHistory.images.splice(index, 1);
}

function setShowHistoryModal(tournamentToUpdate: TournamentType) {
    tournament.value = tournamentToUpdate;
    showHistoryModal.value = true;
}

function setShowInfosModal(tournamentToShow: TournamentType) {
    tournament.value = tournamentToShow;
    showInfosModal.value = true;
}

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

async function deleteTournamentHistory(tournamentToUpdate: TournamentType) {
    const toastText = 'Historique supprimé';
    const toastErrorText = 'Erreur lors de la suppression du contenu';
    for (let image of tournamentToUpdate.tournamentHistory.images) {
        await Upload.deleteImage(image);
    }
    try {
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

async function getTournaments() {
    const response = await TournamentActions.getTournaments();
    tournaments.value = response.data;
}

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

async function addHistory(history: TournamentHistoryType) {
    const toastText = 'Historique ajouté';
    const toastErrorText = "Erreur lors de l'ajout de l'historique";
    tournament.value.tournamentHistory = history;
    try {
        await TournamentActions.addTournamentHistory(tournament.value._id!, history);
        closeTournamentHistoryModal();
        await getTournaments();
        toast.success(toastText);
    } catch (error) {
        toast.error(toastErrorText);
    }
}

function resetTournament() {
    tournament.value = {
        location: '',
        availablePlaces: 0,
        participants: [],
        startDate: moment(new Date()).format('JJ-MM-AAAATHH:MM'),
        status: '',
        tournamentHistory: tournamentHistory.value,
        price: 0
    };
}

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
