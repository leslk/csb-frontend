<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Modifier les données de contact</h2>
        </template>
        <template #content>
            <form class="site-content-contact-form">
                <CsbInput
                    v-for="(item, index) in formattedContact"
                    :key="index"
                    :label="item.name"
                    :value="item.value as string"
                    @update:value="setContact($event, item.name)"
                    :error="contactValidate[item.name]?.$errors[0]?.$message"
                />
            </form>
        </template>
        <template #footer>
            <div class="modal-footer">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Modifier" @click="updateContact" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { type Contact } from '@/services/types';
import { ref, watch, computed} from 'vue';
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core/dist/index.cjs';
import { type ValidationRuleWithParams } from '@vuelidate/core';

/**
 * Vue component for the site content contact modal.
 *
 * @component SiteContentContactModal
 * @example <SiteContentContactModal :show="show" :contact="contact" @close="close" @updateContact="updateContact" />
 */

/**
 * @interface ValidationRules
 * @property {Object} [key] - The key of the object.
 * @property {Object} required - The required validation rule.
 */
interface ValidationRules {
    [key: string]: {
        required: ValidationRuleWithParams;
    };
}

/**
 * Props of the component
 * @props show: The visibility of the modal.
 * @props contact: The contact to be updated.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    contact: {
        type: Object as () => Contact,
        required: true
    }
});

/**
 * Refs of the component
 * @ref contact: The contact to be updated.
 */
const contact = ref(JSON.parse(JSON.stringify(props.contact)));

/**
 * Generate the validation rules for the contact form.
 * @param contact - The contact to be updated.
 * @returns The validation rules for the contact form.
 */
function generateValidationRules(contact: any): ValidationRules {
    const rules: ValidationRules = {};
    for (const [key, value] of Object.entries(contact.value)) {
        if (key != '_id') {
            rules[key] = {
                required: helpers.withMessage(`${key} ne peut pas être vide`, required)
            };
        }
    }
    return rules;
}

/**
 * Validation rules for the contact form.
 */
const ContactRules = generateValidationRules(contact);

/**
 * Validation for the contact form.
 */
const contactValidate = useVuelidate(ContactRules, contact);

/**
 * Emits of the component
 * @emit close - Event emitted when the modal is closed.
 * @emit updateContact - Event emitted when the contact is updated.
 */
const emit = defineEmits(['close', 'updateContact']);

/**
 * @function updateContact - Update the contact.
 * Update the contact.
 */
const updateContact = () => {
    contactValidate.value.$touch();
    if (contactValidate.value.$error) {
        return;
    }
    for (const [key, value] of Object.entries(contact.value).filter(([key]) => key !== '_id' && key !== 'email')) {
        if (typeof value === 'string' && !value.startsWith('https://')){
            contact.value[key] = `https://${value}`;
        }
    }
    emit('updateContact', contact.value);
    close();
};

/**
 * Formatted contact.
 */
const formattedContact = computed(() =>
    Object.entries(contact.value)
        .filter(([key, value]) => key !== '_id')
        .map(([key, value]) => ({ name: key, value }))
);

/**
 * @function setContact
 * Set the contact value.
 * @param newValue - The new value.
 * @param key - The key of the contact.
 */
function setContact(newValue: string, key: string) {
    const keys: Array<keyof typeof contact.value> = formattedContact.value.map(
        (item) => item.name
    ) as any;
    if (keys.includes(key as any)) {
        contact.value[key as keyof typeof contact.value] = newValue;
    }
}

/**
 * @function resetContact
 * Reset the contact.
 */
function resetContact() {
    contact.value = props.contact;
}

/**
 * @function close
 * Close the modal.
 */
function close() {
    emit('close');
}

/**
 * Watch the contact prop and update the contact.
 * @param newValue - The new value of the contact.
 */
watch(
    () => props.contact,
    (newValue) => {
        contact.value = JSON.parse(JSON.stringify(newValue));
    }
);

/**
 * Watch the show prop and reset the contact.
 * @param newValue - The new value of the show prop.
 */
watch(
    () => props.show,
    (newValue) => {
        if (!newValue) {
            resetContact();
            contactValidate.value.$reset();
        }
    }
);
</script>

<style scoped lang="scss">
.modal-footer {
    @include modal-footer;
}

.site-content-contact-form {
    @include form-layout;
}
</style>
