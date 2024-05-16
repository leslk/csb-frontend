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
                    :value="item.value"
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
import { ref, watch, computed, type PropType } from 'vue';
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core/dist/index.cjs';
import { type ValidationRuleWithParams } from '@vuelidate/core';

interface ValidationRules {
    [key: string]: {
        required: ValidationRuleWithParams;
    };
}

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

const contact = ref(JSON.parse(JSON.stringify(props.contact)));

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

const ContactRules = generateValidationRules(contact);

const contactValidate = useVuelidate(ContactRules, contact);

const emit = defineEmits(['close', 'updateContact']);

const updateContact = () => {
    contactValidate.value.$touch();
    if (contactValidate.value.$error) {
        return;
    }
    emit('updateContact', contact.value);
    close();
};

const formattedContact = computed(() =>
    Object.entries(contact.value)
        .filter(([key, value]) => key !== '_id')
        .map(([key, value]) => ({ name: key, value }))
);

function setContact(newValue: string, key: string) {
    const keys: Array<keyof typeof contact.value> = formattedContact.value.map(
        (item) => item.name
    ) as any;
    if (keys.includes(key as any)) {
        contact.value[key as keyof typeof contact.value] = newValue;
    }
}

function resetContact() {
    contact.value = props.contact;
}

function close() {
    emit('close');
}

watch(
    () => props.contact,
    (newValue) => {
        contact.value = JSON.parse(JSON.stringify(newValue));
    }
);

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
