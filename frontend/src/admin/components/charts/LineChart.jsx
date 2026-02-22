import {
  ResponsiveContainer,
  LineChart as RechartLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useAdminDashboardStore } from "../../store/useAdminDashboardStore";
import { useEffect } from "react";
import { useAdminTransactionStore } from "../../store/useAdminTransactionStore ";


export default function LineChart() {
  const {initDashboard} = useAdminDashboardStore()
  const {lineData} = useAdminTransactionStore()
  useEffect(() => {
    initDashboard()
  },[initDashboard])

  return (
    <motion.div
      className="w-full h-60"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartLineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /> {/* light grid */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00E676" // theme secondary color 
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartLineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
