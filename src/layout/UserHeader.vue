<template>
    <header class="header">
        <div class="header-image">
            <img :src="Logo" alt="logo" />
        </div>
        <div class="header-social">
            <CsbSocial />
        </div>
        <nav>
            <ul class="header-menu">
                <li v-for="(item, index) in userRoutes" :key="index">
                    <MenuItem :show-icon="false" :item="item" />
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup lang="ts">
import Logo from '@/assets/csb_logo_yellow.png';
import CsbSocial from '@/components/common/CsbSocial.vue';
import MenuItem from '@/layout/MenuItem.vue';
import { useRouter } from 'vue-router';

/**
 * This component displays the header of the user page.
 * The user can navigate through the different pages of the user section.
 * @component UserHeader
 * @exemple <UserHeader />
 */

const router = useRouter();

/**
 * @computed userRoutes - A computed property that returns the routes of the user page.
 */
const userRoutes = router.options.routes
    .filter((route: any) => route.path === '/')[0]
    .children?.filter((route: any) => route.meta.isInTheMenu);
</script>

<style scoped lang="scss">
::v-deep(.menu-item.is-active) {
    background-color: transparent;
    color: $primaryColor;
}
::v-deep(.menu-item) {
    color: white;
    padding: 0;
    &:hover {
        background-color: transparent;
    }
}
.header {
    width: 100%;
    padding: 1rem;
    height: auto;
    background-color: $secondaryColor;
    color: $primaryColor;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &-image {
        margin-left: auto;
        margin-right: auto;
        height: 60px;
        width: 60px;
        img {
            height: 100%;
            width: 100%;
        }
    }
    &-social {
        position: absolute;
        right: 1rem;
    }
    &-menu {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
    }
}
</style>