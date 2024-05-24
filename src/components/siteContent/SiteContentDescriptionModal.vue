<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Modifier la description</h2>
        </template>
        <template #content>
            <CsbTextArea
                label="Description"
                :value="description"
                @update:value="setDescription($event)"
                :error="descriptionError"
            />
        </template>
        <template #footer>
            <div class="modal-footer">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Modifier" @click="updateDescription" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { computed, ref, watch } from 'vue';
import CsbTextArea from '@/components/common/CsbTextArea.vue';

/**
 * Vue component for the site content description modal.
 *
 * @component SiteContentDescriptionModal
 * @example <SiteContentDescriptionModal :show="show" :description="description" @close="close" @updateDescription="updateDescription" />
 */

/**
 * Props of the component
 * @props show: The visibility of the modal.
 * @props description: The description to be updated.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

/**
 * @ref {Ref<string>} description - The description to be updated.
 */
const description = ref(props.description);

/**
 * @ref {ComputedRef<string>} descriptionError - The error message of the description.
 */
const descriptionError = computed(() =>
    description.value.length > 0 ? '' : 'La description ne peut pas être vide'
);

/**
 * Emits of the component
 * @emits close: Emits when the modal is closed.
 * @emits updateDescription: Emits when the description is updated.
 */
const emit = defineEmits(['close', 'updateDescription']);

/**
 * @function updateDescription
 * Update the description
 */
const updateDescription = () => {
    if (descriptionError.value.length > 0) {
        return;
    }
    emit('updateDescription', description.value);
    close();
};

/**
 * @function setDescription
 * Set the description
 * @param newValue - The new value of the description
 */
function setDescription(newValue: string) {
    description.value = newValue;
}

/**
 * @function resetDescription
 * Reset the description
 */
function resetDescription() {
    description.value = props.description;
}

/**
 * @function close
 * Close the modal
 */
function close() {
    emit('close');
}

/**
 * Watch the description prop and update the description value.
 * @param newValue - The new value of the description
 */
watch(
    () => props.description,
    (newValue) => {
        description.value = newValue;
    }
);

/**
 * Watch the show prop and reset the description.
 * if the show prop changes, the description is reset
 */
watch(
    () => props.show,
    (newValue) => {
        if (!newValue) {
            resetDescription();
        }
    }
);
</script>

<style scoped lang="scss">
.modal-footer {
    @include modal-footer;
}
</style>
