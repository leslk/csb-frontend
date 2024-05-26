<template>
    <main>
        <div class="user-tournaments-view-header">
            <div class="user-tournaments-view-header-text">
                <h1 class="user-tournaments-view-main-title">TOURNOIS</h1>
            </div>
            <img
                :src="Image"
                class="user-tournaments-view-image"
                alt="home page image: photo de tournoi de basket-ball"
            />
        </div>
        <div class="user-tournaments-view-content">
            <CsbSection>
                <template #header>
                    <CsbTitle class="user-tournaments-view-title" title="PROCHAINS TOURNOIS" />
                </template>
                <template #content>
                    <div :style="gridTournamentStyle" class="user-tournaments-view-tournaments" v-if="displayedTournaments.length > 0">
                        <div v-for="(tournament, index) in displayedTournaments" :key="index" class="user-tournaments-view-tournament">
                            <img class="user-tournaments-view-tournament__image" :src="UpcomingImage" alt="home page image: photo de tournoi de basket-ball" />
                            <div class="user-tournaments-view-tournament__content">
                                <p>{{ DateUtils.getDate(tournament.startDate) }}</p>
                                <h2>{{ tournament.city.toUpperCase() }}</h2>
                                <p>{{ DateUtils.getTime(tournament.startDate)}}</p>
                            </div>
                            <div class="user-tournaments-view-tournament__absolute">
                                <p>{{ `${tournament.price} €` }}</p>
                                <CsbButton
                                    class="user-tournaments-view-tournament__button"
                                    label="S'INSCRIRE"
                                    @click="setTournamentRegistration(tournament)"
                                />
                            </div>
                        </div>
                    </div>
                    <CsbEmptyState v-else text="Aucun tournoi à venir" class="user-tournaments-view-empty-state"/>
                    <CsbButton
                        color="#f9ee57"
                        text-color="#000000"
                        v-if="totalTournaments > numberOfDisplayedTournaments"
                        class="user-tournaments-view-more"
                        :label="seeMoreLabel"
                        @click="setDisplayedTournaments"
                    />
                </template>
            </CsbSection>
            <CsbSection v-if="tournamentsWithHistory.length > 0">
                <template #header>
                    <CsbTitle class="user-tournaments-view-title" title="ANCIENS TOURNOIS" />
                </template>
                <template #content>
                    <CsbCarousel :length="tournamentsWithHistory.length" :gap="1">
                        <template #slide>
                            <slide v-for="(tournament, index) in tournamentsWithHistory" :key="index">
                                <div class="user-tournaments-view-tournament-history">
                                    <img 
                                        class="user-tournaments-view-tournament-history__image" 
                                        :src="tournament.tournamentHistory.images[0]" 
                                        alt="home page image: photo de tournoi de basket-ball" 
                                    />
                                    <div class="user-tournaments-view-tournament-history__content">
                                        <h2>{{ DateUtils.getDate(tournament.startDate) }}</h2>
                                        <p>{{ tournament.city.toUpperCase() }}</p>
                                    </div>
                                    <CsbButton
                                        class="user-tournaments-view-tournament-history__button"
                                        label="VOIR LE DÉTAIL"
                                        @click="redirectToTournamentDetails(tournament._id!)"
                                    />
                                </div>
                            </slide>
                        </template>
                    </CsbCarousel>
                </template>
            </CsbSection>
        </div>
    </main>
    <TournamentRegistration 
        :show="showTournamentRegistration"
        :tournament="selectedTournament!" 
        @close="setTournamentRegistration(null)" 
        @sendRegistration="sendRegistration"
        :sent-status="sentStatus"
    />
</template>

<script setup lang="ts">
import Image from '@/assets/tournament.jpg';
import UpcomingImage from '@/assets/upcoming_tournament.jpeg';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { Tournament } from '@/services/types';
import { Tournament as CsbTournament,Tournament as TournamentService } from '@/services/services';
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbSection from '@/components/common/CsbSection.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import TournamentRegistration from '@/components/tournament/TournamentRegistration.vue';
import { DateUtils } from '@/services/services';
import CsbCarousel from '@/components/common/CsbCarousel.vue';
import { Slide } from 'vue3-carousel';
import { useRouter } from 'vue-router';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';

/**
 * Vue component for the user tournaments view.
 * @component UserTournamentsView
 * @example <UserTournamentsView />
 */


/**
 * @ref {Ref<Tournament[]>} tournamentsWithHistory - The tournaments with history.
 */
const tournamentsWithHistory = ref<Tournament[]>([]);

/**
 * @ref {Ref<number>} totalTournaments - The total number of tournaments.
 */
const totalTournaments = ref<number>(0);

/**
 * @ref {Ref<number>} numberOfDisplayedTournaments - The number of displayed tournaments.
 */
const numberOfDisplayedTournaments = 3;

/**
 * @ref {Ref<Tournament[]>} displayedTournaments - The displayed tournaments.
 */
const displayedTournaments = ref<Tournament[]>([]);

/**
 * @ref {Ref<Tournament[]>} upcomingTournaments - The upcoming tournaments.
 */
const upcomingTournaments = ref<Tournament[]>([]);

/**
 * router to navigate
 */
const router = useRouter();

/**
 * @ref {Ref<boolean>} showTournamentRegistration - The visibility of the tournament registration.
 */
const showTournamentRegistration = ref(false);

/**
 * @ref {Ref<Tournament | null>} selectedTournament - The selected tournament.
 */
const selectedTournament = ref<Tournament | null>(null);

