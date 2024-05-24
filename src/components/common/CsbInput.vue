<template>
    <div class="csb-input-container">
        <label :for="label" class="csb-input-label">{{ label }}</label>
        <div class="csb-input-content">
            <input
                class="csb-input"
                v-model="textValue"
                :type="typeOfPasswordInput"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="($event) => updateValue($event)"
                @blur="($event) => blur($event)"
                :min="min"
                :max="max"
                :pattern="pattern"
            />
            <div v-if="password && !showPassword" @click="showPassword = true">
                <i class="fa fa-solid fa-eye" />
            </div>
            <div v-if="password && showPassword" @click="showPassword = false">
                <i class="fa fa-solid fa-eye-slash" />
            </div>
            <i :class="icon"></i>
        </div>
        <div v-if="error" class="csb-input-error">
            <i class="fa-solid fa-circle-info"></i>
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref, type PropType, unref } from 'vue';

/**
 * Vue component for the input.
 * @component CsbInput
 * @example <CsbInput label="Email" v-model="email" />
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
 * @props min: The minimum value of the input.
 * @props max: The maximum value of the input.
 * @props pattern: The pattern of the input.
 */
const props = defineProps({
    value: {
        type: [String, Number],
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
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 0
    },
    pattern: {
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
const textValue = ref(props.value);

/**
 * The type of the password input.
 */
const typeOfPasswordInput = computed(() =>
    props.password && showPassword.value
        ? 'text'
        : props.password && !showPassword.value
          ? 'password'
          : props.type
);

/**
 * Determines whether the password should be shown or not.
 */
const showPassword = ref(false);

/**
 * Function to update the value of the input.
 *
 * @param {Event} event - The event object.
 */
const updateValue = (event: any) => {
    const value = event?.target?.value;
    emit('update:value', value);
};

/**
 * Function to emit the blur event.
 *
 * @param {Event} event - The event object.
 */
const blur = (event: any) => {
    emit('blur', event);
};

/**
 * Watch the value of the input.
 * Update the value of the input when the value prop changes.
 * @param {string | number} newValue - The new value of the input.
 * @param {string | number} props.value - The value of the input.
 */
watch(
    () => props.value,
    (newValue: string | number) => {
        textValue.value = newValue;
    }
);
</script>

<style scoped lang="scss">
.csb-input-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}
.csb-input {
    padding: 0.625rem 1rem;
    border-radius: $borderRadius;
    width: 100%;
    background-color: $white;
    &-content {
        display: flex;
        border-radius: $borderRadius;
        justify-content: space-between;
        border: 1px solid $lightGrey;
        border-left: 4px solid $secondaryColor;
        background-color: $white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        i {
            color: $secondaryColor;
            margin-right: 1rem;
        }
        &:focus-within {
            box-shadow: 0 0 0 2px rgba($secondaryColor, 0.3);
        }
    }
    &-label {
        color: $darkerGrey;
    }
    &:active,
    &:focus {
        outline: none;
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
