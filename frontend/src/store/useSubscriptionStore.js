import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useSubscriptionStore = create((set, get) => ({
  isgettingBot: false,
  bots: [],
  isgettingCopyTrader: false,
  copyTrader: [],
  isgettingTradingPackage: false,
  tradingPackage: [],
  userSubscriptions: [],
  isbuyingSubscription: false,

  getBot: async () => {
    set({ isgettingBot: true });
    try {
      const res = await axiosInstance.get("/subscription/bot");
      set({ bots: res.data.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isgettingBot: false });
    }
  },

  getCopyTrader: async () => {
    set({ isgettingCopyTrader: true });
    try {
      const res = await axiosInstance.get("/subscription/copy-traders");
      set({ copyTrader: res.data.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isgettingCopyTrader: false });
    }
  },

  getTradingPackage: async () => {
    set({ isgettingTradingPackage: true });
    try {
      const res = await axiosInstance.get("/subscription/trading-packages");
      set({ tradingPackage: res.data.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isgettingTradingPackage: false });
    }
  },

  getUserSubscriptions: async () => {
    try {
      const res = await axiosInstance.get("/portfolio/");
      set({ userSubscriptions: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  buySubscription: async (subscriptionId) => {
    set({ isbuyingSubscription: true });

    try {
      await axiosInstance.post("/portfolio/buy",  subscriptionId );
      toast.success("Subscription purchased successfully");
      await get().getUserSubscriptions();
      // update auth user data like balance
      await useAuthStore.getState().refreshUser();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isbuyingSubscription: false });
    }
  },
}));
