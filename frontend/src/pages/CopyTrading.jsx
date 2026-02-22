import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import BottomNavbar from "../components/BottomNavbar";
import { useSubscriptionStore } from "../store/useSubscriptionStore";
import { useEffect } from "react";

function formatNumber(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return `${n}`;
}

export default function CopyTradingPage() {
  const {
    copyTrader,
    getCopyTrader,
    userSubscriptions,
    getUserSubscriptions,
    buySubscription,
    isBuyingSubscription,
  } = useSubscriptionStore();
  const [tab, setTab] = useState("leaders"); // leaders | explore | following
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // selected trader for modal
  const [investOpen, setInvestOpen] = useState(false);

  useEffect(() => {
    getCopyTrader();
    getUserSubscriptions();
  }, [getCopyTrader, getUserSubscriptions]);

  const subscribedCopyTraderIds = useMemo(() => {
    return new Set((userSubscriptions?.copyTraders || []).map((b) => b._id));
  }, [userSubscriptions]);

  const traders = useMemo(() => {
    if (!copyTrader || !Array.isArray(copyTrader)) return [];

    return copyTrader.map((trader) => ({
      id: trader._id,
      name: trader.name,
      handle: trader.handle,
      price: trader.price, // FIXED price
      followers: trader.stats?.followers ?? 0,
      roi: trader.stats?.roi ?? 0,
      winRate: trader.stats?.winRate ?? 0,
      equity: trader.stats?.equity ?? 0,
      meta: trader.meta,
      description: trader.description,
      isSubscribed: subscribedCopyTraderIds.has(trader._id),
    }));
  }, [copyTrader, subscribedCopyTraderIds]);

  const filtered = useMemo(() => {
    let out = [...traders];
    if (tab === "leaders") out.sort((a, b) => b.followers - a.followers);
    if (tab === "explore") out.sort((a, b) => b.roi - a.roi);
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.handle.toLowerCase().includes(q)
      );
    }
    return out;
  }, [traders, tab, query]);

  function openInvest(trader) {
    setSelected(trader);
    setInvestOpen(true);
  }

  async function confirmInvest() {
    try {
      await buySubscription({
        subscriptionId: selected.id,
      });
      setInvestOpen(false);
      setSelected(null);
    } catch (err) {
      console.error("onInvest callback error", err);
    }
  }

  

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen md:flex  text-black dark:text-white">
      <Sidebar />

      <main className="flex-1 px-4 md:px-8 py-6 max-w-6xl mx-auto mt-20 md:mt-30">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold">Copy Traders</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {" "}
              copy automatically
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search traders..."
                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-tertiary text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTab("leaders")}
                className={`px-3 py-2 rounded-lg text-sm ${
                  tab === "leaders"
                    ? "bg-secondary text-black"
                    : "bg-transparent"
                }`}
              >
                Leaders
              </button>
              <button
                onClick={() => setTab("explore")}
                className={`px-3 py-2 rounded-lg text-sm ${
                  tab === "explore"
                    ? "bg-secondary text-black"
                    : "bg-transparent"
                }`}
              >
                Explore
              </button>
            </div>
          </div>
        </div>

        {/* Traders list */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((t) => (
            <motion.article
              key={t.id}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}
              className="rounded-2xl bg-white dark:bg-primary p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-tertiary flex items-center justify-center font-semibold text-lg">
                    {t.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold truncate">{t.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {t.handle}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Strategy • ROI {t.roi}%
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      t.roi >= 0 ? "text-secbg-secondary" : "text-red-500"
                    }`}
                  >
                    {t.roi}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatNumber(t.followers)} followers
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="text-sm text-gray-600">
                  Win: <span className="font-semibold">{t.winRate}%</span>
                </div>
                <div className="text-sm text-gray-600">
                  Equity:{" "}
                  <span className="font-semibold">
                    ${formatNumber(t.equity)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  disabled={t.isSubscribed || isBuyingSubscription}
                  onClick={() => openInvest(t)}
                  className={`flex-none px-3 py-2 rounded-lg bg-linear-to-tr from-secondary ${
                    t.isSubscribed ? "opacity-50" : "opacity-100"
                  } text-white text-sm flex items-center gap-2`}
                >
                  <Plus className="w-4 h-4" />
                  {t.isSubscribed ? "Subscribed" : "Copy "}
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Invest modal (simple, minimal) */}
        <AnimatePresence>
          {investOpen && selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 grid place-items-center px-3"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) {
                  setInvestOpen(false);
                  setSelected(null);
                }
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <motion.div
                initial={{ y: 12, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 12, scale: 0.98, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative w-full max-w-md rounded-2xl bg-white dark:bg-primary p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{selected.name}</div>
                    <div className="text-xs text-gray-400">
                      {selected.handle}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setInvestOpen(false);
                      setSelected(null);
                    }}
                    className="p-2 rounded-lg dark:bg-primary bg-lightbg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 text-sm">
                  Price:
                  <span className="font-semibold ml-2">${selected.price}</span>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setInvestOpen(false);
                      setSelected(null);
                    }}
                    className="px-4 py-2 rounded-lg dark:bg-primary bg-lightbg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmInvest}
                    className="px-4 py-2 rounded-lg bg-secondary text-black font-semibold"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-28" />
      </main>

      <BottomNavbar />
    </div>
  );
}
