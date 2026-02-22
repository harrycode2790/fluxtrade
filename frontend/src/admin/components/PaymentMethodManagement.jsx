import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Wallet } from "lucide-react";
import PaymentMethodCard from "./PaymentMethodCard";
import CreateSubscriptionModal, { ActionCard } from "./CreateSubscriptionModal";
import CreatePaymentMethodModal from "./CreatePaymentMethodModal";

/* ───────── Dummy Payment Methods ───────── */
const paymentMethods = [
  {
    _id: "6936e4877c6fe4eda6a9ed40",
    name: "Bitcoin",
    icon: "https://cryptoicons.org/api/icon/btc/200",
    description: "",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "BTC",
    isActive: true,
    createdAt: "2025-12-08T14:45:27.326+00:00",
    updatedAt: "2025-12-08T14:45:27.326+00:00",
  },
  {
    _id: "6936e4877c6fe4eda6a9ed41",
    name: "Ethereum",
    icon: "https://cryptoicons.org/api/icon/eth/200",
    description: "",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    network: "ERC20",
    isActive: true,
    createdAt: "2025-12-08T14:45:27.326+00:00",
    updatedAt: "2025-12-08T14:45:27.326+00:00",
  },
  {
    _id: "6936e4877c6fe4eda6a9ed42",
    name: "USDT",
    icon: "https://cryptoicons.org/api/icon/usdt/200",
    description: "",
    address: "TQ9vZp8LZ6uZK4KZ3u9f2n2Nf9Kp6Y6z9A",
    network: "TRC20",
    isActive: false,
    createdAt: "2025-12-08T14:45:27.326+00:00",
    updatedAt: "2025-12-08T14:45:27.326+00:00",
  },
];

export default function PaymentMethodManagement() {
  const [methods, setMethods] = useState(paymentMethods);
  const [openModal, setOpenModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  const handleDelete = () => {
    alert("handle delete payment method");
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setOpenModal(true);
  };


  const handleSubmit = (data) => {
    if (editingMethod) {
      // EDIT MODE
      alert(`Editing payment method: ${editingMethod.name}`);
      console.log("Edit payload:", data);
    } else {
      // CREATE MODE
      alert("Creating new payment method");
      console.log("Create payload:", data);
    }

    setOpenModal(false);
    setEditingMethod(null);
  };
  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Payment Methods</h1>
          <p className="text-sm text-slate-500">
            Manage deposit payment addresses
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Left */}
          <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {methods.map((method) => (
              <PaymentMethodCard
                key={method._id}
                method={method}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>

          {/* Right */}
          <div className="space-y-4">
            <ActionCard
              icon={Wallet}
              label="Create Payment Method"
              onClick={() => {
                setEditingMethod(null);
                setOpenModal(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal && (
          <CreatePaymentMethodModal
            onClose={() => setOpenModal(false)}
            mode={editingMethod ? "edit" : "create"}
            method={editingMethod}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </>
  );
}
