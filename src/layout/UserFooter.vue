<template>
    <footer class="user-footer">
        <div class="footer-content">
            <div class="footer-logo">
                <img :src="Logo" alt="logo Caen Street Ball" />
            </div>
            <nav>
                <ul class="footer-site-map">
                    <li v-for="(item, index) in userRoutes" :key="index">
                        <MenuItem :show-icon="false" :item="item" />
                    </li>
                    <li>
                        <router-link to="/legale-notice">
                            <div class="menu-item" tabindex="0">
                                <p>Mentions légales</p>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="footer-social">
            <CsbSocial />
        </div>
    </footer>
</template>

<script setup lang="ts">
import Logo from '@/assets/csb_logo_black.png';
import CsbSocial from '@/components/common/CsbSocial.vue';
import MenuItem from '@/layout/MenuItem.vue';
import { useRouter } from 'vue-router';

/**
 * This component displays the footer of the user page.
 * @component UserFooter
 * @exemple <UserFooter />
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
    color: $secondaryColor;
}
::v-deep(.menu-item) {
    color: $secondaryColor;
    font-weight: bolder;
    padding: 0;
    &:hover {
        background-color: transparent;
    }
    &:focus {
        outline: 1px solid $primaryColor;
    }
}

.footer {
    &-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
    }
    &-logo {
        width: 100px;
        height: auto;
        img {
            width: 100%;
            height: 100%;
        }
    }
    &-site-map {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        padding-right: 2rem;
    }
    &-social {
        padding: 1rem;
        background-color: $secondaryColor;
    }

    @include mf-desktop-break-point {
        &-site-map {
            flex-direction: row;
        }
    }
}
</style>