<template>
    <div class="csb-status" :style="{ backgroundColor: color }">
        <i :class="icon" />
        <p>{{ text }}</p>
    </div>
</template>

<script setup lang="ts">
/**
 * Vue component for the status.
 * @component CsbStatus
 * @example <CsbStatus icon="fa-solid fa-circle-check" text="Envoyé" color="#00ff00" />
 */

/**
 * Props of the component
 * @props icon: The icon of the status.
 * @props text: The text of the status.
 * @props color: The color of the status.
 */
defineProps({
    icon: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'var(--light-grey)'
    }
});
</script>

<style scoped lang="scss">
.csb-status {
    display: flex;
    align-items: center;
    border-radius: $borderRadius;
    padding: 0.2rem 0.5rem;
    gap: 0.5rem;
    color: $white;
}
</style>
