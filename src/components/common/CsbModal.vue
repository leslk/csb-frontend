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
import { watch } from 'vue';

/**
 * Vue component for the modal.
 * @component CsbModal
 * @example <CsbModal :show="show" @close="close">
 */

/**
 * Props of the component.
 * @prop {Boolean} show - Determines whether the modal is shown or not.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
});

/**
 * Emits of the component.
 * @emit close - Event emitted when the modal is closed.
 */
const emit = defineEmits(['close']);

/**
 * Watcher for the show prop.  
 * Adds the 'modal-open' class to the body
 * when the modal is shown and removes it when it is hidden.
 */
watch(
    () => props.show,
    () => {
        if (props.show) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }
);
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
        border-radius: $borderRadius;
        width: 80%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: scroll;
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
        height: 100%;
        overflow: scroll;
    }
    &-footer {
        padding-top: 1.25rem;
        border-top: 1px solid $lighterGrey;
        display: flex;
        justify-content: flex-end;
        gap: 0.625rem;
    }
    @include mobile-break-point {
        &-content {
            width: 95%;
        }
    }
}
</style>
