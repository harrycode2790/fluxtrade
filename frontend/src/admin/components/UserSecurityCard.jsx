import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, KeyRound } from "lucide-react";

export default function UserSecurityCard({ user }) {
  const securityItems = [
    {
      label: "Email Verification",
      enabled: user?.verificationStatus,
      icon: ShieldCheck,
      activeText: "Verified",
      inactiveText: "Unverified",
    },
    {
      label: "KYC Status",
      enabled: user?.kycStatus !== "none",
      icon: FileCheck,
      activeText: "Completed",
      inactiveText: "Not Submitted",
    },
    {
      label: "Transaction Passphrase",
      enabled: user?.hasTransactionPassphrase,
      icon: KeyRound,
      activeText: "Enabled",
      inactiveText: "Disabled",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        rounded-2xl
        border border-slate-200/60 dark:border-white/10
        bg-white/70 dark:bg-gray-900/50
        backdrop-blur
        p-6
      "
    >
      {/* ───────── Header ───────── */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Security & Status
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Verification & protection settings
        </p>
      </div>

      {/* ───────── Items ───────── */}
      <div className="space-y-4">
        {securityItems.map((item) => (
          <SecurityRow key={item.label} {...item} />
        ))}
      </div>
    </motion.section>
  );
}

/* ───────── Row Component ───────── */
function SecurityRow({ label, enabled, icon: Icon, activeText, inactiveText }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="
        flex items-center justify-between
        rounded-xl
        px-4 py-3
        bg-slate-900/5 dark:bg-white/5
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center
            ${
              enabled
                ? "bg-emerald-500/15 text-secondary"
                : "bg-slate-400/15 text-slate-500"
            }
          `}
        >
          <Icon size={18} />
        </div>

        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {label}
        </span>
      </div>

      {/* Right */}
      <span
        className={`
          text-xs font-semibold px-3 py-1 rounded-full
          ${
            enabled
              ? "bg-emerald-500/15 text-secondary"
              : "bg-slate-400/15 text-slate-500"
          }
        `}
      >
        {enabled ? activeText : inactiveText}
      </span>
    </motion.div>
  );
}
