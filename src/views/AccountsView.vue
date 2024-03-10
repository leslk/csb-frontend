<template>
    <div class="accounts-view">
        <div class="accounts-view-header">
            <CsbTitle title="Comptes" />
            <CsbButton :is-icon-button="isSmallScreen" icon="fa-solid fa-plus" label="Créer un nouveau compte" @click="setShowAccountModal(account)"/>
        </div>
        <CsbSection>
            <template #header>
                <h2>Votre Compte</h2>
            </template>
            <template #content>
                <div class="accounts-view-accounts">
                    <AdminAccountCard v-if="yourAccount" @show-password-modal="setShowPasswordModal" @show-account-modal="setShowAccountModal" :account="yourAccount" @delete-account="setShowDeleteModal"/>
                </div>
            </template>
        </CsbSection>
        <CsbSection>
            <template #header>
                <h2>Liste des comptes</h2>
            </template>
            <template #content>
                <div v-if="adminAccounts.length > 0">
                    <div class="accounts-view-accounts">
                        <template v-for="(account, index) in filteredAdminAccounts" :key="index">
                            <AdminAccountCard @show-password-modal="setShowPasswordModal" @show-account-modal="setShowAccountModal" :account="account" @delete-account="setShowDeleteModal"/>
                        </template>
                    </div>
                </div>
                <CsbEmptyState v-else text="Aucun compte"/>
            </template>
        </CsbSection>
        <AdminInfosModal :show="showEditInfosModal" :account="account" @close="showEditInfosModal = false" @confirm="updateAdmin"/>
        <AdminPasswordModal :show="showEditPasswordModal" @close="showEditPasswordModal = false" @update-password="updatePassword"/>
        <AdminDeleteModal :show="showDeleteModal" :account="account" @close="showDeleteModal = false" @confirm="deleteAccount"/>
    </div>
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';
import CsbSection from '@/components/common/CsbSection.vue';
import AdminDeleteModal from '@/components/admin/AdminDeleteModal.vue';
import { onMounted, computed } from 'vue';
import { Admin } from '@/services/services';
import AdminAccountCard from '@/components/admin/AdminAccountCard.vue';
import AdminInfosModal from '@/components/admin/AdminInfosModal.vue';
import AdminPasswordModal from '@/components/admin/AdminPasswordModal.vue';
import { useServicesStore } from '@/stores/services';
import { useAuthStore } from '@/stores/auth';
import {toast} from 'vue3-toastify';
import { ref } from 'vue';

interface AdminAccount {
    email: string;
    firstName: string;
    lastName: string;
    _id: string;
    isSuperAdmin: boolean;
    status: string;
};

const adminAccounts = ref<any>([]);
const account = ref<AdminAccount>({ email: '', firstName: '', lastName: '', _id: '', isSuperAdmin: false, status: 'pending' });
const yourAccount = computed(() => adminAccounts.value.find((account: any) => account._id === authStore.user._id));
const filteredAdminAccounts = computed(() => adminAccounts.value.filter((account: any) => account._id !== yourAccount.value._id));
const showEditPasswordModal = ref<boolean>(false);
const showEditInfosModal = ref<boolean>(false);
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

function setShowDeleteModal(accountToDelete: AdminAccount) {
    account.value = accountToDelete;
    console.log(account.value);
    showDeleteModal.value = true;
}

function resetAccount() {
    account.value = { email: '', firstName: '', lastName: '', _id: '', isSuperAdmin: false, status: 'pending' };
}

async function getAccounts() {
    const response: any = await Admin.getAccounts();
    return response.data;
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
        await Admin.updatePassword(account.value._id, password);
        showEditPasswordModal.value = false;
        toast.success('Mot de passe modifié');
    } catch (error) {
        toast.error('Erreur lors de la modification du mot de passe');
    }
}

async function updateAdmin(adminAccount: AdminAccount) {
    const toastText = adminAccount._id ? 'Compte modifié' : 'Compte créé';
    try {
        if (adminAccount._id) {
            await Admin.updateAdmin(adminAccount);
        } else {
            await Admin.createAdmin(adminAccount);
            resetAccount();
        }
        showEditInfosModal.value = false;
        await updateAccount(adminAccount._id);
        toast.success(toastText);
    } catch (error) {
        toast.error('Erreur lors de la modification du compte');
    }
}

async function deleteAccount(accountId: string) {
    try {
        await Admin.deleteAdmin(accountId);
        showDeleteModal.value = false;
        resetAccount();
        await updateAccount(accountId);
        toast.success('Compte supprimé');
    } catch (error) {
        toast.error('Erreur lors de la suppression du compte');
    }
}

onMounted(async () => {
    adminAccounts.value = await getAccounts();
});
</script>

<style scoped lang="scss">
.accounts-view {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &-accounts {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}

@media (max-width: 768px) {
    .accounts-view-accounts {
        grid-template-columns: 1fr;
    }
}
</style>@/services/services