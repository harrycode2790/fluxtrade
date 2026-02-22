import { motion } from "framer-motion";
import AdminLayout from "../AdminLayout";
import DashboardHeader from "../components/DashboardHeader";

import SubscriptionManagement from "../components/SubscriptionManagement";
import SubscriptionDetials from "../components/SubscriptionDetials";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminSingleSubPage() {
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
                 
              {/* Users Page */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              >
                <SubscriptionDetials/>
              </motion.div>
      
            </div>
    
    </AdminLayout>
  );
}
