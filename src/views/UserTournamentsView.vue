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
                    <div :style="gridMemberStyle" class="user-tournaments-view-tournaments">
                        <div v-for="(tournament, index) in displayedTournaments" :key="index" class="user-tournaments-view-tournament">
                            <img class="user-tournaments-view-tournament__image" :src="UpcomingImage" alt="home page image: photo de tournoi de basket-ball" />
                            <div class="user-tournaments-view-tournament__content">
                                <p>{{ DateUtils.getDate(tournament.startDate) }}</p>
                                <h2>{{ tournament.city.toUpperCase() }}</h2>
                                <p>{{ DateUtils.getTime(tournament.startDate)}}</p>
                            </div>
                            <CsbButton
                                class="user-tournaments-view-tournament__button"
                                label="S'INSCRIRE"
                            />
                        </div>
                    </div>
                    <CsbButton
                        color="#f9ee57"
                        text-color="#000000"
                        v-if="totalTournaments > numberOfDisplayedTournaments"
                        class="home-view-tournaments-history-more"
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
                                        <p>{{ tournament.city }}</p>
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
</template>

<script setup lang="ts">
import Image from '@/assets/tournament.jpg';
import UpcomingImage from '@/assets/upcoming_tournament.jpeg';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { Tournament } from '@/services/types';
import { Tournament as CsbTournament } from '@/services/services';
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbSection from '@/components/common/CsbSection.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { DateUtils } from '@/services/services';
import CsbCarousel from '@/components/common/CsbCarousel.vue';
import { Slide } from 'vue3-carousel';
import { useRouter } from 'vue-router';


const tournamentsWithHistory = ref<Tournament[]>([]);
const totalTournaments = ref<number>(0);
const numberOfDisplayedTournaments = 3;
const displayedTournaments = ref<Tournament[]>([]);
const upcomingTournaments = ref<Tournament[]>([]);
const router = useRouter();

const seeMoreLabel = computed(() => displayedTournaments.value.length < totalTournaments.value ? 'Voir plus' : 'Voir moins');

function setDisplayedTournaments() {
    if (displayedTournaments.value.length < totalTournaments.value) {
        displayedTournaments.value = upcomingTournaments.value;
    } else {
        displayedTournaments.value = upcomingTournaments.value.slice(0, numberOfDisplayedTournaments);
    }
}

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

const isSmallScreen = ref(window.innerWidth < 768);

const gridMemberStyle = computed(() => {
    if (isSmallScreen.value) {
        return { gridTemplateColumns: '1fr' };
    }
    else if (upcomingTournaments.value.length && upcomingTournaments.value.length < 3) {
        return { gridTemplateColumns: `repeat(${upcomingTournaments.value.length}, 1fr)` };
    } else {
        return { gridTemplateColumns: 'repeat(3, 1fr)' };
    }
})

function handleWindowResize() {
    isSmallScreen.value = window.innerWidth < 768;
}

function redirectToTournamentDetails(tournamentId: string) {
    router.push({ name: 'TournamentDetails', params: { id: tournamentId } });
}

window.addEventListener('resize', handleWindowResize);

onMounted(async () => {
    await fetchTournaments();
});

onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<style lang="scss">
.user-tournaments-view {
    &-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
    }
    &-header {
        position: relative;
    }
    &-title {
        font-size: 1.5rem;
    }
    &-header-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 7rem;
        font-weight: 900;
        gap: 1rem;
        color: $primaryColor;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    &-main-title {
        max-width: 400px;
        font-size: 5rem;
        line-height: 1;
        font-family: 'breakside';
        text-align: center;
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
        &__button {
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translate(-50%, 0);
            width: 70%;
        }
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