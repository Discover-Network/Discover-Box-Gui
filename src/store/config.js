import { defineStore } from "pinia";

export const appConfigStore = defineStore("appConfigStore", {
  state: () => {
    return {
      minBalance: 100000,
      minWithdraw: 1000,
      managerAddress: [],
      whiteList: [],
    };
  },
  actions: {
    updateMiniBalance(balance) {
      this.minBalance = balance;
    },
  },
});
