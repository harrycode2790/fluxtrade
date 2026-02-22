import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import UserHeader from "./UserHeader";
import SubscriptionInfo from "./SubscriptionInfo";
import SubscriptionFeatures from "./SubscriptionFeatures";
import SubscriptionActions from "./SubscriptionActions";

const dummySubscription = {
  _id: "6931a942fd079b096d89c018",
  type: "bot",
  name: "AlphaWave Bot",
  description: "Trend-following bot optimized for BTC and ETH.",

  stats: {
    followers: 1200,
    roi: 42.5,
    winRate: 68,
    equity: 15000,
  },
  price: 20,
  features: [
    "Automated BTC & ETH trading",
    "Trend-following strategy",
    "Risk-managed entries",
  ],
  meta: {
    exchange: "Binance",
    strategy: "Trend Following",
    riskLevel: "Medium",
  },

  createdAt: "2025-12-02",
  updatedAt: "2025-12-19",
};

export default function SubscriptionDetials() {
  const { id } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <UserHeader user={dummySubscription} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SubscriptionInfo subscription={dummySubscription} />
        <SubscriptionFeatures subscription={dummySubscription} />
      </div>

      <SubscriptionActions subscription={dummySubscription} />
    </motion.div>
  );
}
