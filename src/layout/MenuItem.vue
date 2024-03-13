<template>
    <div>
        <component :is="'router-link'" :to="item.path">
            <div :class="['menu-item', {'is-active': isActive}]">
              <i :class="item.meta?.metaIcon"></i>
              <p>{{ item.name }}</p>
            </div>
          </component>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue';

const props = defineProps(['item']);
const route = useRoute();
console.log(route.path, props.item.path);

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
}

.menu-item.is-active {
    background-color: rgba($primaryColor, 0.2);
    color: $primaryColor;
}
</style>