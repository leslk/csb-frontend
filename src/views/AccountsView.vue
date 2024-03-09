<template>
    <div class="accounts-view">
        <div class="accounts-view-header">
            <CsbTitle title="Accounts" />
            <CsbButton :is-icon-button="isSmallScreen" icon="fa-solid fa-plus" label="Créer un nouveau compte" />
        </div>
        <CsbSection>
            <template #header>
                <h2>Comptes actifs</h2>
            </template>
            <template #content>
                <div v-if="adminAccounts.length > 0">
                    <div class="accounts-view-accounts">
                        <template v-for="(account, index) in adminAccounts" :key="index">
                            <AdminAccountCard @showAccountModal="setShowAccountModal" :account="account"/>
                        </template>
                    </div>
                </div>
                <CsbEmptyState v-else text="Aucun compte actif"/>
            </template>
        </CsbSection>
        <AdminInfosModal :show="showEditInfosModal" :account="account" @close="showEditInfosModal = false" @update-admin="updateAdmin"/>
        <AdminPasswordModal :show="showEditPasswordModal" @close="showEditPasswordModal = false"/>
    </div>
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';
import CsbSection from '@/components/common/CsbSection.vue';
import { onMounted, computed } from 'vue';
import { admin } from '@/services/auth';
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
};

const adminAccounts = ref<any>([]);
const account = ref<AdminAccount>({ email: '', firstName: '', lastName: '', _id: '', isSuperAdmin: false });
const activeAdminAccounts = ref<any>([]);
const awaitingAdminAccounts = ref<any>([]);
const showEditPasswordModal = ref<boolean>(false);
const showEditInfosModal = ref<boolean>(false);
const servicesStore = useServicesStore();
const authStore = useAuthStore();

const isSmallScreen = computed(() => servicesStore.getSmallDeviceScreen);

function setShowAccountModal(accountToUpdate: AdminAccount) {
    console.log(accountToUpdate)
    account.value = accountToUpdate;
    showEditInfosModal.value = true;
}

async function getAccounts() {
    const response = await admin.getAccounts();
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

async function updateAdmin(adminAccount: AdminAccount) {
        try {
            await admin.updateAdmin(adminAccount);
            showEditInfosModal.value = false;
        } catch (error) {
            console.error(error);
        }
    }

onMounted(async () => {
    adminAccounts.value = await getAccounts();
    // activeAdminAccounts.value = adminAccounts.value.filter((account: any) => );
});
</script>

<style scoped lang="scss">
.accounts-view {
    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3.75rem;
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
</style>