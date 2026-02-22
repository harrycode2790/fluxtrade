import { motion } from "framer-motion";
import {
  Users,
  Wallet,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Activity,
  CreditCard,
  BarChart2
} from "lucide-react";
import { formatDate } from "../helpers";

export default function SubscriptionInfo({ subscription }) {
 
 
const info = [
  {
    label: "Price",
    value: subscription?.price ?? "—",
    icon: DollarSign,
  },
  {
    label: "Followers",
    value: subscription?.stats?.followers ?? "—",
    icon: Users,
  },
  {
    label: "ROI",
    value: subscription?.stats?.roi
      ? `${subscription.stats.roi}%`
      : "—",
    icon: TrendingUp,
  },
  {
    label: "Win Rate",
    value: subscription?.stats?.winRate
      ? `${subscription.stats.winRate}%`
      : "—",
    icon: Activity,
  },
  {
    label: "Equity",
    value: subscription?.stats?.equity
      ? `${subscription.stats.equity}`
      : "—",
    icon: BarChart2,
  },
  {
    label: "Exchange",
    value: subscription?.meta?.exchange ?? "—",
    icon: CreditCard,
  },
  {
    label: "Created At",
    value: formatDate(subscription?.createdAt),
    icon: Calendar,
  },
  {
    label: "Last Updated",
    value: formatDate(subscription?.updatedAt),
    icon: Clock,
  },
];


  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        lg:col-span-2
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
          Subscription Information
        </h3>
      </div>

      {/* ───────── Info Rows ───────── */}
      <div className="divide-y divide-slate-200/60 dark:divide-white/10">
        {info.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-8 h-8 rounded-lg
                    flex items-center justify-center
                    bg-slate-900/5 dark:bg-white/10
                  "
                >
                  <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
              </div>

              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}


