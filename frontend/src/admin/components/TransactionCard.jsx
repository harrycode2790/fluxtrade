import { motion } from "framer-motion";
import TransactionStatusBadge from "./TransactionStatusBadge";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useAdminTransactionStore } from "../store/useAdminTransactionStore ";

export default function TransactionCard({ transaction }) {
  const { updateTransactionStatus, isUpdatingStatus } =
    useAdminTransactionStore();
  const isDeposit = transaction?.type === "deposit";

  //  handlers
  const handleApproveTransaction = () => {
    updateTransactionStatus(transaction.id, {
      status: "approved",
    });
  };

  const handleRejectTransaction = () => {
    updateTransactionStatus(transaction.id, {
      status: "rejected",
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.98 }}
      className="
        bg-white dark:bg-gray-800
        border border-slate-200/50 dark:border-white/10
        rounded-2xl
        p-5
        flex flex-col justify-between
        transition-all
        cursor-pointer
      "
    >
      {/* Top: Type + Amount + User */}
      <div className="space-y-3">
        {/* Type + Amount */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDeposit ? (
              <ArrowDownCircle className="w-5 h-5 text-green-500" />
            ) : (
              <ArrowUpCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
              {transaction?.type}
            </span>
          </div>

          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
            $
            {transaction?.amount?.$numberDecimal?.toLocaleString() ||
              transaction?.amount}
          </span>
        </div>

        {/* User Info */}
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {transaction?.user?.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {transaction?.user?.email}
          </p>
        </div>

        {/* Status Badge */}
        <TransactionStatusBadge status={transaction?.status} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={isUpdatingStatus}
          onClick={handleApproveTransaction}
          className="
            flex-1
            py-2
            text-xs sm:text-sm
            font-medium
            rounded-xl
            bg-secondary
            text-white
            transition
          "
        >
          Approve
        </button>
        <button
          disabled={isUpdatingStatus}
          onClick={handleRejectTransaction}
          className="
            flex-1
            py-2
            text-xs sm:text-sm
            font-medium
            rounded-xl
            bg-red-500
            text-white
            hover:bg-red-600
            transition
          "
        >
          Reject
        </button>
      </div>
    </motion.div>
  );
}
