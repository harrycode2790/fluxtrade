import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useOrderStore = create((set, get) => ({
  // ---------------- STATE ----------------
  cryptoOrders: [],
  stockOrders: [],
  isLoadingCrypto: false,
  isLoadingStock: false,
  isPlacingCryptoTrade: false,
  liveStatus: {},

  getCryptoOrders: async () => {
    set({ isLoadingCrypto: true });

    try {
      const res = await axiosInstance.get("/orders/crypto");
      set({ cryptoOrders: res.data });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load crypto orders"
      );
    } finally {
      set({ isLoadingCrypto: false });
    }
  },

  getStockOrders: async () => {
    set({ isLoadingStock: true });

    try {
      const res = await axiosInstance.get("/orders/stocks");
      set({ stockOrders: res.data });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load stock orders"
      );
    } finally {
      set({ isLoadingStock: false });
    }
  },

  placeCryptoOrder: async (orderData) => {
    set({ isPlacingCryptoTrade: true });

    try {
      await axiosInstance.post("/orders/crypto/place", orderData);
      toast.success("Trade placed successfully");
      await get().getCryptoOrders(); // return order for optional UI updates
      await useAuthStore.getState().refreshUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place trade");
      throw err;
    } finally {
      set({ isPlacingCryptoTrade: false });
    }
  },

  placeStockOrder: async (orderData) => {
    set({ isPlacingCryptoTrade: true });

    try {
      await axiosInstance.post("/orders/stocks/place", orderData);
      toast.success("Trade placed successfully");
      await get().getStockOrders(); // return order for optional UI updates
      await useAuthStore.getState().refreshUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place trade");
      throw err;
    } finally {
      set({ isPlacingCryptoTrade: false });
    }
  },

  checkOrderStatus: async (orderId) => {
    try {
      const res = await axiosInstance.get(`/orders/${orderId}/status`);

      set((state) => ({
        liveStatus: {
          ...state.liveStatus,
          [orderId]: res.data,
        },
      }));
    } catch {
      // silent fail (important for polling)
    }
  },

  clearOrderStatus: (orderId) =>
    set((state) => {
      const copy = { ...state.liveStatus };
      delete copy[orderId];
      return { liveStatus: copy };
    }),

  closeCryptoTrade: async (orderId) => {
    try {
      await axiosInstance.post(`/orders/${orderId}/close`);
      toast.success("Trade Closed Successfully");
      await get().getCryptoOrders();
      await useAuthStore.getState().refreshUser();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load stock orders"
      );
    }
  },

  closeStockTrade: async (orderId) => {
    try {
      await axiosInstance.post(`/orders/${orderId}/close`);
      toast.success("Trade Closed Successfully");
      await get().getStockOrders();
      await useAuthStore.getState().refreshUser();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load stock orders"
      );
    }
  },

  deleteClosedOrder: async (orderId, type = "crypto") => {
    try {
      await axiosInstance.delete(`/orders/${orderId}/delete`);

      set((state) => ({
        [`${type}Orders`]: state[`${type}Orders`].filter(
          (o) => o.id !== orderId
        ),
        liveStatus: Object.fromEntries(
          Object.entries(state.liveStatus).filter(([key]) => key !== orderId)
        ),
      }));

      toast.success("Order Deleted Successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete orders"
      );
    }
  },
}));
