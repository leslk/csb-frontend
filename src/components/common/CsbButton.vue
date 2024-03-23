<template>
    <button :class="['csb-button', {iconButton: isIconButton}]" :style="{'--color': color}">
        <i v-if="icon" :class="icon"></i>
        <span v-if="!isIconButton">{{ label }}</span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
    isIconButton: {
        type: Boolean,
        required: false,
        default: false
    },
    color: {
        type: String,
        required: false,
        default: '#161617'
    },
});

const color = computed(() => props.color);
</script>

<style scoped lang="scss">
.csb-button {
    padding: 0.625rem 1.25rem;
    border-radius: $borderRadius;
    background-color: var(--color);
    color: $white;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    justify-content: center;
    gap: 0.625rem;
    i {
        font-size: 1.2rem;
    }
}

.iconButton {
    padding: 0;
    height: 2rem;
    width: 2rem;
    display: block;
    border-radius: 50%;
    i {
        margin: auto;
        font-size: 1rem;
    }
}
</style>