import { motion } from "framer-motion";
import { Package, Bot, Users } from "lucide-react";
import { Link } from "react-router-dom";

const icons = {
  package: Package,
  bot: Bot,
  "copy-trader": Users,
};

export default function SubscriptionCard({ subscription }) {
  const Icon = icons[subscription.type];

  return (
    <Link to={`/admin/subscription/${subscription._id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="
        rounded-2xl
        border border-slate-200/60 dark:border-white/10
        bg-white dark:bg-gray-900
        p-5
        shadow-sm
        space-y-3
      "
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Icon size={18} className="text-secondary" />
          </div>
          <div>
            <p className="font-medium">{subscription.name}</p>
            <p className="text-xs text-slate-500 capitalize">
              {subscription.type}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className="text-xl font-semibold">${subscription.price}</span>
          <button className="text-xs text-secondary hover:underline">
            Manage
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
