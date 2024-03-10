<template>
    <CsbModal :show="show" @close="close" class="admin-modal">
        <template #header>
            <h2>Modifier les informations</h2>
        </template>
        <template #content>
            <form>
                <div class="admin-modal-form">
                        <CsbInput 
                            :value="form.lastName" 
                            label="Nom" 
                            @update:value="form.lastName = $event"
                        />
                    <div class="admin-modal-form-group">
                        <CsbInput 
                            :value="form.firstName" 
                            label="Prénom" 
                            @update:value="form.firstName = $event"
                        />
                    </div>
                    <div class="admin-modal-form-group">
                        <CsbInput 
                            :value="form.email" 
                            label="Email" 
                            @update:value="form.email = $event"
                        />
                    </div>
                    <div class="admin-modal-form-group">
                        <p class="admin-modal-form-label">Statut</p>
                        <CsbCheckBox 
                            :checked="form.isSuperAdmin" 
                            id="admin-status" 
                            @toggle="toggleStatus($event)" 
                            :label="label" :disabled="!user.isSuperAdmin"
                        />
                    </div>
                </div>
            </form>
        </template>
        <template #footer>
            <div class="admin-modal-footer">
                <CsbButton label="Annuler" @click="close">Annuler</CsbButton>
                <CsbButton label="Modifier" @click="updateAdmin">Modifier</CsbButton>
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

    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    interface AdminAccount {
        email: string;
        firstName: string;
        lastName: string;
        _id: string;
        isSuperAdmin: boolean;
    };
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
    const emit = defineEmits(['close', 'updateAdmin']);
    const label = computed(() => form.value.isSuperAdmin ? "Super Admin" : "Admin");
    const form = ref({
        _id: props.account._id,
        email: props.account.email,
        firstName: props.account.firstName,
        lastName: props.account.lastName,
        isSuperAdmin: props.account.isSuperAdmin
    });
    function close() {
        emit('close');
    }

    function toggleStatus(status: boolean) {
        form.value.isSuperAdmin = status;
    }

    function updateAdmin() {
        emit('updateAdmin', form.value);
    }

    watch(() => props.account, (newValue: AdminAccount) => {
        form.value = {
            _id: newValue._id,
            email: newValue.email,
            firstName: newValue.firstName,
            lastName: newValue.lastName,
            isSuperAdmin: newValue.isSuperAdmin
        }
    });
</script>

<style scoped lang="scss">
    .admin-modal {
        &-footer {
            display: flex;
            gap: 0.625rem;
            .csb-button:first-child {
                background-color: lighten($errorColor, 30%)
            }
        }
        &-form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
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