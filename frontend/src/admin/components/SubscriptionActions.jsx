import { AnimatePresence, motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import CreateSubscriptionModal from "./CreateSubscriptionModal";
import { useState } from "react";

export default function SubscriptionActions({ subscription }) {
  const [modalType, setModalType] = useState(null);
  const handleEdit = () => {
    alert('handle edit')
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-wrap gap-3 items-center"
      >
        {/* ───────── Edit Button ───────── */}
        <ActionButton
          icon={Edit2}
          variant="primary"
          label="Edit"
          onClick={() => setModalType(subscription?.type)}
        />

        {/* ───────── Delete Button ───────── */}
        <ActionButton
          icon={Trash2}
          variant="danger"
          label="Delete"
          onClick={console.log("delete")}
        />
      </motion.div>
      {/* ───────── Modal ───────── */}
      <AnimatePresence>
        {modalType && (
          <CreateSubscriptionModal
            type={subscription?.type}
            onClose={() => setModalType(null)}
            mode="edit"
            onEdit={handleEdit}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────── Reusable Button ───────── */
function ActionButton({ icon: Icon, label, variant, disabled, onClick }) {
  const variants = {
    primary: `
      bg-secondary text-black
      hover:bg-secondary/90
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600
    `,
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        rounded-xl
        text-sm font-medium
        transition
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {Icon && <Icon size={16} />}
      {label}
    </motion.button>
  );
}
