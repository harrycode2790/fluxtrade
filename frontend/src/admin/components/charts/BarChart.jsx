import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { memo } from "react";
import { useAdminDashboardStore } from "../../store/useAdminDashboardStore";
import { useAdminTransactionStore } from "../../store/useAdminTransactionStore ";
import { useEffect } from "react";

function BarChart() {
  const {initDashboard} = useAdminDashboardStore()
    const {barData} = useAdminTransactionStore()
    useEffect(() => {
      initDashboard()
    },[initDashboard])
    
  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={barData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />

          {/* X Axis */}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "13px",
            }}
          />

          {/* Bars */}
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            fill="#00E676"
            isAnimationActive={true}
            animationDuration={600}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(BarChart);
