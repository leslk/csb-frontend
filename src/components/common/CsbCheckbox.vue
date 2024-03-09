<template>
    <label :class="['csb-checkbox', {active: checked}]">
        <input class="csb-checkbox-input" type="checkbox" :id="id" :checked="checked" @click="updateChecked" :disabled="disabled"/>
        {{ label }}
    </label>
</template>

<script setup lang="ts">
defineProps({
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        checked: {
            type: Boolean,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    });
    const emit = defineEmits(['toggle']);
    function updateChecked(event: Event) {
        const target = event.target as HTMLInputElement;
        emit('toggle', target.checked);
    }
</script>


<style scoped lang="scss">
    .csb-checkbox {
        display: flex;
        align-items: center;
        input {
            margin-right: 0.5rem;
        }
        &-input {
            accent-color: $secondaryColor;
        }
    }
</style>