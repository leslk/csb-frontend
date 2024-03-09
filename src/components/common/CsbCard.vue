<template>
    <div class="csb-card">
        <slot name="content"></slot>
    </div>
</template>

<style scoped lang="scss">
.csb-card {
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    background-color: $white;
    z-index: 0;
    &:hover {
        box-shadow: 0 0 10px 0 $darkGrey;
    }
}
</style>