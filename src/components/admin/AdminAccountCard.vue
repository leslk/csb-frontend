<template>
    <CsbCard class="account-card">
        <template #content>
            <div class="account-card-header">
                <CsbStatus :icon="status.icon" :text="status.text" :color="status.color" />
                <div class="account-card-header-edit">
                    <i
                        v-if="isUpdateAuthorized"
                        class="fa-solid fa-ellipsis"
                        @click="setShowMenu"
                        ref="menuIcon"
                    />
                </div>
                <div v-if="showMenu" class="account-card-header-menu" ref="menu">
                    <p @click="setShowModal('infos')">Editer les informations</p>
                    <p v-if="isPendingAccount" @click="setShowModal('invitation')">
                        Renvoyer l'invitation
                    </p>
                    <p v-if="account._id === user._id" @click="setShowModal('password')">
                        Modifier le mot de passe
                    </p>
                    <p class="account-card-header-menu-delete" @click="deleteAccount">Supprimer</p>
                </div>
            </div>
            <div class="account-card-content">
                <i class="fa-regular fa-address-card account-card-icon" />
                <div class="account-card-value">
                    <p class="account-card-label">Prénom:</p>
                    <p class="account-card-data">{{ account.firstName }}</p>
                </div>
                <div class="account-card-value">
                    <p class="account-card-label">Nom:</p>
                    <p class="account-card-data">{{ account.lastName }}</p>
                </div>
                <div class="account-card-value">
                    <p class="account-card-label">Email:</p>
                    <p class="account-card-data">{{ account.email }}</p>
                </div>
                <div class="account-card-value">
                    <p class="account-card-label">Statut:</p>
                    <p :class="account.isSuperAdmin ? 'super-admin' : 'admin'">{{ adminStatus }}</p>
                </div>
            </div>
        </template>
    </CsbCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CsbCard from '@/components/common/CsbCard.vue';
import { useAuthStore } from '@/stores/auth';
import CsbStatus from '@/components//common/CsbStatus.vue';
import { type AdminAccount } from '@/services/types';
/**
 * This component displays the account information in a card.
 * The user can edit the account information, resend the invitation, change the password, or delete the account.
 * @component AdminAccountCard
 * @exemple <AdminAccountCard :account="account" />
 */

/**
 * Props of the component.
 * account: the account to display.
 */
const props = defineProps({
    account: {
        type: Object as () => AdminAccount,
        required: true
    }
});

/**
 * Reference to the emit function for emitting events.
 */
const emit = defineEmits([
    'showPasswordModal',
    'showAccountModal',
    'deleteAccount',
    'showInvitationModal'
]);

/**
 * Reference to a boolean value indicating whether the menu is shown or not.
 */
const showMenu = ref<boolean>(false);

/**
 * Reference to the menu element.
 */
const menu = ref<HTMLElement | null>(null);

/**
 * Reference to the menu icon element.
 */
const menuIcon = ref<HTMLElement | null>(null);

/**
 * Computed property that returns the user object from the auth store.
 */
const user = computed(() => useAuthStore().user);

/**
 * Computed property that returns a boolean value indicating whether the account is pending or expired.
 */
const isPendingAccount = computed(
    () => props.account.status === 'pending' || props.account.status === 'expired'
);

/**
 * Computed property that returns the admin status string.
 */
const adminStatus = computed(() => (props.account.isSuperAdmin ? 'Super Admin' : 'Admin'));

/**
 * Computed property that returns a boolean value indicating whether the user is authorized to update the account.
 */
const isUpdateAuthorized = computed(() => {
    if (user.value.isSuperAdmin) {
        return true;
    } else {
        return user.value._id === props.account._id;
    }
});

/**
 * Computed property that returns the status object based on the account status.
 */
const status = computed(() => {
    if (props.account.status === 'pending') {
        return {
            color: '#b1b1b1',
            icon: 'fa-regular fa-clock',
            text: 'En attente'
        };
    } else if (props.account.status === 'expired') {
        return {
            color: '#d1000f',
            icon: 'fa-solid fa-circle-exclamation',
            text: 'Expiré'
        };
    } else {
        return {
            color: '#00c853',
            icon: 'fa-regular fa-circle-check',
            text: 'Actif'
        };
    }
});

/**
 * Function that sets the modal to show based on the given parameter.
 *
 * @param {string} modal - The modal to show.
 */
function setShowModal(modal: string) {
    showMenu.value = false;
    if (modal === 'infos') {
        emit('showAccountModal', props.account);
    } else if (modal === 'password') {
        emit('showPasswordModal', props.account._id);
    } else if (modal === 'invitation') {
        emit('showInvitationModal', props.account);
    }
}

/**
 * Function that closes the menu when a click event occurs outside the menu or menu icon.
 *
 * @param {MouseEvent} event - The click event.
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
 * Function that toggles the menu visibility and adds a click event listener to close the menu.
 */
function setShowMenu() {
    showMenu.value = !showMenu.value;
    window.addEventListener('click', closeMenu);
}

/**
 * Function that deletes the account.
 */
function deleteAccount() {
    showMenu.value = false;
    emit('deleteAccount', props.account);
}
</script>

<style scoped lang="scss">
.super-admin {
    padding: 0.2rem 0.5rem;
    border-radius: $borderRadius;
    color: $white;
    background-color: $successColor;
}
.admin {
    padding: 0.2rem 0.5rem;
    border-radius: $borderRadius;
    color: $white;
    background-color: $primaryColor;
}
.account-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &-header {
        @include card-header;
    }
    &-icon {
        @include card-icon;
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
    @media (max-width: 768px) {
        &-card {
            width: 100%;
        }
    }
}
</style>
