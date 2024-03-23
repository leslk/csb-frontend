<template>
    <transition name="fade-out">
        <div>
            <div class="csb-password-progress-bar">
                <div class="csb-password-progress-bar-container">
                    <div :class="['csb-password-progress-bar-progress', progressClass]" :style="{width: progress + '%'}"></div>
                </div>
            </div>
            <p class="csb-password-progress-bar-text">{{progressText}}</p>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
    password: {
        type: String,
        required: true
    }
});

const progress = ref<number>(0);
const progressClass = ref<string>('');
const progressText = ref<string>('Doit contenir au minimum 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
const regexes = [
    /.*[A-Z].*/,
    /.*[a-z].*/,
    /.*[0-9].*/,
    /.*\W.*/,
    /.{8,}/
];

function checkPassword(password: string) {
    let count = 0;
    for (const regex of regexes) {
        if (regex.test(password)) {
            count++;
        }
    }
    return count;
}

watch(() => props.password, (newValue) => {
    const strength = checkPassword(newValue);
    progress.value = 100 / regexes.length * strength;
    if (strength < 2) {
        progressClass.value = 'very-weak';
    } else if (strength < 3) {
        progressClass.value = 'weak';
    } else if (strength < 4) {
        progressClass.value = 'medium';
    } else if (strength < 5) {
        progressClass.value = 'strong';
    } else {
        progressClass.value = 'very-strong';
    }
});
</script>

<style scoped lang="scss">
.csb-password-progress-bar {
    width: 100%;
    height: 1rem;
    border-radius: 0.625rem;
    background-color: #f2f2f2;
    display: flex;
    justify-content: center;
    align-items: center;
    &-container {
        width: 100%;
        height: 100%;
        border-radius: 0.625rem;
        overflow: hidden;
        position: relative;
    }
    &-progress {
        height: 100%;
        background-color: #f2f2f2;
        position: absolute;
        top: 0;
        left: 0;
        transition: width 0.3s ease-in-out;
        &.very-weak {
                background-color: $errorColor;
        }
        &.weak {
            background-color: $warningColor;
        }
        &.medium {
            background-color: darken($primaryColor, 15%);
        }
        &.strong {
            background-color: $primaryColor;
        }
        &.very-strong {
            background-color: $successColor;
        }
    }
    &-text {
        padding-top: 0.625rem;
        font-size: 0.75rem;
    }
}

@keyframes fade-out {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.fade-out-leave-active {
    animation: fade-out 0.2s;
    
}
</style>