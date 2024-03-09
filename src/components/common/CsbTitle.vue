<template>
    <h1 class="csb-title">{{ title }}</h1>
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