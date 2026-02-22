import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SubscriptionFeatures({ subscription }) {
  //  No features → render nothing
  if (!subscription?.features || subscription.features.length === 0) {
    return null;
  }

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
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Features
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Included in this subscription
        </p>
      </div>

      {/* ───────── Features ───────── */}
      <div className="flex flex-wrap gap-2">
        {subscription.features.map((feature) => (
          <motion.span
            key={feature}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="
              inline-flex items-center gap-1.5
              text-xs font-medium
              px-3 py-1 rounded-full
              bg-emerald-500/15 text-secondary
            "
          >
            <CheckCircle2 size={12} />
            {feature}
          </motion.span>
        ))}
      </div>
    </motion.section>
  );
}
