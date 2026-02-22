import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axios";

export const useAdminTransactionStore = create((set, get) => ({
  // =====================
  // STATE
  // =====================
  stats: null,
  transactions: [],
  pendingTransactions: [],
  ordersMeta: null,
  lineData: [],
  barData: [],

  isLoadingTransactions: false,
  isUpdatingStatus: false,
  isLoadingOrdersMeta: false,

  // =====================
  // GET ALL TRANSACTIONS
  // =====================
  getAllTransactions: async (params = {}) => {
    set({ isLoadingTransactions: true });

    try {
      const res = await axiosInstance.get("/admin/transactions", { params });

      const normalized = res.data.transactions.map((tx) => ({
        ...tx,

        // normalize amount
        amount:
          typeof tx.amount === "object"
            ? Number(tx.amount.$numberDecimal)
            : Number(tx.amount),

        // normalize user (avoid crashes)
        user: tx.user ?? {
          name: "Unknown user",
          email: "unknown",
        },
      }));

      set({ transactions: normalized });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch transactions"
      );
    } finally {
      set({ isLoadingTransactions: false });
    }
  },

  getTransactionStats: async () => {
    try {
      const [pendingDeposits, deposits, totalTransactions] = await Promise.all([
        axiosInstance.get("/admin/transactions?type=deposit&status=pending"),
        axiosInstance.get("/admin/transactions?type=deposit"),
        axiosInstance.get("/admin/transactions"),
      ]);

      set({
        stats: {
          totalDeposits: deposits.data.meta.total,
          pendingDeposit: pendingDeposits.data.meta.total,
          total: totalTransactions.data.meta.total,
        },
      });
    } catch (err) {
      console.error(err);
    }
  },

  // =====================
  // GETTING ALL PENDING TRANSACTIONS
  // =====================

  getpendingTransactions: async () => {
    set({ isLoadingTransactions: true });
    try {
      const res = await axiosInstance.get("/admin/transactions?status=pending");
      set({
        pendingTransactions: res.data.transactions,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch transactions"
      );
    } finally {
      set({ isLoadingTransactions: false });
    }
  },

  // =====================
  // UPDATE TRANSACTION STATUS
  // =====================
  updateTransactionStatus: async (transactionId, payload) => {
    set({ isUpdatingStatus: true });

    try {
      await axiosInstance.put(
        `/admin/transactions/${transactionId}/status`,
        payload
      );

      toast.success("Transaction status updated");
      get().getpendingTransactions();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update transaction status"
      );
    } finally {
      set({ isUpdatingStatus: false });
    }
  },

  // =====================
  // GET TOTAL ORDERS META
  // =====================
  getOrdersMeta: async () => {
    set({ isLoadingOrdersMeta: true });

    try {
      const res = await axiosInstance.get("/admin/orders-meta");
      set({ ordersMeta: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch orders meta"
      );
    } finally {
      set({ isLoadingOrdersMeta: false });
    }
  },

  fetchTransactionChart: async () => {
    set({ loading: true });
    const res = await axiosInstance.get(
      "/admin/transactions/chart?type=deposit&days=7"
    );
    set({ lineData: res.data.data, loading: false });
  },

  getBarChartData: async () => {
    try {
      const res = await axiosInstance.get("/admin/transactions-bar");
      set({ barData: res.data.data });
    } catch (e) {
      toast.error("Failed to load bar chart", e);
    }
  },

  // =====================
  // CLEAR STATE
  // =====================
  clearTransactions: () => set({ transactions: [], ordersMeta: null }),
}));
