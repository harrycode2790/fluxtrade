import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axios";

export const useAdminSubscriptionStore = create((set) => ({
  // =====================
  // STATE
  // =====================
  subscriptions: [],
  singleSubscription: null,
  totalSubscription:null,

  isLoadingSubscriptions: false,
  isLoadingSingle: false,
  isSubmitting: false,

  // =====================
  // GET ALL SUBSCRIPTIONS
  // =====================
  getAllSubscriptions: async () => {
    set({ isLoadingSubscriptions: true });
    try {
      const res = await axiosInstance.get("/admin/subscriptions");
      set({ subscriptions: res.data.subscriptions });
      set({totalSubscription: res.data.meta.total})
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch subscriptions"
      );
    } finally {
      set({ isLoadingSubscriptions: false });
    }
  },

  // =====================
  // GET SINGLE SUBSCRIPTION
  // =====================
  getSingleSubscription: async (id) => {
    set({ isLoadingSingle: true });
    try {
      const res = await axiosInstance.get(`/admin/subscriptions/${id}`);
      set({ singleSubscription: res.data.subscription });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch subscription"
      );
    } finally {
      set({ isLoadingSingle: false });
    }
  },

  // =====================
  // DELETE SUBSCRIPTION
  // =====================
  deleteSubscription: async (id) => {
    try {
      await axiosInstance.delete(`/admin/subscriptions/${id}`);
      toast.success("Subscription deleted");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete subscription"
      );
    }
  },

  // =====================
  // BOTS
  // =====================
  addBot: async (payload) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post("/admin/subscriptions/bots", payload);
      toast.success("Bot added successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add bot");
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateBotSubscription: async (id, payload) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.put(`/admin/subscriptions/bots/${id}`, payload);
      toast.success("Bot updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update bot");
    } finally {
      set({ isSubmitting: false });
    }
  },

  // =====================
  // COPY TRADERS
  // =====================
  addCopyTrader: async (payload) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post("/admin/subscriptions/copy-traders", payload);
      toast.success("Copy trader added successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add copy trader"
      );
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateCopyTraderSubscription: async (id, payload) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.put(
        `/admin/subscriptions/copy-traders/${id}`,
        payload
      );
      toast.success("Copy trader updated successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update copy trader"
      );
    } finally {
      set({ isSubmitting: false });
    }
  },

  // =====================
  // TRADING PACKAGES
  // =====================
  addTradingPackage: async (payload) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post(
        "/admin/subscriptions/trading-packages",
        payload
      );
      toast.success("Trading package added successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add trading package"
      );
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateTradingPackage: async (id, payload) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.put(
        `/admin/subscriptions/trading-packages/${id}`,
        payload
      );
      toast.success("Trading package updated successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update trading package"
      );
    } finally {
      set({ isSubmitting: false });
    }
  },

  // =====================
  // CLEAR STATE
  // =====================
  clearSingleSubscription: () => set({ singleSubscription: null }),
}));
