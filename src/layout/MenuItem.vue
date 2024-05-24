<template>
    <div>
        <component :is="'router-link'" :to="item.path" class="item">
            <div :class="['menu-item', { 'is-active': isActive }]" tabindex="0">
                <i v-if="showIcon" :class="item.meta?.metaIcon"></i>
                <p>{{ item.name }}</p>
            </div>
        </component>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

/**
 * This component displays a menu item.
 * @component MenuItem
 * @exemple <MenuItem :item="item" />
 */

/**
 * Props of the component.
 * item: the item to display.
 * showIcon: a boolean value indicating whether to show the icon.
 */
const props = defineProps(['item', 'showIcon']);
const route = useRoute();

/**
 * @computed isActive - A computed property that returns a boolean value indicating whether the item is active or not.
 */
const isActive = computed(() => {
    return route.path.includes(props.item.path);
});
</script>

<style scoped lang="scss">
.menu-item {
    padding: 0.938rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 10px;
    &:hover {
        background-color: rgba($primaryColor, 0.1);
    }
    &:focus {
       outline: 1px solid $primaryColor;
    }
}

.menu-item.is-active {
    background-color: rgba($primaryColor, 0.2);
    color: $primaryColor;
}
</style>
