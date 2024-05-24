<template>
    <button :class="['csb-button', {iconButton: isIconButton}]" :style="{'--color': color, '--text-color': textColor}">
        <i v-if="icon" :class="icon"></i>
        <span v-if="!isIconButton">{{ label }}</span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Vue component for the button.
 * @component CsbButton
 * @example <CsbButton label="Envoyer" text-color="#f9ee57" @click="sendContact"/>
 */

/**
 * Props of the component
 * @props label: The label of the button.
 * @props icon: The icon of the button.
 * @props isIconButton: Determines whether the button is an icon button or not.
 * @props color: The color of the button.
 * @props textColor: The text color of the button.
 */
const props = defineProps({
    label: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
    isIconButton: {
        type: Boolean,
        required: false,
        default: false
    },
    color: {
        type: String,
        required: false,
        default: '#161617'
    },
    textColor: {
        type: String,
        required: false,
        default: '#ffffff'
    }
});

/**
* The color of the button.
*/
const color = computed(() => props.color);

/**
 * The text color of the button.
 */
const textColor = computed(() => props.textColor);
</script>

<style scoped lang="scss">
.csb-button {
    padding: 0.625rem 1.25rem;
    border-radius: $borderRadius;
    background-color: var(--color);
    color: var(--text-color);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    justify-content: center;
    gap: 0.625rem;
    i {
        font-size: 1.2rem;
    }
    &:focus {
        outline: 2px solid var(--color);
    }
}

.iconButton {
    padding: 0;
    height: 2rem;
    width: 2rem;
    display: block;
    border-radius: 50%;
    i {
        margin: auto;
        font-size: 1rem;
    }
}
</style>