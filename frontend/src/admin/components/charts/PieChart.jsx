import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { memo } from "react";
import { useAdminDashboardStore } from "../../store/useAdminDashboardStore";
import { useAdminSubscriptionStore } from "../../store/useAdminSubscriptionStore";
import { useAdminTransactionStore } from "../../store/useAdminTransactionStore ";
import { useEffect } from "react";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

function PieChart() {
  const { initDashboard } = useAdminDashboardStore();
  const { totalSubscription } = useAdminSubscriptionStore();
  const { ordersMeta } = useAdminTransactionStore();

  useEffect(() => {
    initDashboard();
  }, [initDashboard]);
  const data = [
    { name: "Subscriptions", value: totalSubscription ? totalSubscription : "0"  },
    { name: "Crypto Trade Orders", value: ordersMeta?.totalCryptoOrders || "0" },
    { name: "Stock Trade Orders", value: ordersMeta?. totalStockOrders || "0" },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              stroke="none"
              isAnimationActive={true}
              animationDuration={700}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                fontSize: "13px",
              }}
              formatter={(value) => [`${value}`, "Total"]}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      {/* Center Label */}
      <div className="absolute text-center pointer-events-none">
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {total}
        </p>
      </div>

      {/* Legend */}
      <div className="w-full space-y-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-slate-600 dark:text-slate-400">
                {item.name}
              </span>
            </div>

            <span className="font-medium text-slate-900 dark:text-slate-100">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(PieChart);
