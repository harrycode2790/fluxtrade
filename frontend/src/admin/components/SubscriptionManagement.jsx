import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Bot, Users, Plus } from "lucide-react";
import CreateSubscriptionModal, {
  ActionCard,
  FilterButton,
} from "./CreateSubscriptionModal";
import SubscriptionCard from "./SubscriptionCard";

/* ───────── Dummy Data ───────── */
const subscriptions = [
  { _id: "1", type: "package", name: "VIP Package", price: 300 },
  { _id: "2", type: "package", name: "Pro Package", price: 160 },
  { _id: "3", type: "package", name: "Basic Package", price: 50 },
  { _id: "4", type: "copy-trader", name: "LunaTrader", price: 200 },
  { _id: "5", type: "copy-trader", name: "Michael Ade", price: 200 },
  { _id: "6", type: "bot", name: "ScalpMaster AI", price: 100 },
  { _id: "7", type: "bot", name: "AlphaWave Bot", price: 20 },
];

export default function SubscriptionManagement() {
  const [filter, setFilter] = useState("all");
  const [modalType, setModalType] = useState(null);
  const [allSubscriptions, setAllSubscriptions] = useState(subscriptions);

  const filteredSubscriptions = useMemo(() => {
    if (filter === "all") return allSubscriptions;
    return allSubscriptions.filter((s) => s.type === filter);
  }, [filter, allSubscriptions]);

  const handleCreate = () => {
    alert("handle create")
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Subscriptions</h1>
          <p className="text-sm text-slate-500">
            Manage trading packages, bots, and copy traders
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Left */}
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <FilterButton
                value={filter}
                setValue={setFilter}
                type="all"
                label="All"
              />
              <FilterButton
                value={filter}
                setValue={setFilter}
                type="package"
                label="Packages"
                icon={Package}
              />
              <FilterButton
                value={filter}
                setValue={setFilter}
                type="bot"
                label="Bots"
                icon={Bot}
              />
              <FilterButton
                value={filter}
                setValue={setFilter}
                type="copy-trader"
                label="Copy Traders"
                icon={Users}
              />
            </div>

            <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSubscriptions.map((item) => (
                <SubscriptionCard key={item._id} subscription={item} />
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <ActionCard
              icon={Package}
              label="Create Trading Package"
              onClick={() => setModalType("package")}
            />
            <ActionCard
              icon={Bot}
              label="Create Trading Bot"
              onClick={() => setModalType("bot")}
            />
            <ActionCard
              icon={Users}
              label="Create Copy Trader"
              onClick={() => setModalType("copy-trader")}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalType && (
          <CreateSubscriptionModal
            type={modalType}
            mode="create"
            onClose={() => setModalType(null)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </>
  );
}
