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
                @input="($event) =>  updateValue($event)"
                @blur="($event) => blur($event)"
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

type StringOrRef = string | Ref<string>;

const props = defineProps({
    value: {
        type: [String, Number],
        default: null,
    },
    password: {
        type: Boolean,
        default: false,
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
        type: Object as PropType<StringOrRef>,
        default: undefined,
    },
    icon: {
        type: String,
        default: ''
    },
});



const emit = defineEmits(['update:value', 'blur']);
const errorMessage = computed(() => unref(props.error));
const textValue = ref(props.value);
const typeOfPasswordInput = computed(() => props.password && showPassword.value ? 'text' : props.password && !showPassword.value ? 'password' : props.type);
const showPassword = ref(false);

const updateValue = (event: any) => {
    const value = event?.target?.value;
    emit('update:value', value);
};

const blur = (event: any) => {
    emit('blur', event);
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
    border-radius: 2px;
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