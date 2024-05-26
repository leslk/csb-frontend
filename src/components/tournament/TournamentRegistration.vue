<template>
    <div v-if="show" class="tournament-registration-screen">
        <div class="tournament-registration">
            <div class="tournament-registration-header">
                <h2>INSCRIPTION</h2>
                <i class="fa-solid fa-xmark" @click="setTournamentRegistration"></i>
            </div>
            <p 
                v-if="!status" 
                class="tournament-registration-text" v-html="registrationText">
            </p>
            <form class="tournament-registration-content"  v-if="!status">
                <CsbInput 
                label="Nom" 
                :error="registrationValidate.lastName?.$errors[0]?.$message"
                @update:value="form.lastName = $event"
                />
                <CsbInput 
                label="Prénom" 
                :error="registrationValidate.firstName?.$errors[0]?.$message"
                @update:value="form.firstName = $event"
                />
                <CsbInput 
                label="Email" 
                type="email"
                :error="registrationValidate.email?.$errors[0]?.$message"
                @update:value="form.email = $event"
                />
                <CsbInput 
                label="Téléphone" 
                type="phone"
                :error="registrationValidate.phoneNumber?.$errors[0]?.$message"
                @update:value="form.phoneNumber = $event"
                />
            </form>
            <CsbButton 
                v-if="!status" 
                label="S'INSCRIRE" 
                color="#f9ee57" 
                text-color="#000000" 
                class="tournament-registration-button" 
                @click="sendRegistration"
            />
            <div v-if="status === 'success'">
                <p class="tournament-registration-text">Votre inscription a bien été prise en compte.</p>
            </div>
            <div v-if="status === 'error'">
                <p class="tournament-registration-text">Une erreur est survenue lors de votre inscription. Veuillez réessayer.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CsbInput from '@/components/common/CsbInput.vue';
import { computed, ref, watch } from 'vue';
import type { Tournament } from '@/services/types';
import CsbButton from '@/components/common/CsbButton.vue';
import { DateUtils } from '@/services/services';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

/**
 *  TournamentRegistration component
 * @component TournamentRegistration
 * @exemple <TournamentRegistration :show="show" :tournament="tournament" :sentStatus="sentStatus" @close="close" @sendRegistration="sendRegistration"/>
 */

/**
 * Props of the components
 * @prop {Boolean} show - Determines whether the modal is shown or not.
 * @prop {Tournament} tournament - The tournament to be updated.
 * @prop {String} sentStatus - The status of the registration.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    tournament: {
        type: Object as () => Tournament,
        required: true
    },
    sentStatus: {
        type: String,
        required: false
    }
});

/**
 * @ref {Ref<string>} status - The status of the registration.
 */
const status = ref('');
const registrationText = computed(() => `Pour vous inscrire au tournoi du <strong>${DateUtils.getDate(props.tournament?.startDate)}</strong> à <strong>${props.tournament?.address} ${props.tournament?.zipCode} ${props.tournament?.city}</strong> au tarif de <strong>${props.tournament?.price} €</strong>, veuillez remplir ce formulaire.`)

/**
 * Emits of the component
 * @emits close - Emits when the modal is closed.
 * @emits sendRegistration - Emits when the registration is sent.
 */
const emit = defineEmits([
    'close',
    'sendRegistration'
]);

/**
 * @ref {Ref<{lastName: string, firstName: string, email: string, phoneNumber: string}>} form - The form data.
 */
const form = ref({
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: ''
});

/**
 * Rules for the registration validation
 */
const registrationRules = {
    lastName: {
        required: helpers.withMessage('Le nom est requis', required)
    },
    firstName: {
        required: helpers.withMessage('Le prénom est requis', required)
    },
    email: {
        required: helpers.withMessage('L\'email est requis', required)
    },
    phoneNumber: {
        required: helpers.withMessage('Le téléphone est requis', required)
    }
}

/**
 * Registration validation that uses the rules of the registration to avoid empty fields
 */
const registrationValidate = useVuelidate(registrationRules, form);

/**
 * @function setTournamentRegistration
 * Close the modal
 */
function setTournamentRegistration() {
    emit('close');
}

/**
 * @function sendRegistration
 * Send the registration for the tournament
 */
async function sendRegistration() {
    registrationValidate.value.$touch();
    if (registrationValidate.value.$error) {
        return;
    }
    if (props.tournament) {
        emit ('sendRegistration',props.tournament._id, form.value);
    }
}

/**
 * Watch the show prop to reset the registration form
 * @param newValue - The new value of the show prop
 * if the show prop changes, the registration form is reset
 */
watch(
    () => props.show,
    (newValue) => {
        if (!newValue) {
            registrationValidate.value.$reset();
        }
    }
);

/**
 * Watch the sentStatus prop to update the status of the registration
 * @param newValue - The new value of the sentStatus prop
 * if the sentStatus prop changes, the status of the registration is updated
 */
watch(() => props.sentStatus, (newValue) => {
    status.value = newValue ?? '';
});
</script>

<style lang="scss" scoped>
::v-deep(.csb-input-content) {
    border-left: none;
    color: $secondaryColor;
}
::v-deep(.csb-input-label) {
    color: white;
}
.tournament {
    &-registration-screen {
        position: fixed;
        z-index: 1000;
        height: 100vh;
        width: 100vw;
        top: 0vh;
        right: 0;
        overflow: scroll;
        background-color: rgba($secondaryColor, 0.6);
        height: 100%;
        &-header {
            color: $white;
            svg {
                color: white !important;
            }
        }
    }
    &-registration {
        animation: slideToLeft 0.5s;
        padding: 2rem;
        position: fixed;
        height: 100vh;
        color: $white;
        top: 0vh;
        width: 100vw;
        right: 0;
        overflow: scroll;
        background-color: $secondaryColor;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        &-header {
            color: $white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
                cursor: pointer;
            }
        }
        &-text {
            color: $white;
            padding-top: 1rem;
        }
        &-content {
            @include form-layout;
        }
        &-button {
            width: min-content;
            margin: 2rem auto;
        }
    }
    @include mf-tablet-break-point {
        &-registration {
            width: 50vw;
        }
    }
}
</style>