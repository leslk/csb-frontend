<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>{{ headerText }}</h2>
        </template>
        <template #content>
            <div class="site-content-description-form">
                <CsbInput
                    label="Prénom"
                    :value="member.firstName"
                    @update:value="setFirstName($event)"
                    :error="memberValidate.firstName?.$errors[0]?.$message"
                />
                <CsbInput
                    label="Nom"
                    :value="member.lastName"
                    @update:value="setLastName($event)"
                    :error="memberValidate.lastName?.$errors[0]?.$message"
                />
                <CsbInput
                    label="Rôle"
                    :value="member.role"
                    @update:value="setRole($event)"
                    :error="memberValidate.role?.$errors[0]?.$message"
                />
                <CsbImageUploader
                    label="Photo"
                    :imageUrl="member.image"
                    @update:image-url="addImage"
                    @delete:image-url="removeImage"
                    :multiple="false"
                    :error="memberValidate.image?.$errors[0]?.$message"
                />
            </div>
        </template>
        <template #footer>
            <div class="modal-footer">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton :label="buttonText" @click="createMember" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbInput from '@/components/common/CsbInput.vue';
import CsbImageUploader from '@/components/common/CsbImageUploader.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { type Member } from '@/services/types';
import { Upload } from '@/services/services';
import { computed, ref, watch, type PropType } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

/**
 * Vue component for the site content member modal.
 *
 * @component SiteContentMemberModal
 * @example <SiteContentMemberModal :show="show" :member="member" @close="close" @createMember="createMember" />
 */

/**
 * Props of the component
 * @props show: The visibility of the modal.
 * @props member: The member to be updated.
 */
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    member: {
        type: Object as PropType<Member>,
        required: true
    }
});


/**
 * Emits of the component
 * @emits close - The event emitted when the modal is closed.
 * @emits createMember - The event emitted when the member is created.
 */
const emit = defineEmits(['close', 'createMember']);

/**
 * @ref {Ref<Member>} member - The member to be updated.
 */
const member = ref<Member>({
    _id: props.member._id || '',
    firstName: props.member.firstName || '',
    lastName: props.member.lastName || '',
    role: props.member.role || '',
    image: props.member.image || ''
});

/**
 * @ref {ComputedRef<string>} headerText - The text of the header.
 */
const headerText = computed(() => {
    return member.value._id ? 'Modifier le membre' : 'Ajouter un membre';
});

/**
 * @ref {ComputedRef<string>} buttonText - The text of the button.
 */
const buttonText = computed(() => {
    return member.value._id ? 'Modifier' : 'Ajouter';
});

/**
 * Rules for the member form.
 */
const memberRules = {
    firstName: { required: helpers.withMessage('Le prénom est requis', required) },
    lastName: { required: helpers.withMessage('Le nom est requis', required) },
    role: { required: helpers.withMessage('Le rôle est requis', required) },
    image: { required: helpers.withMessage('La photo est requise', required) }
};

/**
 * Member validation that uses the rules of the member to avoid empty fields.
 */
const memberValidate = useVuelidate(memberRules, member);

/**
 * Function to set the first name of the member.
 *
 * @function setFirstName
 * @param {string} value - The updated first name value.
 */
function setFirstName(value: string) {
    member.value.firstName = value;
}

/**
 * Function to set the last name of the member.
 *
 * @function setLastName
 * @param {string} value - The updated last name value.
 */
function setLastName(value: string) {
    member.value.lastName = value;
}

/**
 * Function to set the role of the member.
 *
 * @function setRole
 * @param {string} value - The updated role value.
 */
function setRole(value: string) {
    member.value.role = value;
}

/**
 * Function to add an image to the member.
 *
 * @function addImage
 * @param {string} image - The image to be added.
 */
async function addImage(image: string) {
    const response = await Upload.uploadImage(image);
    member.value.image = response.data.imageUrl;
}

/**
 * Function to remove an image from the member.
 *
 * @function removeImage
 * @param {string} image - The image to be removed.
 */
async function removeImage(image: string) {
    await Upload.deleteImage(image);
    member.value.image = '';
}

/**
 * Function to create a member.
 *
 * @function createMember
 * Create the member if the form is valid.
 */
function createMember() {
    memberValidate.value.$touch();
    if (memberValidate.value.$error) {
        return;
    }
    emit('createMember', member.value);
    emit('close');
}

/**
 * Function to reset the member.
 *
 * @function resetMember
 * Reset the member.
 */
function resetMember() {
    member.value = {
        _id: '',
        firstName: '',
        lastName: '',
        role: '',
        image: ''
    };
}

/**
 * Function to close the modal.
 *
 * @function close
 * Close the modal.
 */
async function close() {
    if (!member.value._id && member.value.image) {
        await removeImage(member.value.image);
    }
    emit('close');
    resetMember();
}

/**
 * Watch the member prop and update the member value.
 * @param newValue - The new value of the member
 * if the member prop changes, the member is updated
 */
watch(
    () => props.member,
    (newValue) => {
        member.value = newValue;
        memberValidate.value.$reset();
    },
    { deep: true }
);

/**
 * Watch the show prop and reset the member.
 * @param newValue - The new value of the show prop.
 * if the show prop changes, the member is reset
 */
watch(
    () => props.show,
    (newValue) => {
        if (!newValue) {
            resetMember();
        }
    }
);
</script>

<style scoped lang="scss">
.modal-footer {
    @include modal-footer;
}

.site-content-description-form {
    @include form-layout;
}
</style>
