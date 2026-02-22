import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function UserStats({ user }) {
  const stats = [
    {
      label: "Balance",
      value: `$${Number(user?.balance?.$numberDecimal).toFixed(2)}`,
      icon: Wallet,
    },
    {
      label: "Highest Investment",
      value: `$${Number(user?.highestInvestment).toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      label: "Account Status",
      value: user?.accountStatus,
      icon: ShieldCheck,
      highlight:
        user?.accountStatus === "active"
          ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
          : "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Country",
      value: user?.country,
      icon: Globe,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="
              rounded-2xl
              border border-slate-200/60 dark:border-white/10
              bg-white/70 dark:bg-gray-900/50
              backdrop-blur
              p-5
            "
          >
            {/* ───────── Icon ───────── */}
            <div
              className="
                w-10 h-10 rounded-xl
                flex items-center justify-center
                bg-slate-900/5 dark:bg-white/10
                mb-3
              "
            >
              <Icon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </div>

            {/* ───────── Label ───────── */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>

            {/* ───────── Value ───────── */}
            <p
              className={`
                mt-1 text-sm font-semibold truncate
                "text-slate-900 dark:text-slate-100"
              `}
            >
              {stat.value}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
