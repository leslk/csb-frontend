<template>
    <Transition>
        <div v-if="loading" class="csb-loading">
            <div class="csb-loading-spinner">
                <img :src="Image" alt="Logo Caen street ball" />
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import Image from "@/assets/csb_logo_letter.png";

/**
 * Vue component for the loading.
 * @component CsbUserLoading
 * @example <CsbUserLoading :loading="loading" />
 */

/**
 * Props of the component
 * @props loading: Determines whether the loading is shown or not.
 */
defineProps({
    loading: {
        type: Boolean,
        required: true
    }
});
</script>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.csb-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($secondaryColor, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000;
    &-spinner {
        text-align: center;
        img {
            animation: bounce 2s ease-in-out infinite;
            width: 30%;
        }
    }
}

@keyframes bounce {
    0% { transform: scale(1.1); }
    100% { 
        transform: scale(0.9); 
    }
}

</style>