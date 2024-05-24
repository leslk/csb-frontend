<template>
    <div class="cbs-empty-state">
        <p>{{ text }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps({
    text: {
        type: String,
        required: true
    }
});
</script>

<style scoped lang="scss">
.cbs-empty-state {
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    color: $darkerGrey;
    margin-top: 20px;
}
</style>
