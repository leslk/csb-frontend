<template>
    <main>
        <div class="home-view-header">
            <div class="home-view-header-text">
                <h1 class="home-view-main-title">Caen Street Ball</h1>
                <CsbTitle class="home-view-title" title="LE STREET BALL POUR TOUS" />
            </div>
            <img
                :src="Image"
                class="home-view-image"
                alt="home page image: photo de groupe d'un tournois caen street ball"
            />
        </div>
        <div class="home-view-content" v-if="siteContent">
            <CsbSection class="home-view-tournaments" v-if="upcomingTournaments.length > 0">
                <template #header>
                    <CsbTitle class="home-view-title" title="TOURNOIS" />
                </template>
                <template #content>
                    <CsbCarousel :wrap-around="true" :length="upcomingTournaments.length">
                        <template #slide>
                            <slide v-for="(tournament, index) in upcomingTournaments" :key="index">
                                <div class="home-view-tournament" :style="{ backgroundColor: index % 2 === 0 ? '#d8d8d8' : 'black', color: index % 2 === 0 ? 'black' : '#f9ee57' }">
                                    <p>{{ DateUtils.formatDate(tournament.startDate) }}</p>
                                    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.99366 9.92593C8.1824 9.8575 9.9121 7.98253 9.84557 5.72436C9.77905 3.47303 7.9562 1.7007 5.76746 1.76913C3.61864 1.83072 1.90889 3.6441 1.91555 5.85437C1.9355 8.12624 3.73839 9.94646 5.94709 9.93278H6.00031L5.99366 9.92593Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M26.4975 18.2596C25.5994 16.631 24.6946 15.0092 23.7898 13.3806C22.579 11.2046 21.3749 9.0285 20.1641 6.85244C20.0843 6.70874 19.9978 6.55819 19.9113 6.42133C19.2194 5.36067 18.155 5.32646 17.4365 6.37343C16.9907 7.01667 16.5982 7.69412 16.1858 8.35789C15.281 9.80175 14.3962 11.2661 13.4781 12.6963C12.6731 13.9554 11.2295 14.3728 10.0786 13.6201C8.81457 12.8469 7.19797 13.1137 6.23332 14.2497C4.96931 15.762 3.69199 17.2606 2.42132 18.7729C2.24835 18.9782 2.10864 19.204 2.00885 19.4435C1.80262 19.8472 1.94898 20.3536 2.34149 20.5657C2.42132 20.6068 2.50781 20.641 2.59429 20.6478C2.88701 20.73 3.19304 20.7642 3.49906 20.7642C7.09817 20.7642 10.6973 20.771 14.2897 20.7642C17.8889 20.7642 21.488 20.7642 25.0804 20.7642C25.3266 20.7642 25.5794 20.7436 25.8255 20.6889C26.7104 20.4973 27.1029 19.8198 26.8301 18.9576C26.7436 18.7044 26.6372 18.4649 26.5041 18.2323L26.4975 18.2596Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <h2>{{ tournament.city.toUpperCase() }}</h2>
                                </div>
                            </slide>
                        </template>
                    </CsbCarousel>
                </template>
            </CsbSection>
            <CsbSection class="home-view-about-us">
                <template #header>
                    <CsbTitle class="home-view-title" title="PRÉSENTATION DE CAEN STREETBALL" />
                </template>
                <template #content>
                    <div class="home-view-about-us">
                        <p>{{ siteContent?.aboutUs }}</p>
                        <div class="home-view-members" :style="gridMemberStyle">
                            <MemberCard
                                :member="member"
                                v-for="member in siteContent.members"
                                :key="member._id"
                            />
                        </div>
                    </div>
                </template>
            </CsbSection>
            <CsbSection class="home-tournaments-history" v-if="tournamentsHistoryImage.length > 0">
                <template #header>
                    <CsbTitle class="home-view-title" title="PHOTOS DES TOURNOIS" />
                </template>
                <template #content>
                    <p style="padding-bottom: 2rem;">Afin d’illustrer l’engagement communautaire de Caen Streetball, voici quelques clichés des derniers évènements sportifs mettant en avant les jeunes talents du streetball.<br/> Entre esprit d’équipe, street culture et passion, rejoignez les compétitions amicales, familiales ou des rencontres sportives autour de tournois de streetball !<br> En plus, les entrainements en plein air sont à nouveau de saison... </p>
                    <div class="home-view-tournaments-history" :style="gridTournamentHistoryStyle">
                        <img
                            :src="image"
                            v-for="image in displayedTournamentsHistoryImage"
                            alt="home page image: photo de tournoi de basket-ball"
                            :key="image"
                            class="home-view-tournaments-history-image"
                        />
                    </div>
                        <CsbButton
                            color="#f9ee57"
                            text-color="#000000"
                            v-if="tournamentHistoryImageTotal > numberOfDisplayedTournamentsHistoryImage"
                            class="home-view-tournaments-history-more"
                            :label="SeeMoreLabel"
                            @click="setDisplayedTournamentsHistoryImage"
                        />
                </template>
            </CsbSection>
        </div>
    </main>
</template>

