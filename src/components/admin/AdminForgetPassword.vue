<template>
    <template v-if="show && !success">
        <CsbTitle
            class="admin-forget-password-title"
            title="Demande de réinitialisation de mot de passe par e-mail"
        />
        <form class="admin-forget-password-form" @submit.prevent="submit">
            <CsbInput
                class="admin-forget-password-form-input"
                :value="email"
                type="text"
                placeholder="Email"
                @update:value="updateEmail"
                :error="emailError"
                icon="fa-solid fa-user"
            />
            <CsbButton
                class="admin-forget-password-button"
                label="Envoyer"
                @click="submit"
                color="#000000"
            />
        </form>
    </template>
    <template v-if="show && success">
        <CsbTitle
            class="admin-forget-password-title"
            title="Votre demande de réinitialsation de mot de passe a bien été prise en compte, Veuillez consulter votre boîte mail"
        />
        <CsbButton
            class="admin-forget-password-button__succcess"
            label="Retour à la connexion"
            @click="goToLogin"
            color="#000000"
        />
    </template>
</template>

<script setup lang="ts">
import CsbButton from '@/components/common/CsbButton.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbInput from '@/components/common/CsbInput.vue';
/**
 * Component for the admin forget password functionality.
 * @component AdminForgetPassword
 * @exemple <AdminForgetPassword :show="show" :success="success" :email="email" @updateEmail="updateEmail" @submit="submit" @goToLogin="goToLogin" />
 */

/**
 * Component for the admin forget password functionality.
 * @props show: Determines whether the modal should be shown or not.
 * @props success: Indicates the success of the password reset request.
 * @props email: The email address to reset the password for.
 * @exemple <AdminForgetPassword :show="show" :success="success" :email="email" @updateEmail="updateEmail" @submit="submit" @goToLogin="goToLogin" />
 */
defineProps({
    show: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emailError: {
        type: String,
        default: ''
    }
});

/**
 * Emits of the component
 * @emit updateEmail - Event emitted when the email is updated
 * @emit submit - Event emitted when the form is submitted.
 * @emit goToLogin - Event emitted when the user wants to go to the login page.
 */
const emit = defineEmits([
    'updateEmail',
    'submit',
    'goToLogin'
]);

/**
 * Submits the form
 * @param e The event object.
 */
function submit(e: Event) {
    e.preventDefault();
    emit('submit');
}

/**
 * Updates the email address.
 * @param email The updated email address.
 */
function updateEmail(email: string) {
    emit('updateEmail', email);
}

/**
 * Redirects the user to the login page.
 */
function goToLogin() {
    emit('goToLogin');
}
</script>

<style scoped lang="scss">
.admin-forget-password {
    &-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        padding: 3.75rem 1rem;
        max-width: 400px;
        &-input {
            width: 100%;
        }
    }
    &-button {
        width: 100%;
        border-radius: $borderRadius;
        &__succcess {
            width: min-content;
            border-radius: $borderRadius;
            white-space: nowrap;
        }
    }
    &-title {
        width: 70%;
        text-align: center;
    }
}
</style>
