import { defineStore } from "pinia";


export const useServicesStore = defineStore('services', {
  state: () => ({
    smallDeviceScreen: false,
    loading: false,
  }),
  getters: {
    getSmallDeviceScreen(state) {
      return state.smallDeviceScreen;
    },
    getLoading(state) {
      return state.loading;
    },
  },
  actions: {
    setSmallDeviceScreen(value: boolean) {
        this.smallDeviceScreen = value;
    },
    setLoading(value: boolean) {
        this.loading = value;
    },
  },
  persist: true,
});