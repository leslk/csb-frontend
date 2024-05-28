<template>
    <div class="member-card">
        <img :src="member.image" :alt="imageAtlText" />
        <div class="member-card-content">
            <h3>{{ member.firstName }}</h3>
            <p>{{ member.role }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Member } from '@/services/types';
import { computed } from 'vue';

/**
 * Component for displaying a member card.
 * @component MemberCard
 * @example <MemberCard :member="member" />
 */

/**
 * Props of the component
 * @prop {Member} member - The member to display.
 */
const props = defineProps({
    member: {
        type: Object as () => Member,
        required: true
    }
});

/**
 * The alt text of the image.
 */
const imageAtlText = computed(
    () =>
        `Photo de ${props.member.firstName} ${props.member.lastName} ${props.member.role} de l'équipe de Caen Streetball`
);
</script>

<style scoped lang="scss">
.member-card {
    position: relative;
    width: 80%;
    height: 300px;
    margin: 0 auto;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &-content {
        position: absolute;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        text-align: left;
        color: $primaryColor;
        padding: 0.625rem 1rem;
        width: 100%;
        h3 {
           font-weight: 700;
        }
    }

    @include mf-tablet-break-point {
        width: 100%;
        height: 350px;
    }
}
</style>