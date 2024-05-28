<template>
    <div class="site-content-view">
        <div class="site-content-view-header">
            <CsbTitle title="Contenu du site" />
        </div>
        <CsbSection>
            <template #header>
                <h2>A propos</h2>
            </template>
            <template #content>
                <CsbCard class="site-content-view-aboutUs-card">
                    <template #content>
                        <div v-if="siteContent">
                            <pre class="site-content-view-aboutUs">{{ siteContent.aboutUs }}</pre>
                        </div>
                        <div class="site-content-view-aboutUs-card-footer">
                            <CsbButton
                                label="Modifier"
                                color="#f9ee57"
                                text-color="#000000"
                                @click="setShowDescriptionModal"
                            />
                        </div>
                    </template>
                </CsbCard>
            </template>
        </CsbSection>
        <CsbSection>
            <template #header>
                <div class="site-content-view-section-header">
                    <h2>Membres</h2>
                    <CsbButton
                        :is-icon-button="isSmallScreen"
                        icon="fa-solid fa-plus"
                        label="Ajouter un membre"
                        @click="setShowMemberModal"
                    />
                </div>
            </template>
            <template #content>
                <div class="site-content-view-members" v-if="members.length > 0">
                    <div v-for="member in members" :key="member._id">
                        <SiteContentMemberCard
                            :member="member"
                            @show-modal="setShowMemberCardModal"
                        />
                    </div>
                </div>
                <CsbEmptyState v-else text="Aucun membres" />
            </template>
        </CsbSection>
        <CsbSection>
            <template #header>
                <div class="site-content-view-section-header">
                    <h2>Contact</h2>
                </div>
            </template>
            <template #content>
                <CsbCard class="site-content-view-contact-card">
                    <template #content>
                        <div
                            class="site-content-view-contact-card-value"
                            v-for="(item, index) in formattedContact"
                            :key="index"
                        >
                            <p class="site-content-view-contact-card-label">{{ item.name }}:</p>
                            <p class="site-content-view-contact-card-data">{{ item.value }}</p>
                        </div>
                        <div class="site-content-view-aboutUs-card-footer">
                            <CsbButton
                                label="Modifier"
                                color="#f9ee57"
                                text-color="#000000"
                                @click="setShowContactModal"
                            />
                        </div>
                    </template>
                </CsbCard>
            </template>
        </CsbSection>
    </div>

    <SiteContentDescriptionModal
        :show="showDescriptionModal"
        :description="siteContent.aboutUs"
        @close="setShowDescriptionModal"
        @updateDescription="updateDescription"
    />

    <SiteContentContactModal
        :show="showContactModal"
        :contact="siteContent.contact"
        @close="setShowContactModal"
        @updateContact="updateContact"
    />
    <SiteContentMemberModal
        :show="showMemberModal"
        @close="setShowMemberModal"
        :member="member"
        @create-member="createMember"
    />
    <SiteContentDeleteMemberModal
        :show="showDeleteMemberModal"
        @close="setShowDeleteMemberModal"
        :member="member"
        @confirm="deleteMember"
    />
</template>

<script setup lang="ts">
import CsbTitle from '@/components/common/CsbTitle.vue';
import CsbButton from '@/components/common/CsbButton.vue';
import CsbSection from '@/components/common/CsbSection.vue';
import SiteContentDescriptionModal from '@/components/siteContent/SiteContentDescriptionModal.vue';
import SiteContentDeleteMemberModal from '@/components/siteContent/SiteContentDeleteMemberModal.vue';
import SiteContentContactModal from '@/components/siteContent/SiteContentContactModal.vue';
import SiteContentMemberModal from '@/components/siteContent/SiteContentMemberModal.vue';
import SiteContentMemberCard from '@/components/siteContent/SiteContentMemberCard.vue';
import CsbCard from '@/components/common/CsbCard.vue';
import CsbEmptyState from '@/components/common/CsbEmptyState.vue';
import { computed, onMounted, ref } from 'vue';
import { useServicesStore } from '@/stores/services';
import type { SiteContent as SiteContentType, Member, Contact } from '@/services/types';
import { SiteContent, Upload } from '@/services/services';
import { toast } from 'vue3-toastify';

/**
 * Site content view component.
 * @component SiteContentView
 * @example <SiteContentView />
 */


/**
 * @ref siteContent - The site content data.
 */
const siteContent = ref<SiteContentType>({
    aboutUs: '',
    members: [],
    contact: {
        instagram: '',
        facebook: '',
        tiktok: '',
        email: ''
    }
});

/**
 * @computed members - The members of the site.
 */
const members = computed(() => siteContent.value?.members || []);

/**
 * @ref member - The member to update.
 */
const member = ref<Member>({
    firstName: '',
    lastName: '',
    role: '',
    image: ''
});

/**
 * @computed contact - The contact information of the site.
 */
const contact = computed(() => siteContent.value?.contact);


