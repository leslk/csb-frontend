<template>
    <div class="csb-text-area-container">
        <label :for="label" class="csb-text-area-label">{{ label }}</label>
        <div class="csb-text-area-content">
            <textarea
                :style="{ height: height }"
                class="csb-text-area"
                v-model="textValue"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="($event) => updateValue($event)"
                @blur="($event) => blur($event)"
            />
        </div>
        <div v-if="error" class="csb-text-area-error">
            <i class="fa-solid fa-circle-info"></i>
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, type PropType, unref, computed } from 'vue';

/**
 * Vue component for the text area.
 * @component CsbTextArea
 * @example <CsbTextArea label="Commentaire" v-model="comment" />
 */
type StringOrRef = string | Ref<string>;

/**
 * Props of the component
 * @props value: The value of the text area.
 * @props disabled: Determines whether the text area is disabled or not.
 * @props placeholder: The placeholder of the text area.
 * @props height: The height of the text area.
 * @props label: The label of the text area.
 * @props error: The error message of the text area.
 */
const props = defineProps({
    value: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: '100px'
    },
    label: {
        type: String,
        default: ''
    },
    error: {
        type: Object as PropType<StringOrRef>,
        default: undefined
    }
});

/**
 * Emits of the component
 * @emits update:value: Emits when the value of the text area is updated.
 * @emits blur: Emits when the text area is blurred.
 */
const emit = defineEmits(['update:value', 'blur']);

/**
 * The error message of the text area.
 */
const errorMessage = computed(() => unref(props.error));

/**
 * The value of the text area.
 */
const textValue = ref(props.value);

/**
 * Updates the value of the text area.
 *
 * @param {Event} event - The event object.
 */
const updateValue = (event: any) => {
    const value = event?.target?.value;
    emit('update:value', value);
};

/**
 * Blurs the text area.
 *
 * @param {Event} event - The event object.
 */
const blur = (event: any) => {
    emit('blur', event);
};

/**
 * Watches the value prop and updates the text value.
 * @param {string} newValue - The new value of the text area.
 */
watch(
    () => props.value,
    (newValue: string) => {
        textValue.value = newValue;
    }
);
</script>

<style lang="scss" scoped>
.csb-text-area-container {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}
.csb-text-area {
    padding: 0.625rem 1rem;
    border-radius: $borderRadius;
    width: 100%;
    border: 1px solid $lightGrey;
    border-left: 4px solid $secondaryColor;
    background-color: $white;
    &-content {
        position: relative;
        i {
            position: absolute;
            right: 10px;
            top: 50%;
            color: $secondaryColor;
            transform: translate(-50%, -50%);
        }
    }
    &-label {
        color: $darkerGrey;
    }
    &:active,
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba($secondaryColor, 0.3);
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
