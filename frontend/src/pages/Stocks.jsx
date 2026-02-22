import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import OrderPanel from "../components/OrderPanel";
import OrderHistory from "../components/OrderHistory";
import { useAssetsStore } from "../store/useAssetsStore";
import { useOrderStore } from "../store/useOrderStore";

const loadTradingViewStock = (symbol) => {
  const container = document.getElementById("tradingview_stock");
  if (!container) return;

  container.innerHTML = "";

  if (window.TradingView) {
    new window.TradingView.widget({
      container_id: "tradingview_stock",
      width: "100%",
      height: Math.max(
        360,
        Math.min(720, Math.round(container.clientWidth * 0.5))
      ),
      symbol: `NASDAQ:${symbol}`,
      interval: "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      hide_side_toolbar: true,
      allow_symbol_change: false,
      save_image: false,
    });
  }
};

/* ---------- Stock Trade Page ---------- */
export default function StockTradePage() {
  const { assetDetails, getAssetById } = useAssetsStore();
  const {
    stockOrders,
    getStockOrders,
    closeStockTrade,
    placeStockOrder,
    isPlacingCryptoTrade,
    checkOrderStatus,
  } = useOrderStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const pairParam = searchParams.get("pair");

  const pair = useMemo(() => {
    if (!pairParam) return null;
    return pairParam.toUpperCase();
  }, [pairParam]);

  const symbol = useMemo(() => {
    if (!pair) return null;
    return pair.split("/")[0];
  }, [pair]);

  /* ---------- order panel states ---------- */
  const [orderSide, setOrderSide] = useState("sell");
  const [volume, setVolume] = useState(1);
  const [showLimit, setShowLimit] = useState(false);
  const [limitPrice, setLimitPrice] = useState(null);
  const [takeProfit, setTakeProfit] = useState(false);
  const [stopLoss, setStopLoss] = useState(false);
  const [tradeAmount, setTradeAmount] = useState("");

  /* ---------- Fetch asset from DB ---------- */
  useEffect(() => {
    if (symbol) {
      getAssetById(symbol.toLowerCase());
    }
  }, [symbol, getAssetById]);

  useEffect(() => {
    if (!symbol) return;

    let interval;

    const loadScript = () =>
      new Promise((resolve) => {
        if (!document.getElementById("tradingview-script")) {
          const script = document.createElement("script");
          script.id = "tradingview-script";
          script.src = "https://s3.tradingview.com/tv.js";
          script.async = true;
          script.onload = resolve;
          document.body.appendChild(script);
        } else {
          resolve();
        }
      });

    const initWidget = async () => {
      await loadScript();

      interval = setInterval(() => {
        if (window.TradingView) {
          loadTradingViewStock(symbol);
          clearInterval(interval);
        }
      }, 200);
    };

    initWidget();
    setLoading(false);

    return () => clearInterval(interval);
  }, [symbol]);

  /* ---------- Sync UI prices from assetDetails ---------- */
  useEffect(() => {
    if (!assetDetails) return;
    setLimitPrice(assetDetails.current_price);
  }, [assetDetails]);

  // get user crypto orders
  useEffect(() => {
    getStockOrders();
  }, [getStockOrders]);

  // check order status
  useEffect(() => {
    const interval = setInterval(() => {
      stockOrders.forEach((order) => {
        if (order.isOpen) {
          checkOrderStatus(order.id);
        }
      });
    }, 5000); // 5s polling

    return () => clearInterval(interval);
  }, [stockOrders, checkOrderStatus]);

  // handle place trade

  const handleStockTrade = async () => {
    try {
      await placeStockOrder({
        assetId: assetDetails?.assetId, // e.g. "btc"
        side: orderSide.toUpperCase(), // BUY / SELL
        amount: Number(tradeAmount),
      });

      // Reset inputs
      setTradeAmount("");
      setTakeProfit(false);
      setStopLoss(false);
    } catch {
      // errors already toasted
    }
  };

  if (!pair || !assetDetails) {
    return <div className="p-6 text-center">⏳ Loading stock...</div>;
  }

  const changeClass =
    assetDetails.price_change_percentage_24h >= 0
      ? "text-secondary"
      : "text-red-500";

  /* ---------- sample orders (kept intentionally) ---------- */
 

  if (loading) {
    return <div className="p-6 text-center"> Loading {pair}...</div>;
  }
  return (
    <div className="md:flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-4 pt-[100px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-tertiary"
            >
              ←
            </button>
            <div>
              <h2 className="text-lg font-semibold">
                {assetDetails.symbol} • {assetDetails.name}
              </h2>
              <div className="text-sm text-gray-400">NASDAQ • Stock Market</div>
            </div>
          </div>

          <div className={`text-right ${changeClass}`}>
            <div className="text-xl font-bold">
              ${assetDetails.current_price.toFixed(2)}
            </div>
            <div className="text-sm">
              {assetDetails.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        </motion.div>

        {/* Chart + Order Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 rounded-2xl bg-lightbg dark:bg-primary shadow-md"
          >
            <div className="p-4 border-b border-gray-200 dark:border-tertiary flex justify-between">
              <div className="text-sm text-gray-400">Pair: {pair}</div>
              <div className="text-sm text-gray-400">Exchange: NASDAQ</div>
            </div>

            <div className="p-4">
              <div id="tradingview_stock" className="w-full h-[520px]" />
            </div>
          </motion.div>

          {/* Order Panel */}
          <OrderPanel
            orderSide={orderSide}
            setOrderSide={setOrderSide}
            volume={volume}
            setVolume={setVolume}
            limitPrice={limitPrice}
            setLimitPrice={setLimitPrice}
            showLimit={showLimit}
            setShowLimit={setShowLimit}
            takeProfit={takeProfit}
            setTakeProfit={setTakeProfit}
            stopLoss={stopLoss}
            setStopLoss={setStopLoss}
            tradeAmount={tradeAmount}
            setTradeAmount={setTradeAmount}
            onPlaceTrade={handleStockTrade}
            isPlacingTrade={isPlacingCryptoTrade}
            trade_size="shares"
          />
        </div>

        {/* Order History */}
        <OrderHistory
          orders={stockOrders}
          type="stock"
          onCloseTrade={closeStockTrade}
        />
      </div>
    </div>
  );
}