const servicesStore = useServicesStore();

/**
 * @ref showDescriptionModal - The state of the description modal.
 */
const showDescriptionModal = ref(false);

/**
 * @ref showContactModal - The state of the contact modal.
 */
const showContactModal = ref(false);

/**
 * @ref showMemberModal - The state of the member modal.
 */
const showMemberModal = ref(false);

/**
 * @ref showDeleteMemberModal - The state of the delete member modal.
 */
const showDeleteMemberModal = ref(false);

/**
 * @computed isSmallScreen - The state of the screen size.
 */
const isSmallScreen = computed(() => servicesStore.getSmallDeviceScreen);

/**
 * Sets the state of the description modal.
 */
function setShowDescriptionModal() {
    showDescriptionModal.value = !showDescriptionModal.value;
}

/**
 * Sets the visibility of the contact modal.
 */
function setShowContactModal() {
    showContactModal.value = !showContactModal.value;
}

/**
 * Sets the visibility of the member modal.
 */
function setShowMemberModal() {
    showMemberModal.value = !showMemberModal.value;
    if (!showMemberModal.value) {
        resetMember();
    }
}

/**
 * Sets the visibility of the delete member modal.
 */
function setShowDeleteMemberModal() {
    showDeleteMemberModal.value = !showDeleteMemberModal.value;
}

/**
 * Sets the state of the member card modal.
 * @param {String} type - The type of modal.
 * @param {Member} memberToUpdate - The member to update.
 */
function setShowMemberCardModal(type: string, memberToUpdate: Member) {
    member.value = memberToUpdate;
    if (type === 'delete') {
        setShowDeleteMemberModal();
    } else {
        setShowMemberModal();
    }
}

/**
 * Fetches the site content.
 */
async function fetchSiteContent() {
    const response = await SiteContent.getSiteContent();
    siteContent.value = response.data[0];
}

/**
 * Updates the description.
 * @param {String} aboutUs - The description.
 */
async function updateDescription(aboutUs: string) {
    try {
        siteContent.value.aboutUs = aboutUs;
        await SiteContent.updateSiteContent(siteContent.value);
        await fetchSiteContent();
        toast.success('Description mise à jour');
    } catch (error) {
        toast.error('Erreur lors de la mise à jour de la description');
    }
}

/**
 * Updates the contact information.
 * @param {Contact} contact - The contact information.
 */
async function updateContact(contact: Contact) {
    try {
        siteContent.value.contact = contact;
        await SiteContent.updateSiteContent(siteContent.value);
        await fetchSiteContent();
        toast.success('Contact mis à jour');
    } catch (error) {
        toast.error('Erreur lors de la mise à jour du contact');
    }
}

/**
 * Creates a member.
 * @param {Member} member - The member to create.
 */
async function createMember(member: Member) {
    try {
        if (member._id) {
            const index = siteContent.value.members.findIndex((m) => m._id === member._id);
            siteContent.value.members[index] = member;
            await SiteContent.updateSiteContent(siteContent.value);
            await fetchSiteContent();
            toast.success('Membre mis à jour');
            return;
        } else {
            delete member._id;
            siteContent.value.members.push(member);
            await SiteContent.updateSiteContent(siteContent.value);
            await fetchSiteContent();
            toast.success('Membre ajouté');
            resetMember();
        }
    } catch (error) {
        toast.error("Erreur lors de l'ajout du membre");
    }
}

/**
 * Deletes a member.
 * @param {String} memberId - The member id.
 */
async function deleteMember(memberId: string) {
    try {
        const member = siteContent.value.members.find((member) => member._id === memberId);
        if (member) {
            await Upload.deleteImage(member.image);
        }
        siteContent.value.members = siteContent.value.members.filter(
            (member) => member._id !== memberId
        );
        await SiteContent.updateSiteContent(siteContent.value);
        await fetchSiteContent();
        toast.success('Membre supprimé');
        resetMember();
    } catch (error) {
        toast.error('Erreur lors de la suppression du membre');
    }
}

/**
 * Resets the member.
 */
function resetMember() {
    member.value = {
        firstName: '',
        lastName: '',
        role: '',
        image: ''
    };
}

/**
 * Formats the contact information.
 */
const formattedContact = computed(() =>
    Object.entries(contact.value)
        .filter(([key, value]) => key !== '_id')
        .map(([key, value]) => ({ name: key, value }))
);

/**
 * @event onMounted - Fetches the site content.
 */
onMounted(async () => {
    await fetchSiteContent();
});
</script>

<style scoped lang="scss">
.site-content-view {
    @include view-layout;
    &-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &-aboutUs {
        white-space: pre-wrap;
    }
    &-members {
        @include card-container;
    }
    &-aboutUs-card,
    &-contact-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        &-footer {
            @include card-footer;
        }
        &-data {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &-value {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        &-label {
            font-weight: bold;
            color: $secondaryColor;
        }
    }
}
</style>
