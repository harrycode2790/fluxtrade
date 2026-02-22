import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useTransactionStore = create((set, get) => ({
  paymentMethods: [],
  userDepositsHistory: [],
  isDepositing: false,

  getPaymentMethods: async () => {
    try {
      const res = await axiosInstance.get("/transactions/methods");
      set({ paymentMethods: res.data.methods });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  validatePassphrase: async (passphrase) => {
    try {
      const res = await axiosInstance.post(
        "/transactions/validate-passphrase",
        passphrase
      );
      await useAuthStore.getState().refreshUser();
      toast.success("Passphrase validated");
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  fetchDepositAddress: async (methodId) => {
    try {
      const res = await axiosInstance.get(
        `/transactions/methods/${methodId}/address`
      );
      return res.data?.method?.address;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  depositsHistory: async () => {
    try {
      const res = await axiosInstance.get("/transactions/");
      set({ userDepositsHistory: res.data.deposits });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  createDeposit: async (depositData) => {
    set({ isDepositing: true });
    try {
      const res = await axiosInstance.post(
        "/transactions/deposit",
        depositData
      );

      const newDeposit = res.data;

      // Optimistically update history
      set((state) => ({
        userDepositsHistory: [newDeposit, ...state.userDepositsHistory],
      }));

      toast.success("Deposit created successfully");
      return newDeposit; //  allow modal to react
    } catch (error) {
      const msg = error?.response?.data?.message || "Deposit failed";
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ isDepositing: false });
    }
  },
}));
