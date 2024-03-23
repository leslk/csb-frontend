<template>
    <div class="site-content-view">
        <div class="site-content-view-header">
            <CsbTitle title="Contenu du site" />
            <CsbButton
                :is-icon-button="isSmallScreen"
                icon="fa-solid fa-plus"
                label="Créer un nouveau contenu"
            />
        </div>
        <section>
            <h2>Description</h2>
            <div v-if="activeSiteContents.length > 0">
                <div v-for="siteContent in activeSiteContents" :key="siteContent.id">
                    <p>{{ siteContent.name }}</p>
                </div>
            </div>
            <CsbEmptyState v-else text="Aucun contenu actif" />
        </section>
        <section>
            <h2>Membres</h2>
            <div v-if="members.length > 0">
                <div v-for="member in members" :key="member.id">
                    <p>{{ member.name }}</p>
                </div>
            </div>
            <CsbEmptyState v-else text="Aucun membres" />
        </section>
        <section>
            <h2>Contact</h2>
            <div v-if="contact">
                <div>
                    <p>{{ contact }}</p>
                </div>
            </div>
            <CsbEmptyState v-else text="Aucun contact" />
        </section>
    </div>
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';
import { computed, ref } from 'vue';
import { useServicesStore } from '@/stores/services';

const activeSiteContents = ref<any>([]);
const members = ref<any>([]);
const contact = ref<any>();
const servicesStore = useServicesStore();

const isSmallScreen = computed(() => servicesStore.getSmallDeviceScreen);
</script>

<style scoped lang="scss">
.site-content-view {
    .site-content-view-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3.75rem;
    }
}
</style>
