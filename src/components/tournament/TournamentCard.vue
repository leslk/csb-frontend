<template>
    <CsbCard>
        <template #content>
            <div class="tournament-card">
                <div class="tournament-card-header">
                    <CsbStatus :icon="status.icon" :text="status.text" :color="status.color" />
                    <div v-if="isOpenTournament" class="tournament-card-header-edit">
                        <i ref="menuIcon" class="fa-solid fa-ellipsis" @click="setShowMenu" />
                    </div>
                    <div ref="menu" v-if="showMenu" class="tournament-card-header-menu">
                        <p @click="setShowModal('update')">Modifier le tournoi</p>
                        <p @click="setShowModal('participant')">Ajouter un participant</p>
                        <p class="tournament-card-header__delete" @click="deleteTournament">
                            Annuler le tournoi
                        </p>
                    </div>
                </div>
                <div class="tournament-card-content">
                    <i class="fa-solid fa-basketball tournament-card-icon" />
                    <div class="tournament-card-value">
                        <p class="tournament-card-label">Lieu:</p>
                        <p class="tournament-card-data">{{ address }}</p>
                    </div>
                    <div class="tournament-card-value">
                        <p class="tournament-card-label">Participants:</p>
                        <p class="tournament-card-data">
                            {{ `${numberOfParticipants} / ${tournament.availablePlaces}` }}
                        </p>
                    </div>
                    <div class="tournament-card-value">
                        <p class="tournament-card-label">Prix:</p>
                        <p class="tournament-card-data">
                            {{ `${tournament.price} €` }}
                        </p>
                    </div>
                    <div class="tournament-card-value">
                        <p class="tournament-card-label">Date:</p>
                        <p class="tournament-card-data">
                            {{ DateUtils.formatDate(tournament.startDate) }}
                        </p>
                    </div>
                </div>
                <div class="tournament-card-footer">
                    <CsbButton label="Voir les détails" @click="setShowModal('infos')" />
                    <CsbButton
                        color="#f9ee57"
                        text-color="#000000"
                        v-if="!isOpenTournament && !isCancelledTournament"
                        :label="historyButtonLabel"
                        @click="setShowHistoryModal"
                    />
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
import type { Tournament as TournamentType } from '@/services/types';
import { DateUtils } from '@/services/services';

/**
 * @component TournamentCard
 * Display a card with the tournament information
 * @example <TournamentCard :tournament="tournament" />
 */


/**
 * Props of the component
 * @prop {TournamentType} tournament - The tournament to display
 */
const props = defineProps({
    tournament: {
        type: Object as PropType<TournamentType>,
        required: true
    }
});

/**
 * @ref menu - The menu of the card
 * @ref menuIcon - The icon of the menu
 */
const menu = ref<HTMLElement | null>(null);
const menuIcon = ref<HTMLElement | null>(null);

/**
 * @computed isOpenTournament - Determine if the tournament is open
 */
const isOpenTournament = computed(() => props.tournament.status === 'open');

/**
 * @computed isCancelledTournament - Determine if the tournament is cancelled
 */
const isCancelledTournament = computed(() => props.tournament.status === 'cancelled');

/**
 * @computed historyButtonLabel - Determine the label of the history button
 */
const historyButtonLabel = computed(() => {
    if (
        props.tournament.tournamentHistory.content &&
        props.tournament.tournamentHistory.images.length > 0 &&
        props.tournament.tournamentHistory.title
    ) {
        return 'Modifier le contenu';
    } else {
        return 'Ajouter du contenu';
    }
});

/**
 * @computed address - The address of the tournament
 */
const address = computed(() => {
    return `${props.tournament.address}, ${props.tournament.zipCode} ${props.tournament.city}`;
});

/**
 * @computed status - The status of the tournament
 */
const status = computed(() => {
    if (props.tournament.status === 'open') {
        return {
            color: '#00c853',
            icon: 'fa-regular fa-clock',
            text: 'À venir'
        };
    } else if (props.tournament.status === 'cancelled') {
        return {
            color: '#d1000f',
            icon: 'fa-solid fa-circle-exclamation',
            text: 'Annulé'
        };
    } else {
        return {
            color: '#5d5d5d',
            icon: 'fa-regular fa-clock',
            text: 'Terminé'
        };
    }
});

const numberOfParticipants = computed(() =>
    props.tournament.participants?.length ? props.tournament.participants.length : 0
);

/**
 * emit of the component
 * @emits showUpdateModal - Show the update modal
 * @emits showHistoryModal - Show the history modal
 * @emits showDetailsModal - Show the details modal
 * @emits showParticipantModal - Show the participant modal
 * @emits showDeleteTournament - Show the delete tournament modal
 */
const emit = defineEmits([
    'showUpdateModal',
    'showHistoryModal',
    'showDetailsModal',
    'showParticipantModal',
    'showDeleteTournament'
]);

/**
 * @ref {Ref<boolean>} showMenu - The visibility of the menu
 */
const showMenu = ref(false);

function closeMenu(event: MouseEvent) {
    if (
        menu.value &&
        !menu.value.contains(event.target as Node) &&
        menuIcon.value &&
        !menuIcon.value.contains(event.target as Node)
    ) {
        showMenu.value = false;
        window.removeEventListener('click', closeMenu);
    }
}

/**
 * @function setShowMenu
 * Show the menu when the icon is clicked.
 */
function setShowMenu() {
    showMenu.value = !showMenu.value;
    window.addEventListener('click', closeMenu);
}

/**
 * @function deleteTournament
 * Delete the tournament
 */
function deleteTournament() {
    emit('showDeleteTournament', props.tournament);
}

/**
 * @function setShowModal
 * Show the modal based on the given type
 * @param {string} type - The type of modal to show
 */
function setShowModal(type: string) {
    showMenu.value = false;
    if (type === 'update') {
        emit('showUpdateModal', props.tournament);
    } else if (type === 'infos') {
        emit('showDetailsModal', props.tournament);
    } else if (type === 'participant') {
        emit('showParticipantModal', props.tournament);
    }
}

/**
 * @function setShowHistoryModal
 * Show the history modal
 */
function setShowHistoryModal() {
    emit('showHistoryModal', props.tournament);
}
</script>

<style scoped lang="scss">
.tournament-card {
    @include card-layout;
    &-header {
        @include card-header;
        &__delete {
            color: $errorColor;
            &:hover {
                background-color: rgba($errorColor, 0.2) !important;
            }
        }
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
    &-header-edit {
        display: flex;
        gap: 1rem;
        align-items: center;
        font-size: 1.25rem;
        color: $secondaryColor;
        cursor: pointer;
    }
    &-header-menu {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        top: 40px;
        right: 0;
        background-color: $white;
        box-shadow: 0 0 5px rgba($darkerGrey, 0.2);
        padding: 0.5rem;
        border-radius: $borderRadius;
        p {
            padding: 0.5rem;
            cursor: pointer;
            &:hover {
                background-color: rgba($secondaryColor, 0.2);
            }
        }
        &-delete {
            color: $errorColor;
            &:hover {
                background-color: rgba($errorColor, 0.2) !important;
            }
        }
    }
}
</style>
