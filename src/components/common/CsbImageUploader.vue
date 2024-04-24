<template>
    <div class="csb-image-uploader">
        <input ref="fileInput" type="file" @change="onFileChange" hidden />
        <div class="image-preview-container upload">
            <CsbButton
                is-icon-button
                icon="fa-solid fa-arrow-up-from-bracket"
                @click="handleInputFileClick()"
            />
        </div>
        <div v-if="!multiple && imageUrl" class="image-preview-container">
            <img :src="imageUrl" class="image-preview" alt="Preview" />
        </div>
        <div
            v-else-if="imagesUrl.length > 0"
            class="image-preview-container"
            v-for="(image, index) in images"
            :key="index"
        >
            <img :src="image" class="image-preview" alt="Preview" />
            <div class="image-remove" @click="deleteImageUrl(image)">
                <i class="fa-solid fa-xmark" />
            </div>
        </div>
    </div>
    <div v-if="error" class="csb-image-uploader-error">
        <i class="fa-solid fa-circle-info"></i>
        <p>{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, unref, watch, type PropType, type Ref } from 'vue';
import CsbButton from './CsbButton.vue';

type StringOrRef = string | Ref<string>;

const props = defineProps({
    imageUrl: {
        type: String,
        default: ''
    },
    imagesUrl: {
        type: Array<string>,
        default: () => []
    },
    multiple: {
        type: Boolean,
        default: false
    },
    error: {
        type: Object as PropType<StringOrRef>,
        default: undefined
    }
});
const errorMessage = computed(() => unref(props.error));
const emit = defineEmits(['update:imageUrl', 'delete:imageUrl']);
const images = ref(props.imagesUrl);
const fileInput = ref<HTMLInputElement | null>(null);

function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        emit('update:imageUrl', file);
    }
}

function deleteImageUrl(imageUrl: string) {
    emit('delete:imageUrl', imageUrl);
}

function handleInputFileClick() {
    fileInput.value?.click();
}

watch(
    () => props.imagesUrl,
    (newValue: string[]) => {
        if (newValue) {
            images.value = newValue;
        }
    }
);
</script>

<style lang="scss" scoped>
.csb-image-uploader {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    .image-preview-container {
        position: relative;
        background-color: $lighterGrey;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        border-radius: $borderRadius;
        overflow: hidden;
    }
    .image-remove {
        position: absolute;
        top: 0.625rem;
        right: 0.625rem;
        background-color: $lightGrey;
        color: $secondaryColor;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        padding: 0.5rem;
        border-radius: 50%;
        cursor: pointer;
    }
    .image-preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    &-error {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        color: $errorColor;
        padding-left: 10px;
        font-size: 0.875rem;
    }
}
</style>
