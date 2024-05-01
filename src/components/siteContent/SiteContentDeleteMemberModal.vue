<template>
    <CsbModal :show="show" @close="close">
        <template #header>
            <h2>Suppression d'un compte</h2>
        </template>
        <template #content>
            <div class="site-content-member-delete">
                <p>
                    {{
                        `Êtes-vous sûr de vouloir supprimer le membre ${member.firstName} ${member.lastName}?`
                    }}
                </p>
            </div>
        </template>
        <template #footer>
            <div class="site-content-member-delete-footer">
                <CsbButton label="Annuler" @click="close" />
                <CsbButton label="Confirmer" @click="deleteMember" />
            </div>
        </template>
    </CsbModal>
</template>

<script setup lang="ts">
import CsbModal from '@/components/common/CsbModal.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import { type Member } from '@/services/types';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    member: {
        type: Object as () => Member,
        required: true
    }
});

const emit = defineEmits(['close', 'confirm']);

function close() {
    emit('close');
}

function deleteMember() {
    emit('confirm', props.member._id);
    close();
}
</script>

<style scoped lang="scss">
.site-content-member-delete {
    display: flex;
    flex-direction: column;
    gap: 20px;
    * {
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.site-content-member-delete-footer {
    @include modal-footer;
}
</style>
