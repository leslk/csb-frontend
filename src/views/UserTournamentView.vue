<template>
   <main>
        <div class="user-tournament-view-header">
            <div class="user-tournament-view-header-text">
                <h1 class="user-tournaments-view-main-title">TOURNOIS</h1>
            </div>
            <img
                :src="Image"
                class="user-tournament-view-image"
                alt="home page image: photo de tournoi de basket-ball"
            />
        </div>
        <div class="user-tournament-view-content">
            <CsbSection v-if="tournament && tournament.tournamentHistory.images.length > 0">
                <template #header>
                    <CsbTitle title="PHOTOS" />
                </template>
                <template #content>
                    <CsbCarousel :length="tournament.tournamentHistory.images.length" :gap="1">
                        <template #slide>
                            <slide v-for="(image, index) in tournament.tournamentHistory.images" :key="index">
                                <div class="user-tournament-view-image__container">
                                    <img 
                                        class="user-tournament-view__image" 
                                        :src="image" 
                                        alt="home page image: photo de tournoi de basket-ball" 
                                    />
                                </div>
                            </slide>
                        </template>
                    </CsbCarousel>
                </template>
            </CsbSection>
            <CsbSection class="user-tournament-view-history" v-if="tournament">
                <template #header>
                    <CsbTitle title="DÉTAILS DU TOURNOI" />
                </template>
                <template #content>
                    <div class="user-tournament-view-history-date">
                        <span>Date: </span>
                        <p>{{ DateUtils.getDate(tournament.startDate) }}</p>
                    </div>
                    <div class="user-tournament-view-history-place">
                        <span>Lieu: </span>
                        <p>{{ tournament.city.toUpperCase() }}</p>
                    </div>
                    <h3 class="user-tournament-view-history-title">{{ tournament.tournamentHistory.title }}</h3>
                    <p class="user-tournament-view-history-text">{{ tournament.tournamentHistory.content }}</p>
                </template>
            </CsbSection>
        </div>
   </main>
</template>

<script setup lang="ts">
import Image from '@/assets/tournament_detail.jpg';
import { onMounted, ref } from 'vue';
import CsbSection from '@/components/common/CsbSection.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbCarousel from '@/components/common/CsbCarousel.vue';
import { DateUtils } from '@/services/services';
import { Slide } from 'vue3-carousel';
import { useRoute } from 'vue-router';
import type { Tournament } from '@/services/types';
import { Tournament as TournamentService } from '@/services/services';

const route = useRoute();
const tournament = ref<Tournament | null>(null);

onMounted( async () => {
    const response = await TournamentService.getTournament(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);
    tournament.value = response.data;
});
</script>

<style lang="scss">
.user-tournament-view {
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
    &-image_container {
        height: 400px;
        width: 10%;
    }
    &__image {
        width: 100%;
        height: 400px;
        object-fit: cover;
    }
    &-history {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
    }
    &-history-date, &-history-place {
        display: flex;
        line-height: 2rem;
        gap: 1rem;
        align-items: center;
        justify-content: flex-start;
        span {
            font-weight: bold;
        }
    }
    &-history-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        width: 100%;
    }
    &-history-title {
        margin-top: 2rem;
        font-size: 1.5rem;
        text-align: start;
        font-weight: bold;
    }
    &-history-text {
        margin-top: 1rem;
        text-align: start;
    }
    @include mf-tablet-break-point {
        &-content {
            max-width: 1200px;
            margin: auto;
        }
    }
}
</style>