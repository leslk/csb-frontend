<template>
    <div class="tournaments-view">
        <div class="tournaments-view-header">
            <CsbTitle title="Tournaments" />
            <CsbButton
                :is-icon-button="isSmallScreen"
                icon="fa-solid fa-plus"
                label="Créer un nouveau tournoi"
                @click="showCreateTournamentModal = true"
            />
        </div>
        <section>
            <h2>Tournois à venir</h2>
            <div v-if="upcomingTournaments.length > 0">
                <div v-for="tournament in upcomingTournaments" :key="tournament.id">
                    <p>{{ tournament.name }}</p>
                </div>
            </div>
            <CsbEmptyState v-else text="Aucun tournoi en cours" />
        </section>
        <section>
            <h2>Tournois passés</h2>
            <div v-if="pastTournaments.length > 0">
                <div v-for="tournament in upcomingTournaments" :key="tournament.id">
                    <p>{{ tournament.name }}</p>
                </div>
            </div>
            <CsbEmptyState v-else text="Aucun tournoi en cours" />
        </section>
    </div>
    <CsbModal :show="showCreateTournamentModal" @close="showCreateTournamentModal = false">
        <template #header>
            <h2>Créer un nouveau tournoi</h2>
        </template>
        <template #content>
            <p>Contenu du formulaire de création de tournoi</p>
        </template>
        <template v-slot:footer>
            <csb-button label="Créer" />
            <csb-button label="Annuler" />
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { ref, computed } from 'vue';
import CsbModal from '@/components/common/CsbModal.vue';
import { useServicesStore } from '@/stores/services';

const upcomingTournaments = ref<any>([]);
const pastTournaments = ref<any>([]);
const showCreateTournamentModal = ref(false);
const servicesStore = useServicesStore();

const isSmallScreen = computed(() => servicesStore.getSmallDeviceScreen);
</script>

<style scoped lang="scss">
.tournaments-view {
    .tournaments-view-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 60px;
    }
}
</style>
