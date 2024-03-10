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
                    <AdminAccountCard v-if="yourAccount" @show-password-modal="setShowPasswordModal" @show-account-modal="setShowAccountModal" :account="yourAccount"/>
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
                            <AdminAccountCard @show-password-modal="setShowPasswordModal" @show-account-modal="setShowAccountModal" :account="account"/>
                        </template>
                    </div>
                </div>
                <CsbEmptyState v-else text="Aucun compte"/>
            </template>
        </CsbSection>
        <AdminInfosModal :show="showEditInfosModal" :account="account" @close="showEditInfosModal = false" @confirm="updateAdmin"/>
        <AdminPasswordModal :show="showEditPasswordModal" @close="showEditPasswordModal = false" @update-password="updatePassword"/>
    </div>
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';
import CsbSection from '@/components/common/CsbSection.vue';
import { onMounted, computed } from 'vue';
import { Admin } from '@/services/services';
import AdminAccountCard from '@/components/admin/AdminAccountCard.vue';
import AdminInfosModal from '@/components/admin/AdminInfosModal.vue';
import AdminPasswordModal from '@/components/admin/AdminPasswordModal.vue';
import { useServicesStore } from '@/stores/services';
import { useAuthStore } from '@/stores/auth';
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

async function getAccounts() {
    const response = await Admin.getAccounts();
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
    } catch (error) {
        console.error(error);
    }
}

async function updateAdmin(adminAccount: AdminAccount) {
        try {
            if (adminAccount._id) {
                await Admin.updateAdmin(adminAccount);
            } else {
                await Admin.createAdmin(adminAccount);
                account.value = { email: '', firstName: '', lastName: '', _id: '', isSuperAdmin: false, status: 'pending' };
            }
            showEditInfosModal.value = false;
            await updateAccount(adminAccount._id);
        } catch (error) {
            console.error(error);
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