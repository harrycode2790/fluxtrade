import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Briefcase, Trash2, X } from "lucide-react";
import { useAdminUserStore } from "../store/useAdminUserStore";
import { useState } from "react";

export default function UserActions({ user }) {
  const { updateVerificationStatus } = useAdminUserStore();

  const [open, setOpen] = useState(false);

  const isVerified = user?.verificationStatus;
  const isAdmin = user?.role === "admin";
  const userId = user?._id;

  const handleApprove = async () => {
    await updateVerificationStatus(userId, {
      status: "approved",
    });
    setOpen(false);
  };

  const handleReject = async () => {
    await updateVerificationStatus(userId, {
      status: "rejected",
    });
    setOpen(false);
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="
        flex flex-wrap gap-3
        items-center
      "
      >
        {/* ───────── Verify User ───────── */}
        <ActionButton
          onClick={() => setOpen(true)}
          disabled={isVerified}
          icon={ShieldCheck}
          variant="primary"
          label={isVerified ? "User Verified" : "Verify User"}
        />

        {/* ───────── View Portfolio ───────── */}
        <ActionButton
          icon={Briefcase}
          variant="secondary"
          label="View Portfolio"
        />

        {/* ───────── Delete User ───────── */}
        <ActionButton
          disabled={isAdmin}
          icon={Trash2}
          variant="danger"
          label="Delete User"
        />
      </motion.div>

      {/* ───────── Verification Modal ───────── */}
      <AnimatePresence>
        {open && (
          <VerificationModal
            onApprove={handleApprove}
            onReject={handleReject}
            onClose={() => setOpen(false)}
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
    secondary: `
      bg-indigo-500 text-white
      hover:bg-indigo-600
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600
    `,
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      disabled={disabled}
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

function VerificationModal({ onApprove, onReject, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm"
      >
        <h3 className="text-lg font-semibold mb-2">Verify User Account</h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Are you sure you want to approve or reject this user’s verification?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 py-2 rounded-xl bg-green-500 text-white font-medium"
          >
            Approve
          </button>

          <button
            onClick={onReject}
            className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium"
          >
            Reject
          </button>
        </div>

        <button onClick={onClose} className="mt-8 w-full">
          <X size={22} className="mx-auto text-slate-500 hover:opacity-70" />
        </button>
      </motion.div>
    </motion.div>
  );
}
