<template>
    <div v-if="loading" class="csb-loading">
        <div class="csb-loading-spinner">
            <i class="fa-solid fa-basketball"></i>
            <p class="csb-loading-spinner-text">Chargement des données</p>
        </div>
    </div>
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
.csb-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($white, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    &-spinner {
        color: $secondaryColor;
        text-align: center;
        i {
            animation: spinbounce 2s ease-in-out infinite;
            font-size: 3rem;
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