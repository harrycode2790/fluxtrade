import { motion } from "framer-motion";
import TransactionCard from "./TransactionCard";
import { ChevronRight } from "lucide-react";
import { useAdminTransactionStore } from "../store/useAdminTransactionStore ";
import { useEffect } from "react";

export default function TransactionPreviewSection({
  title = "Transactions",
  limit = 4,
  queryString = "",
  showMorePath = "/admin/transactions",
}) {
  const { getpendingTransactions, pendingTransactions } =
    useAdminTransactionStore();
  useEffect(() => { 
    getpendingTransactions();
  }, [getpendingTransactions]);

  const transactionsToShow = pendingTransactions.slice(0, limit);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        bg-white dark:bg-gray-900
        border border-slate-200/50 dark:border-white/10
        rounded-2xl
        px-6 py-5
        shadow-sm
      "
    >
      {/* ───────── Header ───────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Latest platform transactions
          </p>
        </div>

        <a
          href={`${showMorePath}${queryString}`}
          className="
            inline-flex items-center gap-1
            text-sm font-medium
            text-secondary
            hover:underline
          "
        >
          View all
          <ChevronRight size={16} />
        </a>
      </div>

      {/* ───────── Transaction Cards Grid ───────── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {transactionsToShow.map((tx) => (
          <TransactionCard key={tx.id} transaction={tx} />
        ))}
      </div>
    </motion.section>
  );
}
