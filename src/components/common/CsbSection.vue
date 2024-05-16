<template>
    <div class="csb-section">
        <div class="csb-section-header">
            <slot name="header"></slot>
        </div>
        <div class="csb-section-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.csb-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    &-content {
        width: 100%;
    }
}
</style>