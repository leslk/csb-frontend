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

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const buttonText = computed(() => (props.account._id ? 'Modifier' : 'Créer'));
const headerText = computed(() =>
    props.account._id ? 'Modification du compte' : "Création d'un compte"
);
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
const emit = defineEmits(['close', 'confirm']);
const label = computed(() => (form.value.isSuperAdmin ? 'Super Admin' : 'Admin'));
const form = ref({
    _id: props.account._id,
    email: props.account.email,
    firstName: props.account.firstName,
    lastName: props.account.lastName,
    isSuperAdmin: props.account.isSuperAdmin,
    status: props.account.status
});

const accountRules = {
    email: { required: helpers.withMessage('Veuillez entrer un email', required) },
    firstName: { required: helpers.withMessage('Veuillez entrer un prénom', required) },
    lastName: { required: helpers.withMessage('Veuillez entrer un nom', required) },
    _id: {},
    isSuperAdmin: {},
    status: {}
};

const accountValidate = useVuelidate(accountRules, form);

function close() {
    accountValidate.value.$reset();
    emit('close');
}

function toggleStatus(status: boolean) {
    form.value.isSuperAdmin = status;
}

async function updateAdmin() {
    accountValidate.value.$reset();
    const valid = await accountValidate.value.$validate();
    if (!valid) return;
    emit('confirm', form.value);
}

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
