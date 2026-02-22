import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { BotForm, CopyTraderForm, PackageForm } from "./SubscriptionForm";
import { Button } from "@heroui/react";

export default function CreateSubscriptionModal({
  type,
  onClose,
  mode = "create",
  onCreate,
  onEdit,
}) {
  const handleSubmit = () => {
    if (mode === "create") onCreate?.();
    if (mode === "edit") onEdit?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="
          w-full max-w-md
          rounded-2xl
          bg-white dark:bg-gray-900
          p-6
          space-y-4
        "
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold capitalize">
            {mode} {type.replace("-", " ")}
          </h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {type === "bot" && <BotForm />}
        {type === "copy-trader" && <CopyTraderForm />}
        {type === "package" && <PackageForm />}

        <button
          variant="flat"
          className="bg-secondary inline-flex items-center gap-2
        px-4 py-2
        rounded-xl
        text-sm font-medium
        transition
        disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleSubmit}
        >
          {mode}
        </button>
      </motion.div>
    </motion.div>
  );
}

// helpers

export function FilterButton({ value, setValue, type, label, icon: Icon }) {
  const active = value === type;

  return (
    <button
      onClick={() => setValue(type)}
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-xl text-xs font-medium transition
        ${
          active
            ? "bg-secondary text-black"
            : "bg-slate-100 dark:bg-white/5 text-slate-600 hover:bg-slate-200 dark:hover:bg-white/10"
        }
      `}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

export function ActionCard({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        flex items-center gap-3
        px-4 py-3
        rounded-2xl
        border border-slate-200/60 dark:border-white/10
        bg-white dark:bg-gray-900
        hover:bg-slate-50 dark:hover:bg-white/5
        transition
      "
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
      <Plus size={16} className="ml-auto text-slate-400" />
    </button>
  );
}
