import { defineStore } from "pinia";
import { type SiteContent } from "@/services/types";
import { SiteContent as SiteContentService } from "@/services/services";


/**
 * @name useServicesStore
 * @description
 * This store is used to manage the services of the application.
 * It contains the following properties:
 * - smallDeviceScreen: a boolean to check if the device screen is small
 * - loading: a boolean to check if the data is loading
 * - siteContent: the content of the site
 */
export const useServicesStore = defineStore('services', {
  state: () => ({
    smallDeviceScreen: false,
    loading: false,
    siteContent: {} as SiteContent,
  }),
  getters: {
    getSmallDeviceScreen(state) {
      return state.smallDeviceScreen;
    },
    getLoading(state) {
      return state.loading;
    },
    getSiteContent(state) {
      return state.siteContent;
    },
  },
  actions: {
    setSmallDeviceScreen(value: boolean) {
        this.smallDeviceScreen = value;
    },
    setLoading(value: boolean) {
        this.loading = value;
    },
    setSiteContent() {
        this.loading = true;
        SiteContentService.getSiteContent().then((response) => {
            this.siteContent = response.data[0];
            this.loading = false;
        });
    },
  },
  persist: true,
});