<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>{{ headerText }}</h2>
        </template>
        <template #content>
            <form>
                <div class="admin-modal-form">
                    <div class="admin-modal-form-group">
                        <CsbInput
                            :value="form.location"
                            label="Lieu"
                            @update:value="form.location = $event"
                            :error="tournamentValidate.location?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="admin-modal-form-group">
                        <CsbInput
                            :value="form.availablePlaces"
                            label="Nombre de places"
                            @update:value="form.availablePlaces = $event"
                            :error="tournamentValidate.availablePlaces?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="admin-modal-form-group">
                        <CsbDatePicker
                            :value="form.startDate"
                            label="Date de début"
                            @update:value="form.startDate = $event"
                            :error="tournamentValidate.startDate?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="admin-modal-form-group">
                        <CsbTextArea
                            :value="form.description"
                            label="Description"
                            @update:value="form.description = $event"
                        />
                    </div>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <csb-button label="Créer" @click="confirm" />
            <csb-button label="Annuler" @click="close" />
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbDatePicker from '@/components/common/CsbDatePicker.vue';
import CsbTextArea from '@/components/common/CsbTextArea.vue';
import { required, helpers } from '@vuelidate/validators';
import { computed, ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';

interface Tournament {
    location: string;
    availablePlaces: number;
    participants: [] | null;
    startDate: Date | undefined;
    description?: string;
    status: string;
    tournamentHistory: [] | null;
    _id?: string;
}

const props = defineProps({
    tournament: {
        type: Object as () => Tournament,
        required: true
    },
    show: {
        type: Boolean,
        required: true
    }
});

const headerText = computed(() =>
    props.tournament._id ? 'Modification du tournois' : "Création d'un tournoi"
);

const emit = defineEmits(['close', 'confirm']);
const form = ref({
    _id: props.tournament._id,
    location: props.tournament.location,
    availablePlaces: props.tournament.availablePlaces,
    participants: props.tournament.participants,
    startDate: props.tournament.startDate,
    description: props.tournament.description,
    status: props.tournament.status,
    tournamentHistory: props.tournament.tournamentHistory
});

const tournamentRules = {
    location: { required: helpers.withMessage('Le lieu est requis', required) },
    availablePlaces: { required: helpers.withMessage('Le nombre de places est requis', required) },
    startDate: { required: helpers.withMessage('La date de début est requise', required) }
};

const tournamentValidate = useVuelidate(tournamentRules, form);

function close() {
    emit('close');
}

function confirm() {
    emit('confirm', form.value);
}

watch(
    () => props.show,
    (value) => {
        if (value) {
            tournamentValidate.value.$reset();
        }
    }
);
</script>

<style scoped lang="scss">
.admin-modal-form {
    @include form-layout;
}
</style>
