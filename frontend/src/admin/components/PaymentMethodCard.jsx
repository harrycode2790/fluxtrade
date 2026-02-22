import { motion } from "framer-motion";
import { Trash2, Edit3, Clock } from "lucide-react";
import { formatDate } from "../helpers";


export default function PaymentMethodCard({ method, onEdit, onDelete }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="
        relative overflow-hidden
        rounded-2xl
        border border-slate-200/60 dark:border-white/10
        bg-white dark:bg-gray-900
        shadow-sm
      "
    >
      {/* Left status strip */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 ${
          method.isActive ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />

      <div className="p-5 pl-6 space-y-4">
        {/* Top row */}
        <div className="flex items-start gap-3">
          <img
            src={method.icon}
            alt={method.name}
            className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-white/5"
          />

          <div className="flex-1">
            <p className="font-semibold leading-tight">{method.name}</p>
            <p className="text-xs text-slate-500">
              Network: {method.network}
            </p>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              method.isActive
                ? "bg-emerald-500/15 text-secondary"
                : "bg-slate-400/15 text-slate-500"
            }`}
          >
            {method.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Address block */}
        <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-3">
          <p className="text-[11px] uppercase text-slate-400 mb-1">
            Wallet Address
          </p>
          <p className="text-xs break-all text-slate-600 dark:text-slate-300">
            {method.address}
          </p>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>Created: {formatDate(method.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>Updated: {formatDate(method.updatedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-white/10">
          <button
            onClick={() => onEdit(method)}
            className="
              inline-flex items-center gap-1.5
              px-3 py-1.5
              text-xs font-medium
              rounded-lg
              border border-indigo-500/30
              text-indigo-600
              hover:bg-indigo-500/10
            "
          >
            <Edit3 size={14} />
            Edit
          </button>

          <button
            onClick={() => onDelete(method._id)}
            className="
              inline-flex items-center gap-1.5
              px-3 py-1.5
              text-xs font-medium
              rounded-lg
              border border-red-500/30
              text-red-600
              hover:bg-red-500/10
            "
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
