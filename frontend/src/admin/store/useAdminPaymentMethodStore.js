import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axios";

export const useAdminPaymentMethodStore = create((set) => ({
  // =====================
  // STATE
  // =====================
  paymentMethods: [],
  isLoading: false,
  isSubmitting: false,

  // =====================
  // GET PAYMENT METHODS
  // =====================
  getPaymentMethods: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/payment-methods");
      set({ paymentMethods: res.data.paymentMethods });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch payment methods"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // =====================
  // CREATE PAYMENT METHOD
  // =====================
  createPaymentMethod: async (payload) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post(
        "/admin/payment-methods/create",
        payload
      );
      toast.success("Payment method created");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create payment method"
      );
    } finally {
      set({ isSubmitting: false });
    }
  },

  // =====================
  // UPDATE PAYMENT METHOD
  // =====================
  updatePaymentMethod: async (id, payload) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.put(
        `/admin/payment-methods/update/${id}`,
        payload
      );
      toast.success("Payment method updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update payment method"
      );
    } finally {
      set({ isSubmitting: false });
    }
  },

  // =====================
  // DELETE PAYMENT METHOD
  // =====================
  deletePaymentMethod: async (id) => {
    try {
      await axiosInstance.delete(
        `/admin/payment-methods/delete/${id}`
      );
      toast.success("Payment method deleted");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete payment method"
      );
    }
  },

  // =====================
  // CLEAR STATE
  // =====================
  clearPaymentMethods: () => set({ paymentMethods: [] }),
}));
