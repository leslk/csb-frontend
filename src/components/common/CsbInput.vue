<template>
    <div class="csb-input-container">
        <label :for="label" class="csb-input-label">{{ label }}</label>
        <input 
            class="csb-input"
            v-model="textValue"
            :type="type"  
            :disabled="disabled" 
            :placeholder="placeholder"
            @input="($event) =>  updateValue($event)"
        />
        <div v-if="error" class="csb-input-error">
            <i class="fa-solid fa-circle-info"></i>
            <p>{{ error }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
    value: {
        type: [String, Number],
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'text',
    },
    label: {
        type: String,
        default: '',
    },
    error: {
        type: String,
        default: undefined,
    },
});

const emit = defineEmits(['update:value']);
const textValue = ref(props.value);

const updateValue = (event: any) => {
    const value = event?.target?.value;
    emit('update:value', value);
};

watch(() => props.value, (newValue: string | number) => {
    textValue.value = newValue;
});
</script>

<style scoped lang="scss">
.csb-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}
.csb-input {
    padding: 0.625rem 1rem;
    border-radius: 12px;
    width: 100%;
    border: 1px solid $darkGrey;
    background-color: $white;
    &-label {
        color: $darkGrey;
    }
    &:active, &:focus {
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