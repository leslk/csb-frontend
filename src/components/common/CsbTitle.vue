<template>
    <h2 class="csb-title">{{ title }}</h2>
</template>

<script setup lang="ts">

/**
 * Vue component for the title.
 * @component CsbTitle
 * @example <CsbTitle title="Envoyer" />
 */

/**
 * Props of the component
 * @props title: The title of the title.
 */
defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>

<style scoped lang="scss">
.csb-title {
    font-size: 2rem;
    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
}
</style>