<template>
    <div v-if="show" class="csb-modal">
        <div class="csb-modal-content">
            <div class="csb-modal-header">
                <slot name="header"></slot>
                <i class="fa-solid fa-xmark" @click="emit('close')"></i>
            </div>
            <div class="csb-modal-body">
                <slot name="content"></slot>
            </div>
            <div class="csb-modal-footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps({
    show: {
        type: Boolean,
        required: true
    },
});

const emit = defineEmits(['close']);
</script>

<style scoped lang="scss">
.csb-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($secondaryColor, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    &-content {
        padding: 1rem;
        background-color: $white;
        border-radius: 10px;
        width: 80%;
        max-width: 600px;
    }
    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid $lighterGrey;
        i {
            font-size: 1rem;
            cursor: pointer;
        }
    }
    &-body {
        padding: 1.25rem;
    }
    &-footer {
        padding-top: 1.25rem;
        border-top: 1px solid $lighterGrey;
        display: flex;
        justify-content: flex-end;
        gap: 0.625rem;
    }
}

</style>