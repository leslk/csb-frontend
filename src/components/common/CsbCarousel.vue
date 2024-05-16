<template>
    <carousel :breakpoints="breakpoints" :wrap-around="wrapAround" :style="{'--gap': gap}">
            <slot name="slide" />
        <template #addons>
                <Navigation />
        </template>
    </carousel>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { computed } from 'vue';
import { Carousel, Navigation } from 'vue3-carousel';

const props = defineProps({
    wrapAround: {
        type: Boolean,
        default: false,
    },
    length: {
        type: Number,
        default: 0,
    },
    gap: {
        type: Number,
        default: 0,
    },
});

const gap = computed(() => isSmallScreen.value ? '0rem' : `${props.gap}rem`);

const breakpoints = computed(() => {
    return {
        0: {
            itemsToShow: 1,
            snapAlign: 'start',
        },
        768: {
            itemsToShow: props.length > 2 ? 2 : props.length,
            snapAlign: 'start',
        },
        1024: {
            itemsToShow: props.length > 3 ? 3 : props.length,
            snapAlign: 'start',
        },
    }
});

const isSmallScreen = ref(window.innerWidth < 768);

function handleResize() {
    isSmallScreen.value = window.innerWidth < 768;
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});



</script>

<style lang="scss">
.carousel {
    &:focus-visible {
        outline: 2px solid $primaryColor !important;
    }
}

.carousel__track {
    gap: var(--gap);
}
.carousel__viewport {
    border-radius: 12px;
    display: flex;
    gap: 1rem;
    overflow: hidden;
    width: 100%;
    justify-content: center;
    &:focus-visible {
        outline: 2px solid $primaryColor !important;
    }
}
.carousel__next, .carousel__prev {
    height: 100%;
    margin: 0;
    &--disabled {
        cursor: initial;
        svg {
            background-color: rgba($secondaryColor, 0.2);
        }
    }
}
.carousel__next {
    svg {
        border-radius: 0 12px 12px 0;
        border-left: 1px solid $lightGrey;
    }
}
.carousel__prev {
    svg {
        border-radius: 12px 0 0 12px;
        border-right: 1px solid $lightGrey;
    }
}
.carousel__icon {
    background-color: $secondaryColor;
    opacity: 1;
    margin: 0;
    color: $white;
    height: 100%;
    width: 100%;
}
</style>