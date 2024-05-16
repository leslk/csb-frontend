<template>
    <h2 class="csb-title">{{ title }}</h2>
</template>

<script setup lang="ts">
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