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

const emit = defineEmits(['close', 'createMember']);
const member = ref<Member>({
    _id: props.member._id || '',
    firstName: props.member.firstName || '',
    lastName: props.member.lastName || '',
    role: props.member.role || '',
    image: props.member.image || ''
});

const headerText = computed(() => {
    return member.value._id ? 'Modifier le membre' : 'Ajouter un membre';
});

const buttonText = computed(() => {
    return member.value._id ? 'Modifier' : 'Ajouter';
});

const memberRules = {
    firstName: { required: helpers.withMessage('Le prénom est requis', required) },
    lastName: { required: helpers.withMessage('Le nom est requis', required) },
    role: { required: helpers.withMessage('Le rôle est requis', required) },
    image: { required: helpers.withMessage('La photo est requise', required) }
};

const memberValidate = useVuelidate(memberRules, member);

function setFirstName(value: string) {
    member.value.firstName = value;
}

function setLastName(value: string) {
    member.value.lastName = value;
}

function setRole(value: string) {
    member.value.role = value;
}

async function addImage(image: string) {
    const response = await Upload.uploadImage(image);
    member.value.image = response.data.imageUrl;
}

async function removeImage(image: string) {
    await Upload.deleteImage(image);
    member.value.image = '';
}

function createMember() {
    memberValidate.value.$touch();
    if (memberValidate.value.$error) {
        return;
    }
    emit('createMember', member.value);
    emit('close');
}

function resetMember() {
    member.value = {
        _id: '',
        firstName: '',
        lastName: '',
        role: '',
        image: ''
    };
}

async function close() {
    if (!member.value._id && member.value.image) {
        await removeImage(member.value.image);
    }
    emit('close');
}

watch(
    () => props.member,
    (newValue) => {
        member.value = newValue;
        memberValidate.value.$reset();
    },
    { deep: true }
);

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
