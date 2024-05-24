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

/**
 * Admin accounts view.
 * This view displays the list of admin accounts.
 * The user can create, update, delete, or resend the invitation to an account.
 * @component AccountsView
 * @example <AccountsView />
 */

/**
 * Reference to the admin accounts.
 */
const adminAccounts = ref<any>([]);

/**
 * router to navigate
 */
const router = useRouter();

/**
 * Reference to the account to be updated or created.
 */
const account = ref<AdminAccount>({
    email: '',
    firstName: '',
    lastName: '',
    _id: '',
    isSuperAdmin: false,
    status: 'pending'
});

/**
 * Reference to the logged user's account.
 */
const yourAccount = computed(() =>
    adminAccounts.value.find((account: any) => account._id === authStore.user._id)
);

/**
 * Reference to the admin accounts excluding the logged user's account.
 */
const filteredAdminAccounts = computed(() =>
    adminAccounts.value.filter((account: any) => account._id !== yourAccount.value._id)
);

/**
 * Reference to the boolean value indicating whether the edit password modal is shown or not.
 */
const showEditPasswordModal = ref<boolean>(false);

/**
 * Reference to the boolean value indicating whether the edit infos modal is shown or not.
 */
const showEditInfosModal = ref<boolean>(false);

/**
 * Reference to the boolean value indicating whether the resend invitation modal is shown or not.
 */
const showResendInvitationModal = ref<boolean>(false);

/**
 * Reference to the boolean value indicating whether the delete modal is shown or not.
 */
const showDeleteModal = ref<boolean>(false);

/**
 * Reference to the services store.
 */
const servicesStore = useServicesStore();

/**
 * Reference to the auth store.
 */
const authStore = useAuthStore();

/**
 * Reference to the boolean value indicating whether the screen is small or not.
 */
const isSmallScreen = computed(() => servicesStore.getSmallDeviceScreen);

/**
 * Sets the account modal to be shown.
 *
 * @function setShowAccountModal
 * @param {AdminAccount} accountToUpdate - The account to update.
 */
function setShowAccountModal(accountToUpdate: AdminAccount) {
    account.value = accountToUpdate;
    showEditInfosModal.value = true;
}

/**
 * Sets the password modal to be shown.
 *
 * @function setShowPasswordModal
 * @param {string} accountId - The account ID.
 */
function setShowPasswordModal(accountId: string) {
    account.value._id = accountId;
    showEditPasswordModal.value = true;
}

/**
 * Sets the resend invitation modal to be shown.
 *
 * @function setShowResendInvitationModal
 * @param {AdminAccount} accountToResend - The account to resend the invitation to.
 */
function setShowResendInvitationModal(accountToResend: AdminAccount) {
    account.value = accountToResend;
    showResendInvitationModal.value = true;
}

/**
 * Sets the delete modal to be shown.
 *
 * @function setShowDeleteModal
 * @param {AdminAccount} accountToDelete - The account to delete.
 */
function setShowDeleteModal(accountToDelete: AdminAccount) {
    account.value = accountToDelete;
    showDeleteModal.value = true;
}

/**
 * Resets the account object.
 */
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

/**
 * Gets the admin accounts.
 *
 * @function getAccounts
 * @returns {Promise} - The admin accounts.
 */
async function getAccounts() {
    const response: any = await Admin.getAccounts();
    return response.data;
}

/**
 * Resends the invitation to the account.
 */
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

/**
 * Updates the account.
 *
 * @param {AdminAccount} adminAccount - The account to update.
 */
async function updateAccount(AccountId: string) {
    const accounts = await getAccounts();
    adminAccounts.value = accounts;
    const account = accounts.find((account: any) => account._id === AccountId);
    if (account && authStore.user?._id === AccountId) {
        authStore.login(account);
    }
}

/**
 * Updates the password.
 *
 * @param {string} password - The new password.
 */
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

/**
 * Updates the account.
 *
 * @param {AdminAccount} adminAccount - The account to update.
 */
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

/**
 * Deletes the account.
 *
 * @param {string} accountId - The account ID.
 */
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

/**
 * Fetches the admin accounts when the component is mounted.
 */
onMounted(async () => {
    adminAccounts.value = await getAccounts();
});

/**
 * Watches the showEditInfosModal value.
 * Resets the account object when the modal is closed.
 * @param {boolean} showEditInfosModal.value - The value of the showEditInfosModal.
 * @param {boolean} newValue - The new value of the showEditInfosModal.
 */
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
