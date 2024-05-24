<template>
    <main>
        <div class="user-contact-view-header">
            <div class="user-contact-view-header-text">
                <h1 class="user-contact-view-main-title">CONTACT</h1>
            </div>
            <img
                :src="Image"
                class="user-contact-view-image"
                alt="home page image: photo de tournoi de basket-ball"
            />
        </div>
        <div class="user-contact-view-content">
            <CsbSection class="user-contact-view-contact" v-if="!sendStatus">
                <template #header>
                    <CsbTitle title="Contactez-nous" class="user-contact-view-form-title"/>
                    <p class="user-contact-view-form-text">Pour toutes questions, collaborations...</p>
                </template>
                <template #content>
                    <form class="user-contact-view-form">
                        <div class="user-contact-view-form-flex-item">
                           <CsbInput 
                                label="Nom" 
                                @update:value="form.name = $event" 
                                :error="contactValidate.name?.$errors[0]?.$message"
                           />
                            <CsbInput 
                                label="Prénom" 
                                @update:value="form.firstName = $event" 
                                :error="contactValidate.firstName?.$errors[0]?.$message"
                            />
                        </div>
                        <div class="user-contact-view-form-flex-item">
                            <CsbInput 
                                label="Email" 
                                type="email" 
                                @update:value="form.email = $event"
                                :error="contactValidate.email?.$errors[0]?.$message"
                            />
                            <CsbInput 
                                label="Téléphone" 
                                type="tel" 
                                @update:value="form.phone = $event"
                                :error="contactValidate.phone?.$errors[0]?.$message"
                            />
                        </div>
                        <div class="user-contact-view-form-item">
                            <CsbTextArea 
                                label="Message" 
                                @update:value="form.message = $event"
                                :error="contactValidate.message?.$errors[0]?.$message"
                            />
                        </div>
                    </form>
                    <div class="user-contact-view-contact-button">
                        <CsbButton label="Envoyer" text-color="#f9ee57" @click="sendContact"/>
                    </div>
                </template>           
            </CsbSection>
            <CsbSection class="user-contact-view-contact" v-else>
                <template #header>
                    <CsbTitle :title="sentTitle" class="user-contact-view-form-title"/>
                </template>
                <template #content>
                    <p>{{ sentText }}</p>
                    <div class="user-contact-view-sent-button">
                        <CsbButton label="Retour à l'accueil" text-color="#f9ee57" @click="redirectToHomePage"/>
                    </div>
                </template>
            </CsbSection>
        </div>
   </main>
</template>

<script setup lang="ts">
import Image from '@/assets/contact.jpg';
import CsbSection from '@/components/common/CsbSection.vue';
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbTextArea from '@/components/common/CsbTextArea.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { computed, ref } from 'vue';
import {Contact} from '@/services/services';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

/**
 * Vue component for the user contact view.
 * @component UserContactView
 * @example <UserContactView />
 */

 /**
  * router to navigate 
  */
const router = useRouter();

/**
 * @ref form - form object to store the user's contact information
 */
const form = ref({
    name: '',
    firstName: '',
    email: '',
    phone: '',
    message: ''
});

/**
 * @const contactRules - object to define the rules for the user's contact information
 */
const contactRules = {
    name: { required: helpers.withMessage('Le nom est requis', required) },
    firstName: { required: helpers.withMessage('Le prénom est requis', required) },
    email: { required: helpers.withMessage('L\'email est requis', required) },
    phone: { required: helpers.withMessage('Le téléphone est requis', required) },
    message: { required: helpers.withMessage('Le message est requis', required) }
};

/**
 * @const contactValidate - object to validate the user's contact information
 */
const contactValidate = useVuelidate(contactRules, form);

/**
 * @ref sendStatus - variable to store the status of the message sent
 */
const sendStatus = ref<string>("");

/**
 * @const sentTitle - variable to store the title of the message sent
 */
const sentTitle = computed(() => sendStatus.value === "success" ? "Message envoyé" : "Erreur");

/**
 * @const sentText - variable to store the text of the message sent
 */
const sentText = computed(() => sendStatus.value === "success" ? "Merci pour votre message, nous vous répondrons dans les plus brefs délais." : "Une erreur est survenue lors de l'envoi de votre message, veuillez réessayer.");

/**
 * sendContact function to send the user's contact information
 * if the form is valid, the message is sent and the status is updated
 */
async function sendContact() {
    try {
        contactValidate.value.$touch();
        if (contactValidate.value.$error) {
            return;
        }
        await Contact.sendMessage(form.value);
        sendStatus.value = "success";
    } catch (error) {
        sendStatus.value = "error";
    }  
};

/**
 * redirectToHomePage function to redirect the user to the home page
 */
function redirectToHomePage() {
    router.push({name: 'Accueil'});
};

</script>

<style lang="scss" scoped>
::v-deep(.csb-input-content) {
    border-left: 1px solid $lightGrey;
}
::v-deep(.csb-text-area) {
    border-left: none;
}
.user-contact-view {
    &-header {
        @include user-header;
    }
    &-content {
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 4rem;
        align-items: center;
        width: 100%;
    }
    &-contact {
        width: 100%;
        text-align: center;
    }
    &-image_container {
        height: 400px;
        width: 10%;
    }
    &__image {
        width: 100%;
        height: 400px;
        object-fit: cover;
    }
    &-form-title {
        font-size: 2rem !important;
    }
    &-form-text {
        font-size: 0.8rem;
        margin-top: 1rem;
    }
    &-form {
        text-align: start;
        @include form-layout;
        width: 100%;
    }
    &-form-flex-item {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1rem;
    }
    &-contact-button, &-sent-button {
        color: $primaryColor;
        margin-top: 2rem;
        display: flex;
        width: 100%;
        justify-content: center;
    }
    @include mf-tablet-break-point {
        &-content {
            max-width: 1200px;
            margin: auto;
        }
        &-form-flex-item {
            flex-direction: row;
            flex-grow: 1;
        }
    }
}
</style>