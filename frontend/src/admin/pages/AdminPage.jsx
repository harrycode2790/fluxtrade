import { motion } from "framer-motion";
import AdminLayout from "../AdminLayout";
import StatsGrid from "../components/StatsGrid";
import ChartsSection from "../components/ChartsSection";
import DashboardHeader from "../components/DashboardHeader";
import UserPreviewSection from "../components/UserPreviewSection";
import TransactionPreviewSection from "../components/TransactionPreviewSection";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      {/* ───────── Dashboard Header ───────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <DashboardHeader />
      </motion.div>

      {/* ───────── Main Content ───────── */}
      <div className="space-y-8 p-6">
        {/* Stats Grid */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <StatsGrid />
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <ChartsSection />
        </motion.div>

        {/* Users Preview */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <UserPreviewSection title="Pending Verification" />
        </motion.div>

        {/* Transactions Preview */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          <TransactionPreviewSection title="Pending Transactions" />
        </motion.div>
      </div>
    </AdminLayout>
  );
}
