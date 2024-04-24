<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>{{ headerText }}</h2>
        </template>
        <template #content>
            <div class="tournament-participant-form">
                <div class="tournament-participant-form-group">
                    <CsbInput
                        :value="participant.firstName"
                        label="Prénom"
                        @update:value="participant.firstName = $event"
                        :error="participantValidate.firstName?.$errors[0]?.$message"
                    />
                </div>
                <div class="tournament-participant-form-group">
                    <CsbInput
                        :value="participant.lastName"
                        label="Nom"
                        @update:value="participant.lastName = $event"
                        :error="participantValidate.lastName?.$errors[0]?.$message"
                    />
                </div>
                <div class="tournament-participant-form-group">
                    <CsbInput
                        :value="participant.email"
                        label="Email"
                        @update:value="participant.email = $event"
                        :error="participantValidate.email?.$errors[0]?.$message"
                    />
                </div>
                <div class="tournament-participant-form-group">
                    <CsbInput
                        :value="participant.phoneNumber"
                        label="Numéro de téléphone"
                        @update:value="participant.phoneNumber = $event"
                        :error="participantValidate.phoneNumber?.$errors[0]?.$message"
                    />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="tournament-participant-modal-footer">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Ajouter" @click="addparticipant" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { ref, watch } from 'vue';
import { required, helpers } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

interface Participant {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
});
const emit = defineEmits(['close', 'addParticipant']);
const headerText = 'Historique des tournois';

const participant = ref({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
});

const participantRules = {
    firstName: {
        required: helpers.withMessage('Le prénom est obligatoire', required)
    },
    lastName: {
        required: helpers.withMessage('Le nom est obligatoire', required)
    },
    email: {
        required: helpers.withMessage("L'email est obligatoire", required)
    },
    phoneNumber: {
        required: helpers.withMessage('Le numéro de téléphone est obligatoire', required)
    }
};

const participantValidate = useVuelidate(participantRules, participant);

async function addparticipant() {
    participantValidate.value.$touch();
    if (participantValidate.value.$error) {
        return;
    }
    emit('addParticipant', participant.value);
    close();
}

const close = () => {
    emit('close');
};

function resetParticipant() {
    participant.value = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    };
}

watch(
    () => props.show,
    (value) => {
        if (value) {
            participantValidate.value.$reset();
            resetParticipant();
        }
    }
);
</script>

<style lang="scss" scoped>
.tournament-participant {
    &-form {
        @include form-layout;
        &-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }
    &-modal-footer {
        @include modal-footer;
    }
    &-form-label {
        color: $darkerGrey;
    }
}
</style>
