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
import { ref, watch, type Ref, type PropType, unref } from 'vue';

type StringOrRef = string | Ref<string>;

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
const emit = defineEmits(['update:value', 'blur']);

const errorMessage = unref(props.error);
const textValue = ref(props.value);

const updateValue = (event: any) => {
    const value = event?.target?.value;
    emit('update:value', value);
};

const blur = (event: any) => {
    emit('blur', event);
};

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
