import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

const CRYPTO_TTL = 60 * 1000; // 1 min
const STOCK_TTL = 3 * 60 * 1000; // 3 min

export const useAssetsStore = create(
  persist(
    (set, get) => ({
      // ---------------- STATE ----------------
      isGettingCrptoAssets: false,
      cryptoAssets: [],
      lastCryptoFetch: null,

      isGettingStocksAssets: false,
      stockAssets: [],
      lastStocksFetch: null,

      assetDetails: null,

      // ---------------- CRYPTO ----------------
      getCrptoAssets: async (force = false) => {
        const { cryptoAssets, lastCryptoFetch } = get();

        if (
          !force &&
          cryptoAssets.length &&
          lastCryptoFetch &&
          Date.now() - lastCryptoFetch < CRYPTO_TTL
        ) {
          return; // ✅ cache hit (memory or localStorage)
        }

        set({ isGettingCrptoAssets: true });

        try {
          const res = await axiosInstance.get("/assets/crypto");

          set({
            cryptoAssets: res.data.data,
            lastCryptoFetch: Date.now(),
          });
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Failed to fetch crypto"
          );
        } finally {
          set({ isGettingCrptoAssets: false });
        }
      },

      // ---------------- STOCKS ----------------
      getStocksAssets: async (force = false) => {
        const { stockAssets, lastStocksFetch } = get();

        if (
          !force &&
          stockAssets.length &&
          lastStocksFetch &&
          Date.now() - lastStocksFetch < STOCK_TTL
        ) {
          return; // ✅ cache hit
        }

        set({ isGettingStocksAssets: true });

        try {
          const res = await axiosInstance.get("/assets/stocks");

          set({
            stockAssets: res.data.data,
            lastStocksFetch: Date.now(),
          });
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Failed to fetch stocks"
          );
        } finally {
          set({ isGettingStocksAssets: false });
        }
      },

      // ---------------- SINGLE ASSET ----------------
      getAssetById: async (assetId) => {
        try {
          const res = await axiosInstance.get(`/assets/${assetId}`);
          set({ assetDetails: res.data.data });
          return res.data.data;
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Failed to fetch asset"
          );
          return null;
        }
      },
    }),
    {
      name: "market-assets-cache", // localStorage key

      // Only persist cache data (not loading flags)
      partialize: (state) => ({
        cryptoAssets: state.cryptoAssets,
        stockAssets: state.stockAssets,
        lastCryptoFetch: state.lastCryptoFetch,
        lastStocksFetch: state.lastStocksFetch,
      }),
    }
  )
);
