<template>
    <div class="csb-social">
        <a :href="siteContent.contact?.facebook" aria-label="lien facebook">
            <i class="fa-brands fa-facebook-f"></i>
        </a>
        <a :href="siteContent.contact?.instagram" aria-label="lien instagram">
            <i class="fa-brands fa-instagram"></i>
        </a>
        <a :href="siteContent.contact?.tiktok" aria-label="lien tiktok">
            <i class="fa-brands fa-tiktok"></i>
        </a>
    </div>
</template>

<script setup lang="ts">
import { useServicesStore } from '@/stores/services';
import { computed } from 'vue';

/**
 * Vue component for the social links.
 * @component CsbSocial
 * @example <CsbSocial />
 */

/**
 * Store for the services.
 */
const servicesStore = useServicesStore();

/**
 * The site content of the store.
 */
const siteContent = computed(() => servicesStore.siteContent);
</script>

<style scoped lang="scss">
.csb-social {
    display: flex;
    gap: 1rem;
    justify-content: center;
    a {
        color: $primaryColor;
        font-size: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        aspect-ratio: 1/1;
    }
    i {
        font-size: 1rem;
    }
}
</style>