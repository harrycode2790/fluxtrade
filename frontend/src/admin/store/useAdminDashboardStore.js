import { create } from "zustand";
import { useAdminUserStore } from "./useAdminUserStore";
import { useAdminTransactionStore } from "./useAdminTransactionStore ";
import { useAdminSubscriptionStore } from "./useAdminSubscriptionStore";

export const useAdminDashboardStore = create((set) => ({
  loading: false,
  error: null,

  initDashboard: async () => {
    try {
      set({ loading: true });

      await Promise.all([
        useAdminUserStore.getState().fetchUsers(),
        useAdminUserStore.getState().fetchActiveUsers(),
        useAdminTransactionStore.getState().getTransactionStats(),
        useAdminTransactionStore.getState().getOrdersMeta(),
        useAdminTransactionStore.getState().fetchTransactionChart(),
        useAdminTransactionStore.getState().getBarChartData(),
        useAdminSubscriptionStore.getState().getAllSubscriptions(),
      ]);

      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
