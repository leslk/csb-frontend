<template>
    <div class="tournaments-view">
        <div class="tournaments-view-header">
            <CsbTitle title="Tournaments" />
            <CsbButton
                :is-icon-button="isSmallScreen"
                icon="fa-solid fa-plus"
                label="Créer un nouveau tournoi"
                @click="showTournamentModal"
            />
        </div>
        <CsbSection>
            <template #header>
                <h2>Tournois à venir</h2>
            </template>
            <template #content>
                <div class="tournaments-view-tournaments" v-if="openTournaments.length > 0">
                    <div v-for="tournament in openTournaments" :key="tournament._id">
                        <TournamentCard :tournament="tournament" />
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
                        <TournamentCard :tournament="tournament" />
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
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import TournamentCard from '@/components/tournament/TournamentCard.vue';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import TournamentInfosModal from '@/components/tournament/TournamentInfosModal.vue';
import { ref, computed, onMounted } from 'vue';
import { useServicesStore } from '@/stores/services';
import { Tournament as TournamentActions } from '@/services/services';
import { toast } from 'vue3-toastify';
import CsbSection from '@/components/common/CsbSection.vue';

interface Tournament {
    location: string;
    availablePlaces: number;
    participants: [] | null;
    startDate: Date | undefined;
    description?: string;
    status: string;
    tournamentHistory: [] | null;
    _id?: string;
}

const showCreateTournamentModal = ref(false);
const tournaments = ref<Tournament[]>([]);
const tournament = ref<Tournament>({
    location: '',
    availablePlaces: 0,
    participants: null,
    startDate: undefined,
    status: '',
    tournamentHistory: null
});
const servicesStore = useServicesStore();

const openTournaments = computed(() =>
    tournaments.value.filter((tournament) => tournament.status === 'open')
);
const closedTournaments = computed(() =>
    tournaments.value.filter((tournament) => tournament.status === 'closed')
);

const isSmallScreen = computed(() => servicesStore.smallDeviceScreen);

function showTournamentModal() {
    showCreateTournamentModal.value = true;
}

function closeTournamentModal() {
    showCreateTournamentModal.value = false;
}

async function getTournaments() {
    const response = await TournamentActions.getTournaments();
    tournaments.value = response.data;
}

async function updateTournament(tournament: Tournament) {
    const toastText = tournament._id ? 'Tournois modifié' : 'Tournois créé';
    const toastErrorText = tournament._id
        ? 'Erreur lors de la modification du tournois'
        : 'Erreur lors de la création du tournois';
    try {
        if (tournament._id) {
            console.log('update tournament');
        } else {
            await TournamentActions.createTournament(tournament);
        }
        resetTournament();
        closeTournamentModal();
        await getTournaments();
        toast.success(toastText);
    } catch (error) {
        toast.error(toastErrorText);
    }
}

const resetTournament = () => {
    tournament.value = {
        location: '',
        availablePlaces: 0,
        participants: [],
        startDate: undefined,
        status: '',
        tournamentHistory: []
    };
};

onMounted(async () => {
    await getTournaments();
    console.log(tournaments.value);
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