<script setup lang="ts">
import Image from '@/assets/home_image.jpg';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { SiteContent, Tournament } from '@/services/types';
import { SiteContent as CsbSiteContent, Tournament as CsbTournament } from '@/services/services';
import MemberCard from '@/components/member/MemberCard.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbSection from '@/components/common/CsbSection.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbCarousel from '@/components/common/CsbCarousel.vue';
import { DateUtils } from '@/services/services';
import { Slide } from 'vue3-carousel';

/**
 * Vue component for the home page.
 * This component displays the main information of the site.
 * @component HomeView
 * @exemple <HomeView />
 */


/**
 * Reference to the site content.
 */
const siteContent = ref<SiteContent>();

/**
 * Reference to the tournaments history images.
 */
const tournamentsHistoryImage = ref<string[]>([]);

/**
 * Reference to the total number of tournaments history images.
 */
const tournamentHistoryImageTotal = ref<number>(0);

/**
 * Number of displayed tournaments history images.
 */
const numberOfDisplayedTournamentsHistoryImage = 6;

/**
 * Reference to the displayed tournaments history images.
 */
const displayedTournamentsHistoryImage = ref<string[]>([]);

/**
 * Reference to the upcoming tournaments.
 */
const upcomingTournaments = ref<Tournament[]>([]);

/**
 * Fetch the site content.
 */
async function fetchSiteContent() {
    const response = await CsbSiteContent.getSiteContent();
    siteContent.value = response.data[0];
}

/**
 * Fetch the tournaments.
 */
async function fetchTournaments() {
    const response = await CsbTournament.getTournaments();
    upcomingTournaments.value = response.data.filter(
        (tournament: Tournament) => tournament.status === 'open'
    );
    const tournamentHistories = response.data.map(
        (tournament: Tournament) => tournament.tournamentHistory
    );
    for (const tournamentHistory of tournamentHistories) {
        for (const image of tournamentHistory.images) {
            tournamentsHistoryImage.value.push(image);
        }
    }
    tournamentHistoryImageTotal.value = tournamentsHistoryImage.value.length;
    displayedTournamentsHistoryImage.value = tournamentsHistoryImage.value.slice(0, numberOfDisplayedTournamentsHistoryImage);
}

/**
 * Determines whether the screen is small or not.
 */
const isSmallScreen = ref(window.innerWidth < 768);

/**
 * The see more label for the tournaments history images.
 */
const SeeMoreLabel = computed(() => displayedTournamentsHistoryImage.value.length === tournamentsHistoryImage.value.length ? 'Voir moins' : 'Voir plus');

/**
 * The grid member style for the members.
 */
const gridMemberStyle = computed(() => {
    if (isSmallScreen.value) {
        return { gridTemplateColumns: '1fr' };
    }
    else if (siteContent.value?.members.length && siteContent.value?.members.length < 3) {
        return { gridTemplateColumns: `repeat(${siteContent.value.members.length}, 1fr)`,margin: 'auto' };
    } else {
        return { gridTemplateColumns: 'repeat(3, 1fr)' };
    }
})

/**
 * The grid tournament history style for the tournaments history images.
 */
const gridTournamentHistoryStyle = computed(() => {
    if (isSmallScreen.value) {
        return { gridTemplateColumns: '1fr' };
    }
    else if (tournamentsHistoryImage.value.length && tournamentsHistoryImage.value.length < 3) {
        return { gridTemplateColumns: `repeat(${tournamentsHistoryImage.value.length}, 1fr)` };
    } else {
        return { gridTemplateColumns: 'repeat(3, 1fr)' };
    }
})

/**
 * Handles the window resize event.
 */
function handleWindowResize() {
    isSmallScreen.value = window.innerWidth < 768;
}

/**
 * Set the displayed tournaments history images.
 */
function setDisplayedTournamentsHistoryImage() {
    if (displayedTournamentsHistoryImage.value.length === tournamentsHistoryImage.value.length) {
        displayedTournamentsHistoryImage.value = tournamentsHistoryImage.value.slice(0, numberOfDisplayedTournamentsHistoryImage);
    } else {
        displayedTournamentsHistoryImage.value = tournamentsHistoryImage.value;
    }
}

/**
 * Listens for the resize event.
 */
window.addEventListener('resize', handleWindowResize);
onMounted(async () => {
    await fetchSiteContent();
    await fetchTournaments();
});

/**
 * Removes the resize event listener.
 */
onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<style lang="scss">
.home-view {
    &-header {
        @include user-header;
    }
    &-title {
        font-size: 1.5rem !important;
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
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        width: 100%;
        height: 100%;
        &-svg {
            width: 28px;
            height: 22px;
        }
    }
    &-about-us, &-tournaments-history, &-tournaments {
        width: 100%;
        font-size: 1.5rem;
        line-height: 1.5;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    &-members,
    &-tournaments-history {
        align-items: center;
        justify-content: center;
        display: grid;
        gap: 2rem;
    }
    &-tournaments-history-image {
        width: 100%;
        object-fit: cover;
    }
    &-tournaments-history-more {
        margin-top: 2rem;
        width: 100%;
        &-button {
            width: 100%;
        }
    }
    @include mf-tablet-break-point {
        &-content {
            max-width: 1200px;
            margin: auto;
        }
        &-tournaments-history-image {
            width: 100%;
            height: 350px;
        }
    }
}
</style>
