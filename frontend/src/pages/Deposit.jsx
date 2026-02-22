/** DepositPageModernV2.jsx **/
import { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DepositModal from "../components/DepositModal"; // unchanged (uses props)
import QRDepositModal from "../components/QRDepositModal"; // unchanged (expects amount prop)
import Sidebar from "../components/Sidebar";
import BottomNavbar from "../components/BottomNavbar";

import { useTransactionStore } from "../store/useTransactionStore";

export default function DepositPageModernV2() {
  const {
    getPaymentMethods,
    paymentMethods,
    depositsHistory,
    userDepositsHistory,
  } = useTransactionStore();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modal, setModal] = useState(null); // null | 'deposit' | 'qr'

  // NEW: amount state lifted to page so DepositModal and QR modal can share
  const [amount, setAmount] = useState(""); // keep as string to allow blank input; convert when needed

  // transaction table state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const mapTransactionToUI = (tx) => ({
    id: tx.id,
    ref: `TX-${tx.id.slice(-6).toUpperCase()}`, // stable ref
    method: tx.method,
    amount:
      typeof tx.amount === "object" ? tx.amount.$numberDecimal : tx.amount,
    status: tx.status === "approved" ? "completed" : tx.status,
    date: tx.date,
  });

  useEffect(() => {
    getPaymentMethods();
    depositsHistory();
  }, [getPaymentMethods, depositsHistory]);

  const depositMethods = useMemo(() => {
    if (!paymentMethods || !Array.isArray(paymentMethods)) return [];

    return paymentMethods.map((m) => ({
      _id: m._id,
      name: m.name,
      network: m.network, // BTC, TRC20, ERC20
      icon: m.icon,
      desc: `Send only ${m.network}`, // UI text
      raw: m, // keep full object if needed later
    }));
  }, [paymentMethods]);

  const history = useMemo(() => {
    if (!userDepositsHistory || !userDepositsHistory.length) return [];
    return userDepositsHistory.map(mapTransactionToUI);
  }, [userDepositsHistory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((r) => {
      if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter)
        return false;
      if (!q) return true;
      return [r.ref, r.method, r.date, r.amount].some((v) =>
        String(v).toLowerCase().includes(q)
      );
    });
  }, [history, query, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onSelectMethod = useCallback((m) => {
    setSelectedMethod(m);
    // reset amount when opening a new method if you prefer
    setAmount("");
    setModal("deposit");
  }, []);

  return (
    <div className="md:flex">
      <Sidebar />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="flex-1 p-4 md:px-10 dark:text-white text-black min-h-screen pt-[100px] pb-20 md:pb-0"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Deposit</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Choose a method to top up. Amounts are entered in the next step.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-gray-400">Recent activity</span>
              <span className="font-medium">{history.length} transactions</span>
            </div>
          </div>
        </div>

        {/* Grid of methods (no amount input under cards) */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {depositMethods.map((m, i) => (
            <motion.button
              key={m._id}
              layout
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelectMethod(m)}
              className="group flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={m.icon}
                  alt={m.name}
                  className="w-12 h-12 object-contain rounded-md"
                />
                <div>
                  <div className="font-semibold text-lg text-pr ">
                    {m.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    Network: {m.network}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-400">Click to continue</div>
                <div className="text-gray-300 group-hover:text-pr bg-primary">
                  ›
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Transaction Cards */}
        <div className="bg-transparent rounded-2xl">
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3 w-full md:w-1/2">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search transactions..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent focus:ring-2 focus:ring-secondary"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-primary"
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filtered.length}</span>{" "}
              results
            </div>
          </div>

          {/* Card List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginated.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -4, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-primary p-4 flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-400">
                    {tx.ref}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tx.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : tx.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>

                {/* Body */}
                <div>
                  <div className="text-sm text-gray-500">Method</div>
                  <div className="font-semibold">{tx.method}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-semibold text-lg">${tx.amount}</div>
                </div>

                {/* Footer */}
                <div className="text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-2">
                  {tx.date}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="text-gray-500">
              Page {page} of {pages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg border border-secondary"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-3 py-1 rounded-lg border border-secondary"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence mode="wait">
          {modal === "deposit" && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DepositModal
                method={selectedMethod}
                amount={amount}
                setAmount={setAmount}
                onClose={() => setModal(null)}
                onConfirm={() => setModal("qr")}
              />
            </motion.div>
          )}

          {modal === "qr" && (
            <motion.div
              key="qr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QRDepositModal
                method={selectedMethod}
                amount={amount}
                onBack={() => setModal("deposit")}
                onClose={() => setModal(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <BottomNavbar />
    </div>
  );
}
