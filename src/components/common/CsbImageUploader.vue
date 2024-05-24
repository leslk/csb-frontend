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

/**
 * Vue component for the image uploader.
 * @component CsbImageUploader
 * @example <CsbImageUploader :imageUrl="imageUrl" :imagesUrl="imagesUrl" :multiple="multiple" @update:imageUrl="updateImageUrl" @delete:imageUrl="deleteImageUrl" />
 */
type StringOrRef = string | Ref<string>;

/**
 * Props of the component
 * @props imageUrl: The image url.
 * @props imagesUrl: The images url.
 * @props multiple: Determines whether the uploader is multiple or not.
 * @props error: The error message of the uploader.
 */
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

/**
 * The error message of the uploader.
 */
const errorMessage = computed(() => unref(props.error));

/**
 * emits
 * @emits update:imageUrl - Emits when the image url is updated.
 * @emits delete:imageUrl - Emits when the image url is deleted.
 */
const emit = defineEmits(['update:imageUrl', 'delete:imageUrl']);

/**
 * The image url array.
 */
const images = ref(props.imagesUrl);

/**
 * The file input reference.
 */
const fileInput = ref<HTMLInputElement | null>(null);

/**
 * @function onFileChange - Function to handle the file change event.
 * @param event - The event object
 */
function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        emit('update:imageUrl', file);
    }
}

/**
 * @function updateImageUrl - Function to update the image url.
 * @param imageUrl - The image url
 */
function deleteImageUrl(imageUrl: string) {
    emit('delete:imageUrl', imageUrl);
}

/**
 * @function handleInputFileClick - Function to handle the input file click event.
 */
function handleInputFileClick() {
    fileInput.value?.click();
}

/**
 * Watch the images url prop.
 * @param {Array<string>} props.imagesUrl - The images url.
 * @param {Array<string>} newValue - The new images url.
 */
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
