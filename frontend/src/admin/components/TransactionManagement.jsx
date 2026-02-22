import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import TransactionCard from "../components/TransactionCard";
import { useAdminTransactionStore } from "../store/useAdminTransactionStore ";


/* ───────── Page Component ───────── */
export default function TransactionManagement() {
  const { transactions, getAllTransactions } = useAdminTransactionStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);

  /* ───────── Filtering Logic ───────── */
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesEmail =
        !search || tx.user.email.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || tx.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" || tx.status === statusFilter;

      return matchesEmail && matchesType && matchesStatus;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  console.log(filteredTransactions);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* ───────── Page Header ───────── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Transactions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review, approve, and monitor all platform transactions
        </p>
      </div>

      {/* ───────── Search + Filters ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="
            rounded-2xl
            border border-slate-200/60 dark:border-white/10
            bg-white dark:bg-gray-900
            p-5
            shadow-sm
            space-y-4
          "
      >
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user email"
            className="
                w-full
                pl-9 pr-3 py-2.5
                rounded-xl
                border border-slate-300/60 dark:border-white/10
                bg-white dark:bg-gray-900
                text-sm
                focus:outline-none focus:ring-2 focus:ring-secondary
              "
          />
        </div>

        {/* Filter Buttons (stacked & clean) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Type */}
          <FilterGroup
            label="Type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "All" },
              { value: "deposit", label: "Deposit", icon: ArrowDownCircle },
              { value: "withdrawal", label: "Withdrawal", icon: ArrowUpCircle },
            ]}
          />

          {/* Status */}
          <FilterGroup
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All" },
              { value: "pending", label: "Pending", icon: Clock },
              { value: "approved", label: "Approved", icon: CheckCircle },
              { value: "rejected", label: "Rejected", icon: XCircle },
            ]}
          />
        </div>
      </motion.div>

      {/* ───────── Transactions Grid ───────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.06 },
          },
        }}
        className="
            grid gap-4
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
      >
        {filteredTransactions.map((tx) => (
          <motion.div
            key={tx.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <TransactionCard transaction={tx} />
          </motion.div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-500 py-10">
            No transactions found
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ───────── Reusable Filter Button Group ───────── */
function FilterGroup({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-500 uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value: v, label, icon: Icon }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`
              inline-flex items-center gap-1.5
              px-3 py-1.5
              rounded-xl
              text-xs font-medium
              transition
              ${
                value === v
                  ? "bg-secondary text-black"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
              }
            `}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
