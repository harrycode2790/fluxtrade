import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import OrderPanel from "../components/OrderPanel";
import OrderHistory from "../components/OrderHistory";
import { useAssetsStore } from "../store/useAssetsStore";
import { useOrderStore } from "../store/useOrderStore";

/* --- Helper: initialize TradingView widget into #tradingview_widget --- */
const loadTradingView = (symbol) => {
  const container = document.getElementById("tradingview_widget");
  if (!container) return;

  // Remove existing widget
  container.innerHTML = "";

  if (window.TradingView) {
    new window.TradingView.widget({
      container_id: "tradingview_widget",
      width: "100%",
      height: Math.max(
        360,
        Math.min(720, Math.round(container.clientWidth * 0.5))
      ),
      symbol: `BINANCE:${symbol.replace("/", "")}`,
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

export default function Chart() {
  const { getAssetById, assetDetails } = useAssetsStore();
  const {
    cryptoOrders,
    getCryptoOrders,
    closeCryptoTrade,
    placeCryptoOrder,
    isPlacingCryptoTrade,
    checkOrderStatus,
  } = useOrderStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pair = searchParams.get("pair")?.toUpperCase() || null;

  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [lowPrice, setLowPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  // Order panel states
  const [orderSide, setOrderSide] = useState("sell");
  const [volume, setVolume] = useState(0.1);
  const [limitPrice, setLimitPrice] = useState(null);
  const [showLimit, setShowLimit] = useState(false);
  const [takeProfit, setTakeProfit] = useState(false);
  const [stopLoss, setStopLoss] = useState(false);
  const [tradeAmount, setTradeAmount] = useState("");
  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");

  useEffect(() => {
    if (pair) {
      const assetId = pair.split("/")[0].toLowerCase();
      getAssetById(assetId);
    }
  }, [pair, getAssetById]);

  useEffect(() => {
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

      // If TradingView is not ready yet, poll until it is
      interval = setInterval(() => {
        if (window.TradingView) {
          loadTradingView(pair);
          clearInterval(interval);
        }
      }, 200);
    };

    initWidget();
    setLoading(false);

    return () => clearInterval(interval); // cleanup
  }, [pair]);
  // <-- re-run every time `pair` changes

  useEffect(() => {
    if (!assetDetails) return;

    const cryptoCurrent = assetDetails.current_price;
    const cryptoChangePct = assetDetails.price_change_percentage_24h;
    const previousPrice = cryptoCurrent / (1 + cryptoChangePct / 100);

    setCurrentPrice(cryptoCurrent);
    setHighPrice(Math.max(cryptoCurrent, previousPrice));
    setLowPrice(Math.min(cryptoCurrent, previousPrice));
    setPriceChange(cryptoChangePct);
    setLimitPrice(cryptoCurrent);
    setLoading(false);
  }, [assetDetails]);

  // get user crypto orders
  useEffect(() => {
    getCryptoOrders();
  }, [getCryptoOrders]);

  // check order status
  useEffect(() => {
    const interval = setInterval(() => {
      cryptoOrders.forEach((order) => {
        if (order.isOpen) {
          checkOrderStatus(order.id);
        }
      });
    }, 5000); // 5s polling

    return () => clearInterval(interval);
  }, [cryptoOrders, checkOrderStatus]);

  // handle place trade

  const handleCryptoTrade = async () => {
    try {
      await placeCryptoOrder({
        assetId: assetDetails?.assetId, // e.g. "btc"
        side: orderSide.toUpperCase(), // BUY / SELL
        amount: Number(tradeAmount),
        tp: takeProfit ? Number(tpPrice) : null,
        sl: stopLoss ? Number(slPrice) : null,
      });

      // Reset inputs
      setTradeAmount("");
      setTpPrice("");
      setSlPrice("");
      setTakeProfit(false);
      setStopLoss(false);
    } catch {
      // errors already toasted
    }
  };

  if (!pair) {
    return (
      <div className="text-center text-red-500 p-4">
        No pair specified (e.g., ?pair=BTC/USDT)
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center"> Loading {pair}...</div>;
  }

  const changeClass = priceChange >= 0 ? "text-secondary" : "text-red-500";

  return (
    <div className="md:flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-4 pt-[100px] pb-20 md:pb-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-tertiary text-black dark:text-white hover:opacity-90 transition"
            >
              ←
            </button>
            <div>
              <h2 className="text-lg font-semibold">{pair}</h2>
              <div className="text-sm text-gray-400">
                Live market data & chart
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`text-right ${changeClass}`}>
              <div className="text-xl font-bold">
                ${currentPrice.toFixed(3)}
              </div>
              <div className="text-sm">{priceChange.toFixed(2)}%</div>
            </div>
          </div>
        </motion.div>

        {/* Chart + Order Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-8 rounded-2xl bg-lightbg dark:bg-primary shadow-md overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-tertiary flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  H: {highPrice.toFixed(3)}
                </div>
                <div className="text-sm text-gray-500">
                  L: {lowPrice.toFixed(3)}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div
                id="tradingview_widget"
                className="w-full h-95 md:h-130 rounded-md bg-black/5 dark:bg-black"
              />
            </div>
          </motion.div>

          {/* ORDER PANEL */}
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
            tpPrice={tpPrice}
            setTpPrice={setTpPrice}
            slPrice={slPrice}
            setSlPrice={setSlPrice}
            tradeAmount={tradeAmount}
            setTradeAmount={setTradeAmount}
            current_price={currentPrice}
            onPlaceTrade={handleCryptoTrade}
            isPlacingTrade={isPlacingCryptoTrade}
            trade_size={"volume (lot)"}
          />
        </div>

        {/* Order history */}

        <OrderHistory
          orders={cryptoOrders}
          type="crypto"
          onCloseTrade={closeCryptoTrade}
        />
      </div>
    </div>
  );
}
