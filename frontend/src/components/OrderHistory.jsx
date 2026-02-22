import { motion } from "framer-motion";
import WinButton from "./WinButton";

import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import { useState } from "react";

export default function OrderHistory({
  orders,
  type = "crypto",
  onCloseTrade,
}) {
  const { liveStatus, deleteClosedOrder } = useOrderStore();
  const [confirmOrderId, setConfirmOrderId] = useState(null);

  const handleDeleteOrder = (orderId) => {
    deleteClosedOrder(orderId, type);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      {orders.map((o) => {
        const live = liveStatus[o.id];
        const isProfit = live?.floatingProfit > 0;

        return (
          <motion.div
            key={o.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl p-4 bg-white dark:bg-primary shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    o.side === "BUY"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {o.side}
                </div>
                <div>
                  <div className="font-semibold text-sm">{o.id}</div>
                  <div className="text-xs text-gray-400">
                    {type === "stock"
                      ? `Placed ${o.placed || ""}`
                      : `${o.meta.source} • ${o.meta.ticket}`}
                  </div>
                </div>
              </div>
              <div
                className={`font-bold ${
                  o.status === "profit"
                    ? "text-secondary"
                    : o.status === "loss"
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {o.status.toUpperCase()}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
              <div>
                <div className="text-xs text-gray-400">
                  {type === "stock" ? "Shares" : "Amount"}
                </div>
                <div className="font-medium">{o.amount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Entry Price</div>
                <div className="font-medium">${o.price.toLocaleString()}</div>

                {live && o.isOpen && (
                  <div
                    className={`flex items-center gap-1 text-xs mt-1 ${
                      isProfit ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isProfit ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    ${live.livePrice.toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-400">TP</div>
                <div className="font-medium">{o.tp ? `$${o.tp}` : "—"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">SL</div>
                <div className="font-medium">{o.sl ? `$${o.sl}` : "—"}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-gray-500">
                {type === "stock" ? "Status info" : "Order info"}
              </div>

              <div className="text-xs text-gray-500">
                {o.asset.toUpperCase() + "/USDT"}
              </div>

              <div className="flex items-center gap-2">
                {/* WIN BUTTONS (unchanged) */}
                {o.status === "closed" && type === "stock" && (
                  <WinButton
                    amount={
                      o.winAmount ? `$ ${o.winAmount.toLocaleString()}` : "—"
                    }
                    source="Stock Payout"
                    ticket={o.id}
                  />
                )}

                {o.status === "profit" && type === "crypto" && (
                  <WinButton
                    amount={
                      o.winAmount ? `$ ${o.winAmount.toLocaleString()}` : "—"
                    }
                    source="Crypto"
                    ticket={o.id}
                  />
                )}

                {/*  CLOSE TRADE BUTTON */}
                {o.isOpen && (
                  <button
                    onClick={() => onCloseTrade(o.id)}
                    className="px-3 py-1 text-xs font-semibold rounded bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Close Trade
                  </button>
                )}

                {/* DELETE CLOSED ORDER */}
                {!o.isOpen && (
                  <button
                    onClick={() => setConfirmOrderId(o.id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition"
                    title="Delete order"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {confirmOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-xl bg-white dark:bg-primary p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Delete Order?</h3>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this order from your order
              history?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOrderId(null)}
                className="px-4 py-2 text-sm rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDeleteOrder(confirmOrderId);
                  setConfirmOrderId(null);
                }}
                className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
