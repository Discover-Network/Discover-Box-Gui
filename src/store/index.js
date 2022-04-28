import { defineStore } from "pinia";

export const appStore = defineStore("appStore", {
  state: () => {
    return {
      defaultAddress: "",
      accessToken: "",
    };
  },
  actions: {
    updateDefaultAddress(address) {
      this.defaultAddress = address;
    },
    setAccessToken(token) {
      this.accessToken = token;
    },
  },
});
