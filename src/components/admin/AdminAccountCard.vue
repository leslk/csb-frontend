<template>
    <CsbCard>
        <template #content>
            <div class="account-card-header">
                <i class="fa-solid fa-user account-card-header-icon" />
                <div class="account-card-header-pending" v-if="account.status === 'pending'">
                    <i class="fa-solid fa-circle-info" />
                    <p>En attente</p>
                </div>
                <div class="account-card-header-edit">
                    <i v-if="isUpdateAuthorized" class="fa-solid fa-ellipsis" @click="setShowMenu" ref="menuIcon"/>
                </div>
                <div v-if="showMenu" class="account-card-header-menu" ref="menu">
                    <p @click="setShowModal('infos')">Editer les informations</p>
                    <p v-if="account._id === user._id" @click="setShowModal('password')">Modifier le mot de passe</p>
                    <p class="account-card-header-menu-delete" @click="deleteAccount">Supprimer</p>
                </div>
            </div>
            <div class="account-card-content">
                <div class="account-card-value">
                    <p class="account-card-label">Prénom: </p>
                    <p>{{account.firstName}}</p>
                </div>
                <div class="account-card-value">
                    <p class="account-card-label">Nom: </p>
                    <p>{{account.lastName}}</p>
                </div>
                <div class="account-card-value">
                    <p class="account-card-label">Email: </p>
                    <p>{{account.email}}</p>
                </div>
                <div class="account-card-value">
                    <p class="account-card-label">Status: </p>
                    <p :class="account.isSuperAdmin ? 'super-admin' : 'admin'">{{adminStatus}}</p>
                </div>
            </div>
        </template>
    </CsbCard>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import CsbCard from '@/components/common/CsbCard.vue';
    import { useAuthStore } from '@/stores/auth';

    interface AdminAccount {
        email: string;
        firstName: string;
        lastName: string;
        _id: string;
        isSuperAdmin: boolean;
        status: string;
    };
    const props = defineProps({
        account: {
            type: Object as () => AdminAccount,
            required: true
        }
    });
    const emit = defineEmits(['showPasswordModal', 'showAccountModal', 'deleteAccount']);
    const user = computed(() => useAuthStore().user);
    const showMenu = ref<boolean>(false);
    const adminStatus = computed(() => props.account.isSuperAdmin ? "Super Admin" : "Admin");
    const menu = ref<HTMLElement | null>(null);
    const menuIcon = ref<HTMLElement | null>(null);

    const isUpdateAuthorized = computed(() => {
        if (user.value.isSuperAdmin) {
            return true;
        } else {
            return user.value._id === props.account._id;
        }
    });

    function setShowModal(modal: string) {
        showMenu.value = false;
        if (modal === 'infos') {
            emit('showAccountModal', props.account);
        } else {
            emit('showPasswordModal', props.account._id);
        }
    }

    function closeMenu(event: MouseEvent) {
        if (menu.value && !menu.value.contains(event.target as Node) && menuIcon.value && !menuIcon.value.contains(event.target as Node)) {
            showMenu.value = false;
            window.removeEventListener('click', closeMenu);
        }

    }

    function setShowMenu() {
        showMenu.value = true;
        window.addEventListener('click', closeMenu);
    }

    function deleteAccount() {
        showMenu.value = false;
        emit('deleteAccount', props.account);
    }
</script>

<style scoped lang="scss">
.super-admin {
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    color: $white;
    background-color: rgba($successColor, 0.6);
}
.admin {
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    color: $white;
    background-color: rgba($secondaryColor, 0.5);
}
.account-card {
    &-header {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        height: 100px;
        background-color: $lighterGrey;
        border-radius: 12px 12px 0 0;
    }
    &-header-icon {
        font-size: 3rem;
        color: $darkGrey;
    }
    &-header-pending {
        display: flex;
        align-items: center;
        position: absolute;
        background-color: $darkerGrey;
        border-radius: 20px;
        padding: 0.2rem 0.5rem;
        top: 20px;
        left: 20px;
        gap: 0.5rem;
        color: $white;
    }
    &-header-edit {
        position: absolute;
        display: flex;
        gap: 1rem;
        align-items: center;
        top: 20px;
        right: 20px;
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
        border-radius: 5px;
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
        display: flex;
        flex-direction: column;
        gap: 1rem 0;
        padding: 1rem;
    }
    &-value {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    &-label {
        font-weight: bold;
        color: $darkGrey;
    }
    @media (max-width: 768px) {
        &-card {
            width: 100%;
        }
    }
}
</style>