import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axios";

export const useAdminUserStore = create((set,get) => ({
  // =====================
  // STATE
  // =====================
  users: [],
  meta: null,
  activeUsers: null,
  pendingVerificationUsers: [],

  singleUser: null,
  userPortfolio: null,

  isLoadingUsers: false,
  isLoadingUser: false,
  isLoadingPortfolio: false,

  // =====================
  // FETCH USERS (LIST)
  // =====================
  fetchUsers: async () => {
    set({ isLoadingUsers: true });

    try {
      const res = await axiosInstance.get("/admin/users");
      set({
        users: res.data.users,
        meta: res.data.meta,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  // =====================
  // FETCH VERIFICATION USERS (LIST)
  // =====================

  fetchVerificationUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get("/admin/users?verificationStatus=false");
      set({
        pendingVerificationUsers: res.data.users,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  // =====================
  // FETCH ACTIVE USERS (COUNT)
  // =====================
  fetchActiveUsers: async () => {
    try {
      const res = await axiosInstance.get("/admin/active-users");
      set({ activeUsers: res.data.total });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch active users"
      );
    }
  },

  // =====================
  // GET SINGLE USER
  // =====================
  getSingleUser: async (userId) => {
    set({ isLoadingUser: true });
    try {
      const res = await axiosInstance.get(`/admin/users/${userId}`);
      set({ singleUser: res.data.user });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user");
    } finally {
      set({ isLoadingUser: false });
    }
  },

  // =====================
  // SOFT DELETE USER
  // =====================
  softDeleteUser: async (userId) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  },

  // =====================
  // UPDATE VERIFICATION STATUS
  // =====================
  updateVerificationStatus: async (userId, payload) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/verification`, payload);
      toast.success("Verification status updated");
      await get().getSingleUser(userId)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update verification"
      );
    }
  },

  // =====================
  // GET USER PORTFOLIO
  // =====================
  getUserPortfolio: async (userId) => {
    set({ isLoadingPortfolio: true });
    try {
      const res = await axiosInstance.get(`/admin/users/${userId}/portfolio`);
      set({ userPortfolio: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch portfolio"
      );
    } finally {
      set({ isLoadingPortfolio: false });
    }
  },

  // =====================
  // CLEAR STATE
  // =====================
  clearSingleUser: () => set({ singleUser: null, userPortfolio: null }),
}));
