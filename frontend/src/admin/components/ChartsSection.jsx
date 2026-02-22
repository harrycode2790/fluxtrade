import { motion } from "framer-motion";
import ChartCard from "./ChartCard";
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";

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

export default function ChartsSection() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5"
    >
      <ChartCard title="User Growth">
        <LineChart />
      </ChartCard>

      <ChartCard title="Transactions">
        <BarChart />
      </ChartCard>

      <ChartCard title="Orders & Subscription Breakdown">
        <PieChart />
      </ChartCard>
    </motion.section>
  );
}



