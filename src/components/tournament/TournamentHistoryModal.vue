<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>{{ headerText }}</h2>
        </template>
        <template #content>
            <div class="tournament-history-form">
                <div class="tournament-history-form-group">
                    <CsbInput
                        :value="tournamentHistory.title"
                        label="Titre"
                        placeholder="Titre"
                        @update:value="tournamentHistory.title = $event"
                        :error="tournamentHistoryValidate.title?.$errors[0]?.$message"
                    />
                </div>
                <div class="tournament-history-form-group">
                    <CsbTextArea
                        :value="tournamentHistory.content"
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
                <CsbButton label="Annuler" @click="close" />
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
import { type Tournament as TournamentType } from '@/services/types';
import { computed, ref, watch } from 'vue';
import { required, helpers } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

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
const emit = defineEmits([
    'close',
    'addHistory',
    'addImage',
    'removeImage',
    'deleteTournamentHistory'
]);
const headerText = 'Contenu du tournoi affiché sur le site';

const tournamentHistory = ref({
    content: props.tournament.tournamentHistory.content || '',
    images: props.tournament.tournamentHistory.images || [],
    title: props.tournament.tournamentHistory.title || ''
});

const isTournamentHistory = computed(() => {
    return (
        props.tournament.tournamentHistory.content &&
        props.tournament.tournamentHistory.images.length > 0 &&
        props.tournament.tournamentHistory.title
    );
});

const buttonLabel = computed(() => {
    if (
        props.tournament.tournamentHistory.content &&
        props.tournament.tournamentHistory.images.length > 0 &&
        props.tournament.tournamentHistory.title
    ) {
        return 'Modifier';
    } else {
        return 'Ajouter';
    }
});

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

const tournamentHistoryValidate = useVuelidate(tournamentHistoryRules, tournamentHistory);

async function addImage(image: string) {
    const response = await Upload.uploadImage(image);
    emit('addImage', response.data.imageUrl);
}

async function deleteTournamentHistory() {
    emit('deleteTournamentHistory', props.tournament);
    emit('close');
}

async function removeImage(image: string) {
    const response = await Upload.deleteImage(image);
    emit('removeImage', response.data);
}

async function addHistory() {
    tournamentHistoryValidate.value.$touch();
    if (tournamentHistoryValidate.value.$error) {
        return;
    }
    emit('addHistory', tournamentHistory.value);
}

const close = () => {
    for (const image of tournamentHistory.value.images) {
        Upload.deleteImage(image);
    }
    resetTournamentHistory();
    emit('close');
};

const resetTournamentHistory = () => {
    tournamentHistory.value = {
        content: '',
        images: [],
        title: ''
    };
};

watch(
    () => props.tournament,
    (newValue) => {
        if (newValue.tournamentHistory) {
            tournamentHistory.value.images = newValue.tournamentHistory.images;
        }
    },
    { deep: true }
);

watch(
    () => props.show,
    (value) => {
        if (value) {
            tournamentHistoryValidate.value.$reset();
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
