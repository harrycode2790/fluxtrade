import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";

export default function OrderPanel({
  orderSide,
  setOrderSide,
  volume,
  setVolume,
  limitPrice,
  setLimitPrice,
  showLimit,
  setShowLimit,
  takeProfit,
  setTakeProfit,
  stopLoss,
  setStopLoss,
  tradeAmount,
  setTradeAmount,
  current_price,
  trade_size,
  tpPrice,
  setTpPrice,
  slPrice,
  setSlPrice,
  onPlaceTrade,
  isPlacingTrade,
}) {

  const {authUser} = useAuthStore()
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="lg:col-span-4 rounded-2xl bg-white/70 dark:bg-gray-900/60 shadow-lg p-4 flex flex-col backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold">Quick Trade</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Market & Limit orders
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-400">Balance</div>
          <div className="text-sm font-semibold text-secondary">{`$${Number(authUser?.balance?.$numberDecimal).toFixed(2)}`} </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="relative bg-transparent rounded-xl overflow-hidden flex border border-gray-200 dark:border-tertiary">
          <button
            onClick={() => setShowLimit(false)}
            className={`flex-1 py-2 text-sm font-semibold ${
              !showLimit ? "text-black dark:text-white" : "text-gray-400"
            }`}
          >
            Market
          </button>

          <button
            onClick={() => setShowLimit(true)}
            className={`flex-1 py-2 text-sm font-semibold ${
              showLimit ? "text-black dark:text-white" : "text-gray-400"
            }`}
          >
            Limit
          </button>

          <motion.div
            layout
            initial={false}
            animate={{ x: showLimit ? "50%" : "0%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 w-1/2 h-[3px] rounded"
            style={{
              background: "linear-gradient(90deg,var(--color-secondary))",
            }}
          />
        </div>
      </div>

      {/* BUY / SELL */}
      <div className="flex gap-3 mb-4 items-center">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setOrderSide("sell")}
          className={`flex-1 py-3 rounded-lg font-semibold text-sm ${
            orderSide === "sell"
              ? "ring-1 ring-red-400/30 bg-red-50 dark:bg-red-900/20 text-red-600"
              : "bg-transparent"
          }`}
        >
          SELL
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setOrderSide("buy")}
          className={`flex-1 py-3 rounded-lg font-semibold text-sm ${
            orderSide === "buy"
              ? "bg-secondary text-black shadow"
              : "bg-transparent"
          }`}
          style={
            orderSide === "buy"
              ? { boxShadow: "0 8px 28px rgba(0,230,118,0.12)" }
              : {}
          }
        >
          BUY
        </motion.button>
      </div>

      {/* Volume + Slider */}
      <div className="mb-4">
        <label className="text-sm text-gray-500 block mb-2">{trade_size}</label>

        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() =>
              setVolume((v) => Math.max(0.1, +(v - 0.1).toFixed(2)))
            }
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-tertiary"
          >
            −
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              className="w-full h-2 bg-transparent accent-secondary"
            />
            <div className="mt-2 text-center text-sm font-semibold">
              {volume.toFixed(2)} {trade_size}
            </div>
          </div>

          <button
            onClick={() => setVolume((v) => +(v + 0.1).toFixed(2))}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-tertiary"
          >
            +
          </button>
        </div>

        <div className="flex gap-2">
          {[0.1, 0.5, 1, 2].map((v) => (
            <motion.button
              key={v}
              onClick={() => setVolume(v)}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-2 rounded-lg text-sm ${
                volume === v
                  ? "bg-secondary text-black font-semibold"
                  : "bg-gray-100 dark:bg-tertiary"
              }`}
            >
              {v}
            </motion.button>
          ))}
        </div>
      </div>

      {/* LIMIT */}
      <AnimatePresence>
        {showLimit && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4"
          >
            <label className="text-sm text-gray-500 block mb-2">
              Limit Price
            </label>
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 dark:bg-tertiary">
              <button
                onClick={() =>
                  setLimitPrice((p) => (p ? +(p - 0.01).toFixed(5) : 0))
                }
                className="px-3 py-2 rounded-lg bg-transparent"
              >
                −
              </button>

              <div className="font-semibold text-center">
                {limitPrice ? limitPrice.toFixed(5) : "--"}
              </div>

              <button
                onClick={() =>
                  setLimitPrice((p) => (p ? +(p + 0.01).toFixed(5) : 0))
                }
                className="px-3 py-2 rounded-lg bg-transparent"
              >
                +
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TP / SL */}
      <div className="mb-4 grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={takeProfit}
              onChange={() => setTakeProfit((s) => !s)}
            />
            <span className="text-sm">Take Profit</span>
          </label>

          {takeProfit && (
            <input
              type="number"
              placeholder="TP price"
              value={tpPrice}
              onChange={(e) => setTpPrice(e.target.value)}
              className="ml-3 w-32 px-3 py-2 rounded bg-gray-100 dark:bg-tertiary text-sm"
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stopLoss}
              onChange={() => setStopLoss((s) => !s)}
            />
            <span className="text-sm">Stop Loss</span>
          </label>

          {stopLoss && (
            <input
              type="number"
              placeholder="SL price"
              value={slPrice}
              onChange={(e) => setSlPrice(e.target.value)}
              className="ml-3 w-32 px-3 py-2 rounded bg-gray-100 dark:bg-tertiary text-sm"
            />
          )}
        </div>
      </div>

      {/* Trade Amount */}
      <div className="mb-4">
        <label className="text-sm text-gray-500 block mb-2">
          Trade Amount ($)
        </label>
        <input
          type="number"
          placeholder="Enter amount"
          value={tradeAmount}
          onChange={(e) => setTradeAmount(e.target.value)}
          className="w-full px-3 py-3 rounded-lg bg-gray-100 dark:bg-tertiary"
        />
      </div>

      {/* Summary */}
      <div className="mb-4 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between text-sm">
        <div>
          <div className="text-xs text-gray-400">Est. Position Value</div>
          <div className="font-semibold">
            ${(volume * (current_price || 0)).toFixed(2)}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400">Leverage</div>
          <div className="font-semibold">1:100</div>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.995 }}
        onClick={onPlaceTrade}
        disabled={isPlacingTrade}
        className="w-full py-3 rounded-lg font-semibold text-white text-lg disabled:opacity-60"
        style={{
          background:
            orderSide === "sell"
              ? "linear-gradient(90deg,#ef4444,#f87171)"
              : "linear-gradient(90deg,var(--color-secondary),#00d36a)",
          boxShadow:
            orderSide === "buy"
              ? "0 12px 30px rgba(0,230,118,0.12)"
              : "0 12px 30px rgba(239,68,68,0.08)",
        }}
      >
        {isPlacingTrade ? "placing..." : orderSide.toUpperCase()}
      </motion.button>
    </motion.aside>
  );
}
