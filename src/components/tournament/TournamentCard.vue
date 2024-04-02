<template>
    <CsbCard>
        <template #content>
            <div class="tournament-card">
                <div class="tournament-card-header">
                    <CsbStatus :icon="status.icon" :text="status.text" :color="status.color" />
                    <div class="account-card-header-edit">
                        <i class="fa-solid fa-ellipsis" @click="setShowMenu" ref="menuIcon" />
                    </div>
                    <div v-if="showMenu" class="account-card-header-menu" ref="menu">
                        <p @click="setShowModal('delete')">Supprimer</p>
                        <p @click="setShowModal('update')">Modifier le tournoi</p>
                    </div>
                </div>
                <div class="tournament-card-content">
                    <i class="fa-solid fa-basketball tournament-card-icon" />
                    <div class="tournament-card-value">
                        <p class="tournament-card-label">Lieu:</p>
                        <p class="tournament-card-data">{{ tournament.location }}</p>
                    </div>
                    <div class="tournament-card-value">
                        <p class="tournament-card-label">Places disponibles:</p>
                        <p class="tournament-card-data">{{ tournament.availablePlaces }}</p>
                    </div>
                    <div class="tournament-card-value">
                        <p class="tournament-card-label">Participants:</p>
                        <p class="tournament-card-data">
                            {{ numberOfParticipants }}
                        </p>
                    </div>
                    <div class="tournament-card-value">
                        <p class="tournament-card-label">Date:</p>
                        <p class="tournament-card-data">
                            {{ getFormattedDate(tournament.startDate) }}
                        </p>
                    </div>
                </div>
                <div class="tournament-card-footer">
                    <CsbButton label="Voir les détails" @click="setShowModal('infos')" />
                </div>
            </div>
        </template>
    </CsbCard>
</template>

<script setup lang="ts">
import { ref, type PropType, computed } from 'vue';
import CsbCard from '@/components/common/CsbCard.vue';
import CsbStatus from '@/components/common/CsbStatus.vue';
import CsbButton from '../common/CsbButton.vue';
import moment from 'moment';

interface Tournament {
    location: string;
    availablePlaces: number;
    participants: [] | null;
    startDate: string;
    description?: string;
    status: string;
    tournamentHistory: [] | null;
    _id?: string;
}

const props = defineProps({
    tournament: {
        type: Object as PropType<Tournament>,
        required: true
    }
});

function getFormattedDate(date: string) {
    if (typeof date === 'string') {
        const tournamentDate = moment(date);
        return tournamentDate.format('DD MMM YYYY à HH:mm');
    }
}

const status = computed(() => {
    if (props.tournament.status === 'open') {
        return {
            color: '#00c853',
            icon: 'fa-regular fa-clock',
            text: 'En cours'
        };
    } else {
        return {
            color: '#d1000f',
            icon: 'fa-solid fa-circle-exclamation',
            text: 'Terminé'
        };
    }
});

const numberOfParticipants = computed(() =>
    props.tournament.participants?.length ? props.tournament.participants.length : 0
);
const emit = defineEmits(['showDeleteModal', 'showUpdateModal']);
const showMenu = ref(false);

function setShowMenu() {
    showMenu.value = !showMenu.value;
}

function setShowModal(type: string) {
    if (type === 'delete') {
        emit('showDeleteModal', props.tournament);
    } else if (type === 'update') {
        emit('showUpdateModal', props.tournament);
    }
}
</script>

<style scoped lang="scss">
.tournament-card {
    @include card-layout;
    &-header {
        @include card-header;
    }
    &-icon {
        @include card-icon;
    }
    &-content {
        @include card-content;
    }
    &-data {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &-value {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    &-label {
        font-weight: bold;
        color: $secondaryColor;
    }
    &-footer {
        @include card-footer;
    }
}
</style>
