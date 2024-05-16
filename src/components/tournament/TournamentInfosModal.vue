<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>{{ headerText }}</h2>
        </template>
        <template #content>
            <form>
                <div class="tournament-modal-form">
                    <div class="tournament-modal-form-group">
                        <CsbInput
                            :value="form.address"
                            label="Adresse"
                            @update:value="form.address = $event"
                            :error="tournamentValidate.location?.address?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="tournament-modal-form-group">
                        <CsbInput
                            :value="form.zipCode"
                            label="Code postal"
                            @update:value="form.zipCode = $event"
                            :error="tournamentValidate.location?.zipCode?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="tournament-modal-form-group">
                        <CsbInput
                            :value="form.city"
                            label="Ville"
                            @update:value="form.city = $event"
                            :error="tournamentValidate.location?.city?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="tournament-modal-form-group">
                        <CsbInput
                            :value="form.availablePlaces"
                            label="Nombre de places"
                            type="number"
                            :min="2"
                            @update:value="form.availablePlaces = $event"
                            :error="tournamentValidate.availablePlaces?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="tournament-modal-form-group">
                        <CsbInput
                            :value="form.price"
                            label="Prix"
                            type="number"
                            :min="0"
                            @update:value="form.price = $event"
                            :error="tournamentValidate.price?.$errors[0]?.$message"
                            icon="fa-solid fa-euro-sign"
                        />
                    </div>
                    <div class="tournament-modal-form-group">
                        <CsbDatePicker
                            :value="form.startDate"
                            label="Date de début"
                            @update:value="form.startDate = $event"
                            :error="tournamentValidate.startDate?.$errors[0]?.$message"
                        />
                    </div>
                    <div class="tournament-modal-form-group">
                        <CsbTextArea
                            :value="form.description"
                            label="Description"
                            @update:value="form.description = $event"
                        />
                    </div>
                </div>
            </form>
        </template>
        <template #footer>
            <div class="tournament-modal-footer">
                <csb-button label="Annuler" @click="close" />
                <csb-button :label="buttonText" @click="confirm" />
            </div>
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
import { type Tournament } from '@/services/types';

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

const buttonText = computed(() => (props.tournament._id ? 'Modifier' : 'Créer'));

const emit = defineEmits(['close', 'confirm']);
const form = ref({
    _id: props.tournament._id,
    address: props.tournament.address,
    zipCode: props.tournament.zipCode,
    city: props.tournament.city,
    availablePlaces: props.tournament.availablePlaces,
    participants: props.tournament.participants,
    startDate: props.tournament.startDate,
    description: props.tournament.description,
    status: props.tournament.status,
    tournamentHistory: props.tournament.tournamentHistory,
    price: props.tournament.price
});


const availablePlacesError = computed(() => {
    if (form.value.availablePlaces < props.tournament.participants.length) {
        return 'Le nombre de places doit être supérieur ou égal au nombre de participants';
    }
    if (!form.value.availablePlaces) {
        return 'Le nombre de places est requis';
    }
    return '';
});

const tournamentRules = {
    address: helpers.withMessage('L\'adresse est requise', required),
    zipCode: helpers.withMessage('Le code postal est requis', required),
    city: helpers.withMessage('La ville est requise', required),
    availablePlaces: {
        required: helpers.withMessage(availablePlacesError.value, required)
    },
    price: { required: helpers.withMessage('Le prix est requis', required) },
    startDate: { required: helpers.withMessage('La date de début est requise', required) }
};

const tournamentValidate = useVuelidate(tournamentRules, form);

function close() {
    emit('close');
}

function confirm() {
    tournamentValidate.value.$touch();
    if (tournamentValidate.value.$error) {
        return;
    }
    emit('confirm', form.value);
}

watch(
    () => props.tournament,
    (value) => {
        form.value = {
            _id: value._id,
            address: value.address,
            zipCode: value.zipCode,
            city: value.city,
            availablePlaces: value.availablePlaces,
            participants: value.participants,
            startDate: value.startDate,
            description: value.description,
            status: value.status,
            tournamentHistory: value.tournamentHistory,
            price: value.price
        };
    }
);

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
.tournament-modal {
    &-form {
        @include form-layout;
    }
    &-footer {
        @include modal-footer;
    }
}
</style>
