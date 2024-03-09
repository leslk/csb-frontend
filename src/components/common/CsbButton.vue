<template>
    <button :class="['csb-button', {iconButton: isIconButton}]">
        <i v-if="icon" :class="icon"></i>
        <span v-if="!isIconButton">{{ label }}</span>
    </button>
</template>

<script setup lang="ts">
defineProps({
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
    }
});
</script>

<style scoped lang="scss">
.csb-button {
    padding: 0.625rem 1.25rem;
    border-radius: 10px;
    background-color: $secondaryColor;
    color: $white;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
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