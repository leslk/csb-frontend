<template>
    <div class="accounts-view">
        <div class="accounts-view-header">
            <CsbTitle title="Comptes" />
            <CsbButton
                :is-icon-button="isSmallScreen"
                icon="fa-solid fa-plus"
                label="Créer un nouveau compte"
                @click="setShowAccountModal(account)"
            />
        </div>
        <CsbSection>
            <template #header>
                <h2>Votre Compte</h2>
            </template>
            <template #content>
                <div class="accounts-view-accounts">
                    <AdminAccountCard
                        v-if="yourAccount"
                        @show-password-modal="setShowPasswordModal"
                        @show-account-modal="setShowAccountModal"
                        :account="yourAccount"
                        @delete-account="setShowDeleteModal"
                    />
                </div>
            </template>
        </CsbSection>
        <CsbSection v-if="filteredAdminAccounts.length > 0">
            <template #header>
                <h2>Liste des comptes</h2>
            </template>
            <template #content>
                <div>
                    <div class="accounts-view-accounts">
                        <template v-for="(account, index) in filteredAdminAccounts" :key="index">
                            <AdminAccountCard
                                @show-password-modal="setShowPasswordModal"
                                @show-account-modal="setShowAccountModal"
                                :account="account"
                                @delete-account="setShowDeleteModal"
                                @show-invitation-modal="setShowResendInvitationModal"
                            />
                        </template>
                    </div>
                </div>
            </template>
        </CsbSection>
        <AdminInfosModal
            :show="showEditInfosModal"
            :account="account"
            @close="showEditInfosModal = false"
            @confirm="updateAdmin"
        />
        <AdminPasswordModal
            :show="showEditPasswordModal"
            @close="showEditPasswordModal = false"
            @update-password="updatePassword"
        />
        <AdminDeleteModal
            :show="showDeleteModal"
            :account="account"
            @close="showDeleteModal = false"
            @confirm="deleteAccount"
        />
        <AdminInvitationModal
            :show="showResendInvitationModal"
            :account="account"
            @close="showResendInvitationModal = false"
            @confirm="resendInvitation"
        />
    </div>
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbSection from '@/components/common/CsbSection.vue';
import AdminDeleteModal from '@/components/admin/AdminDeleteModal.vue';
import { onMounted, computed, watch } from 'vue';
import { Admin } from '@/services/services';
import AdminAccountCard from '@/components/admin/AdminAccountCard.vue';
import AdminInfosModal from '@/components/admin/AdminInfosModal.vue';
import AdminPasswordModal from '@/components/admin/AdminPasswordModal.vue';
import AdminInvitationModal from '@/components/admin/AdminInvitationModal.vue';
import { useServicesStore } from '@/stores/services';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { AdminAccount } from '@/services/types';

const adminAccounts = ref<any>([]);
const router = useRouter();
const account = ref<AdminAccount>({
    email: '',
    firstName: '',
    lastName: '',
    _id: '',
    isSuperAdmin: false,
    status: 'pending'
});
const yourAccount = computed(() =>
    adminAccounts.value.find((account: any) => account._id === authStore.user._id)
);
const filteredAdminAccounts = computed(() =>
    adminAccounts.value.filter((account: any) => account._id !== yourAccount.value._id)
);
const showEditPasswordModal = ref<boolean>(false);
const showEditInfosModal = ref<boolean>(false);
const showResendInvitationModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const servicesStore = useServicesStore();
const authStore = useAuthStore();

const isSmallScreen = computed(() => servicesStore.getSmallDeviceScreen);

function setShowAccountModal(accountToUpdate: AdminAccount) {
    account.value = accountToUpdate;
    showEditInfosModal.value = true;
}

function setShowPasswordModal(accountId: string) {
    account.value._id = accountId;
    showEditPasswordModal.value = true;
}

function setShowResendInvitationModal(accountToResend: AdminAccount) {
    account.value = accountToResend;
    showResendInvitationModal.value = true;
}

function setShowDeleteModal(accountToDelete: AdminAccount) {
    account.value = accountToDelete;
    showDeleteModal.value = true;
}

function resetAccount() {
    account.value = {
        email: '',
        firstName: '',
        lastName: '',
        _id: undefined,
        isSuperAdmin: false,
        status: 'pending'
    };
}

async function getAccounts() {
    const response: any = await Admin.getAccounts();
    return response.data;
}

async function resendInvitation(accountId: string) {
    try {
        await Admin.resendInvitation(accountId);
        showResendInvitationModal.value = false;
        toast.success('Invitation renvoyée');
        resetAccount();
    } catch (error) {
        toast.error("Erreur lors de l'envoi de l'invitation");
    }
}

async function updateAccount(AccountId: string) {
    const accounts = await getAccounts();
    adminAccounts.value = accounts;
    const account = accounts.find((account: any) => account._id === AccountId);
    if (account && authStore.user?._id === AccountId) {
        authStore.login(account);
    }
}

async function updatePassword(password: any) {
    try {
        await Admin.updatePassword(account.value._id!, password);
        showEditPasswordModal.value = false;
        toast.success('Mot de passe modifié');
        resetAccount();
    } catch (error) {
        toast.error('Erreur lors de la modification du mot de passe');
    }
}

async function updateAdmin(adminAccount: AdminAccount) {
    const toastText = adminAccount._id ? 'Compte modifié' : 'Compte créé';
    const toastErrorText = adminAccount._id
        ? 'Erreur lors de la modification du compte'
        : 'Erreur lors de la création du compte';
    try {
        if (adminAccount._id) {
            await Admin.updateAdmin(adminAccount);
        } else {
            await Admin.createAdmin(adminAccount);
        }
        resetAccount();
        showEditInfosModal.value = false;
        await updateAccount(adminAccount._id!);
        toast.success(toastText);
    } catch (error) {
        toast.error(toastErrorText);
    }
}

async function deleteAccount(accountId: string) {
    try {
        await Admin.deleteAdmin(accountId);
        showDeleteModal.value = false;
        if (authStore.user?._id === accountId) {
            authStore.logout();
            router.push({ name: 'Login' });
        } else {
            await updateAccount(accountId);
            toast.success('Compte supprimé');
        }
    } catch (error) {
        toast.error('Erreur lors de la suppression du compte');
    }
}

onMounted(async () => {
    adminAccounts.value = await getAccounts();
});

watch(
    () => showEditInfosModal.value,
    (newValue: boolean) => {
        if (!newValue) {
            resetAccount();
        }
    }
);
</script>

<style scoped lang="scss">
.accounts-view {
    @include view-layout;
    &-header {
        @include header-layout;
    }
    &-accounts {
        @include card-container;
    }
}
</style>
