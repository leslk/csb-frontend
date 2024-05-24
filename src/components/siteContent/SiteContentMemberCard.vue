<template>
    <CsbCard class="site-content-member-card">
        <template #content>
            <div class="site-content-member-card-header">
                <div class="site-content-member-card-edit">
                    <i class="fa-solid fa-ellipsis" @click="setShowMenu" ref="menuIcon" />
                </div>
                <div v-if="showMenu" class="site-content-member-card-menu" ref="menu">
                    <p @click="setShowModal('edit')">Modifier le membre</p>
                    <p
                        class="site-content-member-card-menu__delete"
                        @click="setShowModal('delete')"
                    >
                        Supprimer
                    </p>
                </div>
            </div>
            <div class="site-content-member-card-content">
                <img class="site-content-member-card-image" :src="member.image" />
                <p class="site-content-member-card-role">{{ member.role }}</p>
                <div class="site-content-member-card-value">
                    <p class="site-content-member-card-label">Prénom:</p>
                    <p class="site-content-member-card-data">{{ member.firstName }}</p>
                </div>
                <div class="site-content-member-card-value">
                    <p class="site-content-member-card-label">Nom:</p>
                    <p class="site-content-member-card-data">{{ member.lastName }}</p>
                </div>
            </div>
        </template>
    </CsbCard>
</template>

<script setup lang="ts">
import CsbCard from '@/components/common/CsbCard.vue';
import { ref } from 'vue';
import { type Member } from '@/services/types';

/**
 * This component displays the member information in a card.
 * The user can edit the member information or delete the member.
 * @component SiteContentMemberCard
 * @exemple <SiteContentMemberCard :member="member" @showModal="showModal" />
 */

/**
 * Props of the component
 * @prop {Member} member - The member to be displayed.
 */
const props = defineProps({
    member: {
        type: Object as () => Member,
        required: true
    }
});


/**
 * @ref showMenu - Determines whether the menu is shown or not.
 */
const showMenu = ref(false);

/**
 * Emits of the component
 * @emit showModal - Event emitted when the modal is shown. Passes the type of modal and the member as parameters.
 */
const emit = defineEmits(['showModal']);

/**
 * @ref menu - Reference to the menu element.
 * @ref menuIcon - Reference to the menu icon element.
 */
const menu = ref<HTMLElement | null>(null);
const menuIcon = ref<HTMLElement | null>(null);


/**
 * @function closeMenu
 * Close the menu when clicking outside of it.
 * @param event - The click event.
 */
function setShowModal(type: string) {
    emit('showModal', type, props.member);
}

/**
 * @function closeMenu
 * Close the menu when clicking outside of it.
 * @param event - The click event.
 */
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
</script>

<style lang="scss" scoped>
.site-content-member-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &-header {
        @include card-header;
        display: flex;
        justify-content: end;
        position: relative;
    }
    &-edit {
        display: flex;
        gap: 1rem;
        align-items: center;
        font-size: 1.25rem;
        color: $secondaryColor;
        cursor: pointer;
    }
    &-menu {
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
        &__delete {
            color: $errorColor;
            &:hover {
                background-color: rgba($errorColor, 0.2) !important;
            }
        }
    }
    &-content {
        @include card-content;
    }
    &-role {
        text-align: center;
        font-weight: bold;
        font-size: 1.5rem;
    }
    &-image {
        margin: auto;
        max-width: 60%;
        max-height: 200px;
        object-fit: cover;
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
    @media (max-width: 768px) {
        &-card {
            width: 100%;
        }
    }
}
</style>
