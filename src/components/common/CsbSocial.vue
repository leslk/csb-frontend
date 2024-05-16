<template>
    <div class="csb-social">
        <a href="https://www.facebook.com/" aria-label="lien facebook">
            <i class="fa-brands fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/" aria-label="lien instagram">
            <i class="fa-brands fa-instagram"></i>
        </a>
        <a href="https://www.linkedin.com/" aria-label="lien linkedin">
            <i class="fa-brands fa-tiktok"></i>
        </a>
    </div>
</template>

<script setup lang="ts"></script>

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