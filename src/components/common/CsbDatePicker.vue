<template>
    <div class="csb-date-input-container">
        <label :for="label" class="csb-date-input-label">{{ label }}</label>
        <div class="csb-date-input-content">
            <input
                class="csb-date-input"
                v-model="dateValue"
                type="datetime-local"
                :disabled="disabled"
                @input="($event) => updateValue($event)"
                @blur="($event) => blur($event)"
            />
        </div>
        <div v-if="error" class="csb-date-input-error">
            <i class="fa-solid fa-circle-info"></i>
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed, ref, watch, type Ref, type PropType, unref } from 'vue';

/**
 * Vue component for the date input.
 * @component CsbDateInput
 * @example <CsbDateInput label="Date" v-model="date" />
 */

type StringOrRef = string | Ref<string>;

/**
 * Props of the component
 * @props value: The value of the input.
 * @props password: Determines whether the input is a password input or not.
 * @props disabled: Determines whether the input is disabled or not.
 * @props placeholder: The placeholder of the input.
 * @props type: The type of the input.
 * @props label: The label of the input.
 * @props error: The error message of the input.
 * @props icon: The icon of the input.
 */
const props = defineProps({
    value: {
        type: String,
        default: null
    },
    password: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    label: {
        type: String,
        default: ''
    },
    error: {
        type: Object as PropType<StringOrRef>,
        default: undefined
    },
    icon: {
        type: String,
        default: ''
    }
});

/**
 * Emits of the component
 * @emits update:value: Emits the value of the input.
 * @emits blur: Emits the blur event.
 */
const emit = defineEmits(['update:value', 'blur']);

/**
 * The error message of the input.
 */
const errorMessage = computed(() => unref(props.error));

/**
 * The value of the input.
 */
const dateValue = ref(moment(props.value).format('YYYY-MM-DDTHH:mm'));

/**
 * @function updateValue
 * Updates the value of the input.
 * @param {Event} event - The event object
 */
const updateValue = (event: any) => {
    const value = event?.target?.value;
    emit('update:value', value);
};

/**
 * @function blur
 * Emits the blur event.
 * @param {Event} event - The event object
 */
const blur = (event: any) => {
    emit('blur', event);
};

/**
 * Watches the value prop and updates the dateValue.
 * @param {StringOrRef} props.value - The value of the input.
 * @param {String} newValue - The new value of the input.
 */
watch(
    () => props.value,
    (newValue: string) => {
        dateValue.value = moment(newValue).format('YYYY-MM-DDTHH:mm');
    }
);
</script>

<style scoped lang="scss">
.csb-date-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}
.csb-date-input {
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
