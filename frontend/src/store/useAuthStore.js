import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isResetingPassword: false,
  isCreatingPassphrase: false,

  // =====================
  // CHECK AUTH
  // =====================
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      // res.data is the decoded token user payload
      set({
        authUser: res.data,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Authentication failed");

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  refreshUser: async () => {
    get().checkAuth();
  },

  register: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Logged in Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message); // how to access errors in axios
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message); // how to access errors in axios
    }
  },

  forgetPassword: async (data) => {
    try {
      await axiosInstance.post("/auth/forget-password", data);
      toast.success("Reset Code Sent to your Email");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message); // how to access errors in axios
      return false;
    }
  },

  resetPassword: async (data) => {
    set({ isResetingPassword: true });
    try {
      await axiosInstance.post("/auth/reset-password", data);
      toast.success("Password Reset Successfully");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message); // how to access errors in axios
      return false;
    } finally {
      set({ isResetingPassword: false });
    }
  },

  createPassphrase: async (data) => {
    set({ isCreatingPassphrase: true });
    try {
      await axiosInstance.post("/users/passphrase", data);
      toast.success("Passphrase Created Successfully");
      await get().checkAuth();
    } catch (error) {
      toast.error(error?.response?.data?.message); // how to access errors in axios
    }finally{
      set({ isCreatingPassphrase: false });
    }
  }

  
}));
