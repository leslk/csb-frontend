<template>
    <label :class="['csb-checkbox', {active: checked}]">
        <input class="csb-checkbox-input" type="checkbox" :id="id" :checked="checked" @click="updateChecked" :disabled="disabled"/>
        {{ label }}
    </label>
</template>

<script setup lang="ts">

/**
 * Vue component for the checkbox.
 * @component CsbCheckBox
 * @example <CsbCheckBox label="Statut" checked="true" id="admin-status" @toggle="toggleStatus($event)" disabled="false"/>
 */

/**
 * Props of the component
 * @props id: The id of the checkbox.
 * @props label: The label of the checkbox.
 * @props checked: Determines whether the checkbox is checked or not.
 * @props disabled: Determines whether the checkbox is disabled or not.
 */
defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

/**
 * Emits of the component
 * @emit toggle - Event emitted when the checkbox is toggled. Passes the checked status as a parameter.
 */
const emit = defineEmits(['toggle']);

/**
 * @function updateChecked
 * Update the checked status of the checkbox
 * @param event - The event object
 */
function updateChecked(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('toggle', target.checked);
}
</script>


<style scoped lang="scss">
    .csb-checkbox {
        display: flex;
        align-items: center;
        input {
            margin-right: 0.5rem;
        }
        &-input {
            accent-color: $secondaryColor;
        }
    }
</style>