import StatsCard from "./StatsCard";
import { Users, UserCheck, Clock, TrendingUp, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminUserStore } from "../store/useAdminUserStore";
import { useEffect } from "react";
import { useAdminTransactionStore } from "../store/useAdminTransactionStore ";
import { useAdminDashboardStore } from "../store/useAdminDashboardStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export default function StatsGrid() {
  const { meta, activeUsers } = useAdminUserStore();
  const { stats, ordersMeta } = useAdminTransactionStore();
  const { initDashboard } = useAdminDashboardStore();

  useEffect(() => {
    initDashboard();
  }, [initDashboard]);

  const totalOrders =
    (ordersMeta?.totalStockOrders || 0) + (ordersMeta?.totalCryptoOrders || 0);

  const dashboardStats = [
    { title: "Total Users", value: meta?.total || "0", icon: Users },
    {
      title: "Active Users",
      value: activeUsers ? activeUsers : "0",
      icon: UserCheck,
    },
    {
      title: "Pending Deposit",
      value: stats?.pendingDeposit || "0",
      icon: Clock,
    },
    { title: "Total Trading Orders", value: totalOrders, icon: TrendingUp },
    { title: "Total Transactions", value: stats?.total || "0", icon: Wallet },
  ];
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-5
        gap-5
      "
    >
      {dashboardStats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </motion.section>
  );
}
