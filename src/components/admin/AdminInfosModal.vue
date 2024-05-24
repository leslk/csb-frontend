<template>
    <CsbModal :show="show" @close="close" class="admin-modal">
        <template #header>
            <h2>{{ headerText }}</h2>
        </template>
        <template #content>
            <form>
                <div class="admin-modal-form">
                    <CsbInput
                        :value="form.lastName"
                        label="Nom"
                        @update:value="form.lastName = $event"
                        :error="accountValidate.lastName?.$errors[0]?.$message"
                    />
                    <div class="admin-modal-form-group">
                        <CsbInput
                            :value="form.firstName"
                            label="Prénom"
                            @update:value="form.firstName = $event"
                            :error="accountValidate.firstName?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="admin-modal-form-group">
                        <CsbInput
                            :value="form.email"
                            label="Email"
                            @update:value="form.email = $event"
                            :error="accountValidate.email?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="admin-modal-form-group">
                        <p class="admin-modal-form-label">Statut</p>
                        <CsbCheckBox
                            :checked="form.isSuperAdmin"
                            id="admin-status"
                            @toggle="toggleStatus($event)"
                            :label="label"
                            :disabled="!user.isSuperAdmin"
                        />
                    </div>
                </div>
            </form>
        </template>
        <template #footer>
            <div class="admin-modal-footer">
                <CsbButton label="Annuler" @click="close">Annuler</CsbButton>
                <CsbButton :label="buttonText" @click="updateAdmin">Modifier</CsbButton>
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CsbModal from '@/components/common/CsbModal.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbCheckBox from '@/components/common/CsbCheckbox.vue';
import { useAuthStore } from '@/stores/auth';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { type AdminAccount } from '@/services/types';

/**
 * Auth store
 */
const authStore = useAuthStore();

/**
 * Props of the component
 * @prop {AdminAccount} account - The account to be updated
 * @prop {Boolean} show - Determines whether the modal is shown or not
 */
const props = defineProps({
    account: {
        type: Object as () => AdminAccount,
        required: true
    },
    show: {
        type: Boolean,
        required: true
    }
});

/**
 * Emits of the component
 * @emit close - Event emitted when the modal is closed
 * @emit confirm - Event emitted when the account is updated
 */
const emit = defineEmits(['close', 'confirm']);

/**
 * Form that contains the account data
 */
const form = ref({
    _id: props.account._id,
    email: props.account.email,
    firstName: props.account.firstName,
    lastName: props.account.lastName,
    isSuperAdmin: props.account.isSuperAdmin,
    status: props.account.status
});

/**
 * Rules for the account validation
 */
const accountRules = {
    email: { required: helpers.withMessage('Veuillez entrer un email', required) },
    firstName: { required: helpers.withMessage('Veuillez entrer un prénom', required) },
    lastName: { required: helpers.withMessage('Veuillez entrer un nom', required) },
    _id: {},
    isSuperAdmin: {},
    status: {}
};

/**
 * Account validation that uses the rules of the account to avoid empty fields
 */
const accountValidate = useVuelidate(accountRules, form);

/**
 * logged user from the store
 */
const user = computed(() => authStore.user);

/**
 * Button text of the modal
 */
const buttonText = computed(() => (props.account._id ? 'Modifier' : 'Créer'));

/**
 * Header text of the modal
 */
const headerText = computed(() =>
    props.account._id ? 'Modification du compte' : "Création d'un compte"
);

/**
 * Label of the checkbox
 */
const label = computed(() => (form.value.isSuperAdmin ? 'Super Admin' : 'Admin'));

/**
 * Close the modal and reset the form
 */
function close() {
    accountValidate.value.$reset();
    emit('close');
}

/**
 * Toggle the status of the account
 * @param status the status to set
 */
function toggleStatus(status: boolean) {
    form.value.isSuperAdmin = status;
}

/**
 * Update the account
 * Validate the form and emit the confirm event
 */
async function updateAdmin() {
    accountValidate.value.$reset();
    const valid = await accountValidate.value.$validate();
    if (!valid) return;
    emit('confirm', form.value);
}

/**
 * Watch the account to update the form
 * @param newValue the new value of the account
 * if the account prop changes, the form is updated
 */
watch(
    () => props.account,
    (newValue: AdminAccount) => {
        form.value = {
            _id: newValue._id,
            email: newValue.email,
            firstName: newValue.firstName,
            lastName: newValue.lastName,
            isSuperAdmin: newValue.isSuperAdmin,
            status: newValue.status
        };
    }
);

/**
 * Watch the show prop to reset the form
 * if the show prop changes, the form is reset
 */
watch(
    () => props.show,
    () => {
        accountValidate.value.$reset();
    }
);
</script>

<style scoped lang="scss">
.admin-modal {
    &-footer {
        @include modal-footer;
    }
    &-form {
        @include form-layout;
    }
    &-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
    }
    &-form-label {
        font-weight: 500;
        color: $darkGrey;
    }
}
</style>
