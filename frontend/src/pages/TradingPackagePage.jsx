/** @format */

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import BottomNavbar from "../components/BottomNavbar";
import { useSubscriptionStore } from "../store/useSubscriptionStore";

const normalizePackageName = (name = "") => {
  const n = name.toLowerCase();

  if (n.includes("basic")) return "basic";
  if (n.includes("pro")) return "pro";
  if (n.includes("vip")) return "vip";

  return null;
};

const PACKAGE_RANK = {
  basic: 1,
  pro: 2,
  vip: 3,
};

export default function TradingPackagePage() {
  const {
    tradingPackage,
    getTradingPackage,
    userSubscriptions,
    getUserSubscriptions,
    buySubscription,
    isbuyingSubscription,
  } = useSubscriptionStore();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getTradingPackage();
    getUserSubscriptions();
  }, [getTradingPackage, getUserSubscriptions]);

  const subscribedTradingPackagesIds = useMemo(() => {
    return new Set((userSubscriptions?.packages || []).map((b) => b._id));
  }, [userSubscriptions]);

  const isSubscribed = (pkgId) => {
    return subscribedTradingPackagesIds.has(pkgId);
  };

  const highestSubscribedRank = useMemo(() => {
    if (!userSubscriptions?.packages?.length) return 0;

    return Math.max(
      ...userSubscriptions.packages.map((p) => {
        const tier = normalizePackageName(p.name);
        return PACKAGE_RANK[tier] || 0;
      })
    );
  }, [userSubscriptions]);

  console.log(highestSubscribedRank);
  const getPackageState = (pkg) => {
  const tier = normalizePackageName(pkg.name);
  const pkgRank = PACKAGE_RANK[tier] || 0;

  // already subscribed
  if (isSubscribed(pkg._id)) {
    return { disabled: true, label: "Subscribed" };
  }

  // VIP blocks everything else
  if (highestSubscribedRank === PACKAGE_RANK.vip) {
    return { disabled: true, label: "VIP active" };
  }

  // user has higher package → lower disabled
  if (highestSubscribedRank > pkgRank) {
    return { disabled: true, label: "Get lower package" };
  }

  // upgrade path
  if (highestSubscribedRank < pkgRank && highestSubscribedRank > 0) {
    return { disabled: false, label: "Upgrade Package" };
  }

  // no subscription
  return { disabled: false, label: "Choose Package" };
};


  async function confirmPurchase() {
    try {
      await buySubscription({
        subscriptionId: selected._id,
      });
      setSelected(null);
    } catch (err) {
      console.error("onInvest callback error", err);
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen md:flex  text-black dark:text-white">
      <Sidebar />

      <main className="flex-1 px-4 md:px-8 py-6 max-w-6xl mx-auto mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Trading Packages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a package that fits your trading goals.
          </p>
        </div>

        {/* Packages Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {tradingPackage?.map((pkg) => (
            <motion.div
              key={pkg._id}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}
              className="p-6 rounded-2xl bg-white dark:bg-primary border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold mb-2">{pkg.name}</h2>
              <div className="text-3xl font-semibold mb-4">
                ${pkg.price}
                <span className="text-sm text-gray-500"> /month</span>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-secondary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {(() => {
                const { disabled, label } = getPackageState(pkg);

                return (
                  <button
                    disabled={disabled}
                    onClick={() => !disabled && setSelected(pkg)}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      disabled
                        ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700"
                        : "bg-secondary text-black hover:scale-[1.02]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })()}
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 grid place-items-center px-5"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) setSelected(null);
              }}
            >
              <div className="absolute inset-0 bg-black/50" />

              <motion.div
                initial={{ y: 20, scale: 0.97 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.97, opacity: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 22 }}
                className="relative w-full max-w-md bg-white dark:bg-primary p-6 rounded-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg bg-lightbg dark:bg-tertiary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                  You are about to subscribe to the{" "}
                  <span className="font-semibold">{selected.name}</span> plan.
                </p>

                <div className="text-3xl font-bold mb-6">${selected.price}</div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-lg bg-lightbg dark:bg-tertiary"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={isbuyingSubscription}
                    onClick={() => {
                      confirmPurchase();
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      isbuyingSubscription ? "opacity-50" : "opacity-100"
                    } bg-secondary text-black font-semibold`}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-24" />
      </main>

      <BottomNavbar />
    </div>
  );
}