/**
 * @ref {Ref<string>} sentStatus - The status of the sent registration.
 */
const sentStatus = ref('');

/**
 * @const seeMoreLabel - The label of the see more button.
 */
const seeMoreLabel = computed(() => displayedTournaments.value.length < totalTournaments.value ? 'Voir plus' : 'Voir moins');

/**
 * Set the displayed tournaments.
 */
function setDisplayedTournaments() {
    if (displayedTournaments.value.length < totalTournaments.value) {
        displayedTournaments.value = upcomingTournaments.value;
    } else {
        displayedTournaments.value = upcomingTournaments.value.slice(0, numberOfDisplayedTournaments);
    }
}

/**
 * Fetch the tournaments.
 */
async function fetchTournaments() {
    const response = await CsbTournament.getTournaments();
    upcomingTournaments.value = response.data.filter(
        (tournament: Tournament) => tournament.status === 'open'
    ).sort((a: Tournament, b: Tournament) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    displayedTournaments.value = upcomingTournaments.value.slice(0, numberOfDisplayedTournaments);
    totalTournaments.value = upcomingTournaments.value.length;
    tournamentsWithHistory.value = response.data.filter(
        (tournament: Tournament) => 
        tournament.tournamentHistory.content && 
        tournament.tournamentHistory.images.length > 0 && 
        tournament.tournamentHistory.title
    );
}

/**
 * Set the tournament registration.
 * @param tournament - The tournament to register.
 */
function setTournamentRegistration(tournament: Tournament | null) {
    if (showTournamentRegistration.value) {
        showTournamentRegistration.value = false;
        document.body.classList.remove('modal-open');
        selectedTournament.value = null;
        sentStatus.value = '';
    } else {
        document.body.classList.add('modal-open');
        selectedTournament.value = tournament;
        showTournamentRegistration.value = true;
    }
}


/**
 * @ref {Ref<boolean>} isSmallScreen - Determines if the screen is small.
 */
const isSmallScreen = ref(window.innerWidth < 768);

/**
 * @ref {ComputedRef<{gridTemplateColumns: string}>} gridMemberStyle - The style of the grid members.
 */
const gridTournamentStyle = computed(() => {
    if (isSmallScreen.value) {
        return { gridTemplateColumns: '1fr' };
    }
    else if (upcomingTournaments.value.length && upcomingTournaments.value.length < 3) {
        return { gridTemplateColumns: `repeat(${upcomingTournaments.value.length}, 1fr)` };
    } else {
        return { gridTemplateColumns: 'repeat(3, 1fr)' };
    }
})

/**
 * Handle the window resize.
 */
function handleWindowResize() {
    isSmallScreen.value = window.innerWidth < 768;
}

/**
 * Redirect to the tournament details.
 * @param tournamentId - The tournament id.
 */
function redirectToTournamentDetails(tournamentId: string) {
    router.push({ name: 'TournamentDetails', params: { id: tournamentId } });
}

/**
 * Send the registration.
 * @param id - The tournament id.
 * @param form - The registration form.
 */
async function sendRegistration(id: string, form: any) {
    try {
        await TournamentService.addParticipant(id, form);
        sentStatus.value = 'success';
    } catch (error) {
        sentStatus.value = 'error';
    }
}

/**
 * Listens for the resize event.
 */
window.addEventListener('resize', handleWindowResize);

/**
 * @event onMounted - Fetch the tournaments.
 */
onMounted(async () => {
    await fetchTournaments();
});

/**
 * Removes the resize event listener.
 */
onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<style lang="scss" scoped>
.user-tournaments-view {
    &-header {
        @include user-header;
    }
    &-content {
        text-align: center;
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 4rem;
        align-items: center;
        width: 100%;
    }
    &-tournament {
        width: 100%;
        position: relative;
        &__image {
            width: 100%;
            height: 400px;
            object-fit: cover;
        }
        &__content {
            color: $primaryColor;
            padding: 2rem 1rem;
            font-weight: 900;
            position: absolute;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
            width: 100%;
            text-align: center;
            h2 {
                font-size: 2rem;
                margin: 0;
            }
            p {
                font-size: 2rem;
                margin: 0;
            }
        }
        &__absolute {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            width: 100%;
            transform: translate(-50%, 0);
            p {
                padding: 1rem;
                font-size: 2rem;
                color: $primaryColor;
                font-weight: bold;
            }
        }
        &__button {
            margin: auto;
            width: 70%;
        }
    }
    &-more {
        margin-top: 2rem;
        width: 100%;
        &-button {
            width: 100%;
        }
    }
    &-empty-state {
        margin-top: 0;
       font-weight: bold;
    }
    &-tournament-history {
        height: 400px;
        width: 100%;
        position: relative;
        &__image {
            width: 100%;
            height: 400px;
            object-fit: cover;
        }
        &__content {
            position: absolute;
            color: $primaryColor;
            background-color: rgba($secondaryColor, 0.8);
            padding: 1rem 2rem;
            top: 0;
            font-weight: 900;
            display: flex;
            width: 100%;
            flex-direction: column;
            gap: 0.625rem;
            h2 {
                font-size: 2rem;
                margin: 0;
            }
            p {
                font-size: 2rem;
                margin: 0;
            }
        }
        &__button {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translate(-50%, 0);
        }
    }
    &-tournaments {
        align-items: center;
        justify-content: center;
        display: grid;
        width: 100%;
        gap: 2rem;
    }
    @include mf-tablet-break-point {
        &-content {
            max-width: 1200px;
            margin: auto;
        }
    }
}
</style>