<template>
    <div class="not-found">
        <div class="not-found__content">
            <h1>404</h1>
            <p>Cette page n'existe pas</p>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.not-found {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;

    &__content {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        h1 {
            font-size: 10rem;
            font-family: 'breakside';
        }

        p {
            font-size: 2rem;
            margin: 0;
        }
    }
}
</style>