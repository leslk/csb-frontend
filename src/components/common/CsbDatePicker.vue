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

type StringOrRef = string | Ref<string>;

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

const emit = defineEmits(['update:value', 'blur']);
const errorMessage = computed(() => unref(props.error));
const dateValue = ref(moment(props.value).format('YYYY-MM-DDTHH:mm'));

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
