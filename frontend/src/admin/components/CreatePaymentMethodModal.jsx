import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

/* ───────── Reusable Input ───────── */
function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-500">{label}</label>
      <input
        {...props}
        className="
          w-full px-3 py-2 rounded-xl
          bg-slate-100 dark:bg-white/5
          border border-transparent
          focus:border-secondary focus:outline-none
          text-sm
        "
      />
    </div>
  );
}

/* ───────── Modal ───────── */
export default function CreatePaymentMethodModal({
  onClose,
  mode = "create", // "create" | "edit"
  method = null,
  onSubmit,
}) {
  const [form, setForm] = useState({
    name: "",
    icon: "",
    address: "",
    network: "",
    description: "",
    isActive: true,
  });

  /* ───────── Prefill on Edit ───────── */
  useEffect(() => {
    if (mode === "edit" && method) {
      setForm({
        name: method.name ?? "",
        icon: method.icon ?? "",
        address: method.address ?? "",
        network: method.network ?? "",
        description: method.description ?? "",
        isActive: method.isActive ?? true,
      });
    }
  }, [mode, method]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      _id: method?._id, // useful for edit
    });
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
          space-y-5
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold capitalize">
            {mode === "create" ? "Create" : "Edit"} Payment Method
          </h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Name"
            name="name"
            placeholder="Bitcoin"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Icon URL"
            name="icon"
            placeholder="https://cryptoicons.org/api/icon/btc/200"
            value={form.icon}
            onChange={handleChange}
          />

          <Input
            label="Wallet Address"
            name="address"
            placeholder="bc1qxy2k..."
            value={form.address}
            onChange={handleChange}
          />

          <Input
            label="Network"
            name="network"
            placeholder="BTC / ERC20 / TRC20"
            value={form.network}
            onChange={handleChange}
          />

          <Input
            label="Description (optional)"
            name="description"
            placeholder="Used for BTC deposits"
            value={form.description}
            onChange={handleChange}
          />

          {/* Active Toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active payment method
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl text-sm
              bg-slate-200 dark:bg-white/10
              hover:bg-slate-300 dark:hover:bg-white/20
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              px-4 py-2 rounded-xl text-sm font-medium
              bg-secondary text-black
              hover:bg-secondary/90
            "
          >
            {mode === "create" ? "Create" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
