import  {defineStore} from "pinia";

export const useAuthStore = defineStore('auth', {
  state: () => {
    const user: any = null;
    return {
      user,
    };
  },

  getters: {
    isLoggedIn(state) {
        return state.user ? true : false;
    }
  },
  actions: {
    login(user: any) {
      this.user = user;
    },
    logout() {
      this.user = null;
    },
  },
  persist: true,
});