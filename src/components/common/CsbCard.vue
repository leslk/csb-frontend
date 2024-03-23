<template>
    <div class="csb-card">
        <slot name="content"></slot>
    </div>
</template>

<style scoped lang="scss">
.csb-card {
    padding: 1rem;
    border-radius: $borderRadius;
    box-shadow: 0 0 10px 0 rgba($secondaryColor, 0.1);
    background-color: $white;
    z-index: 0;
    &:hover {
        box-shadow:0 0 10px 0 rgba($secondaryColor, 0.5);
    }
}
</style>