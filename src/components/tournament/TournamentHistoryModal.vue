<template>
    <CsbModal :show="show" @close="close()">
        <template #header>
            <h2>{{ headerText }}</h2>
        </template>
        <template #content>
            <div class="tournament-history-form">
                <div class="tournament-history-form-group">
                    <CsbInput
                        :value="tournamentHistory.title!"
                        label="Titre"
                        placeholder="Titre"
                        @update:value="tournamentHistory.title = $event"
                        :error="tournamentHistoryValidate.title?.$errors[0]?.$message"
                    />
                </div>
                <div class="tournament-history-form-group">
                    <CsbTextArea
                        :value="tournamentHistory.content!"
                        label="Contenu"
                        placeholder="Contenu"
                        @update:value="tournamentHistory.content = $event"
                        :error="tournamentHistoryValidate.content?.$errors[0]?.$message"
                    />
                </div>
                <div class="tournament-history-form-group">
                    <label for="images" class="tournament-history-form-label">Images</label>
                    <CsbImageUploader
                        :imagesUrl="tournamentHistory.images"
                        @update:imageUrl="addImage"
                        @delete:imageUrl="removeImage"
                        id="images"
                        :error="tournamentHistoryValidate.images?.$errors[0]?.$message"
                    />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="tournament-history-modal-footer">
                <p
                    v-if="isTournamentHistory"
                    @click="deleteTournamentHistory"
                    class="tournament-history-modal-footer__delete"
                >
                    Supprimer le contenu
                </p>
                <CsbButton label="Annuler" @click="close()" />
                <CsbButton :label="buttonLabel" @click="addHistory" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbImageUploader from '@/components/common/CsbImageUploader.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbTextArea from '@/components/common/CsbTextArea.vue';
import { Upload } from '@/services/services';
import type { TournamentHistory, Tournament as TournamentType } from '@/services/types';
import { computed, ref, watch } from 'vue';
import { required, helpers } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

/**
 * Vue component for the tournament history modal.
 * @component TournamentHistoryModal
 * @example <TournamentHistoryModal :show="show" :tournament="tournament" @close="close" @addHistory="addHistory" @addImage="addImage" @removeImage="removeImage" @deleteTournamentHistory="deleteTournamentHistory" />
 */


/**
 * Props of the component
 * @props show: The visibility of the modal.
 * @props tournament: The tournament to be updated.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    tournament: {
        type: Object as () => TournamentType,
        required: true
    }
});

/**
 * Emits of the component
 * @emits close - Emits when the modal is closed.
 * @emits addHistory - Emits when the history is added.
 * @emits addImage - Emits when the image is added.
 * @emits removeImage - Emits when the image is removed.
 * @emits deleteTournamentHistory - Emits when the history is deleted.
 */
const emit = defineEmits([
    'close',
    'addHistory',
    'addImage',
    'removeImage',
    'deleteTournamentHistory'
]);

/**
 * Header text of the modal
 */
const headerText = 'Contenu du tournoi affiché sur le site';

/**
 * @ref {Ref<TournamentHistory>} tournamentHistory - The tournament history to be updated.
 */
const tournamentHistory = ref<TournamentHistory>({
    content: props.tournament.tournamentHistory.content || '',
    images: props.tournament.tournamentHistory.images || [],
    title: props.tournament.tournamentHistory.title || '',
    _id: props.tournament.tournamentHistory._id || ''
});

/**
 * @ref {ComputedRef<Boolean>} isTournamentHistory - Determines whether the tournament history is set.
 */
const isTournamentHistory = computed(() => {
    return (
        props.tournament.tournamentHistory.content &&
        props.tournament.tournamentHistory.images.length > 0 &&
        props.tournament.tournamentHistory.title
    );
});

/**
 * @ref {Ref<string>} buttonLabel - The label of the button.
 */
const buttonLabel = ref(
    props.tournament.tournamentHistory.content &&
    props.tournament.tournamentHistory.images.length > 0 &&
    props.tournament.tournamentHistory.title
    ? 
    'Modifier' 
    : 
    'Ajouter'
);

/**
 * Rules for the tournament history form.
 */
const tournamentHistoryRules = {
    content: {
        required: helpers.withMessage('Le contenu est requis', required)
    },
    title: {
        required: helpers.withMessage('Le titre est requis', required)
    },
    images: {
        required: helpers.withMessage('Les images sont requises', required)
    }
};

/**
 * Tournament history validation that uses the rules of the tournament history to avoid empty fields
 */
const tournamentHistoryValidate = useVuelidate(tournamentHistoryRules, tournamentHistory);

/**
 * Add an image to the tournament history.
 * @param {string} image - The image to be added.
 */
async function addImage(image: string) {
    const response = await Upload.uploadImage(image);
    emit('addImage', response.data.imageUrl);
}

/**
 * Delete the tournament history.
 */
async function deleteTournamentHistory() {
    emit('deleteTournamentHistory', props.tournament);
    emit('close');
}

/**
 * Remove an image from the tournament history.
 * @param {string} image - The image to be removed.
 */
async function removeImage(image: string) {
    const response = await Upload.deleteImage(image);
    emit('removeImage', response.data);
}

/**
 * @function addHistory
 * Add the tournament history.
 */
async function addHistory() {
    tournamentHistoryValidate.value.$touch();
    if (tournamentHistoryValidate.value.$error) {
        return;
    }
    emit('addHistory', tournamentHistory.value);
    emit('close');
}

/**
 * @function close
 * Close the modal
 */
const close = () => {
    if (!tournamentHistory.value.content && !tournamentHistory.value.title && tournamentHistory.value.images.length > 0) {
        for (const image of tournamentHistory.value.images) {
            removeImage(image);
        }
    }
    resetTournamentHistory();
    emit('close');
};

/**
 * @function resetTournamentHistory
 * Reset the tournament history
 */
const resetTournamentHistory = () => {
    tournamentHistory.value = {
        content: '',
        images: [],
        title: '',
        _id: ''
    };
};

/**
 * Watch the tournament and update the tournament history value.
 * @param {TournamentType} newValue - The new value of the tournament.
 */
watch(
    () => props.tournament,
    (newValue) => {
        buttonLabel.value = 
        newValue.tournamentHistory?.content && 
        newValue.tournamentHistory?.images.length > 0 &&
        newValue.tournamentHistory?.title ? 'Modifier' : 'Ajouter';
        if (newValue.tournamentHistory) {
            tournamentHistory.value.images = newValue.tournamentHistory.images;
        }
    },
    { deep: true }
);

/**
 * Watch the show prop and reset the tournament history.
 * @param {Boolean} value - The new value of the show prop.
 */
watch(
    () => props.show,
    (value) => {
        if (!value) {
            tournamentHistoryValidate.value.$reset();
            resetTournamentHistory();
        }
    }
);
</script>

<style lang="scss" scoped>
.tournament-history {
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
        align-items: center;
        &__delete {
            padding-right: 2rem;
            color: $errorColor;
            font-weight: bold;
            cursor: pointer;
            text-decoration: underline;
        }
    }
    &-form-label {
        color: $darkerGrey;
    }
}
</style>
