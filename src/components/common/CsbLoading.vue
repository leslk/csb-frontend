<template>
    <Transition>
        <div v-if="loading" class="csb-loading">
            <div class="csb-loading-spinner">
                <i class="fa-solid fa-basketball"></i>
                <p class="csb-loading-spinner-text">Chargement...</p>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
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
        color: $primaryColor;
        text-align: center;
        i {
            animation: spinbounce 2s ease-in-out infinite;
            font-size: 4rem;
        }
        &-text {
            padding-top: 20px;
            font-size: 1rem;
        }
    }
}

@keyframes spinbounce {
    0% { transform: rotate(0deg); }
    100% { 
        transform: rotate(360deg); 
    }
}

</style>