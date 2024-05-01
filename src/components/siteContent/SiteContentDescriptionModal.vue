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

const description = ref(props.description);

const descriptionError = computed(() =>
    description.value.length > 0 ? '' : 'La description ne peut pas être vide'
);

const emit = defineEmits(['close', 'updateDescription']);

const updateDescription = () => {
    if (descriptionError.value.length > 0) {
        return;
    }
    emit('updateDescription', description.value);
    close();
};

function setDescription(newValue: string) {
    description.value = newValue;
}

function resetDescription() {
    description.value = props.description;
}

function close() {
    emit('close');
}

watch(
    () => props.description,
    (newValue) => {
        description.value = newValue;
    }
);

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
