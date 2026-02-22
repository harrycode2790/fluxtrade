import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import BottomNavbar from "../components/BottomNavbar";
import { useAssetsStore } from "../store/useAssetsStore";
import { useEffect } from "react";

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("hot");
  const [query, setQuery] = useState("");
  const { cryptoAssets, getCrptoAssets, stockAssets, getStocksAssets } =
    useAssetsStore();

  useEffect(() => {
    getCrptoAssets();
    getStocksAssets();
  }, [getCrptoAssets, getStocksAssets]);

  const categories = useMemo(() => ["hot", "crypto", "stocks"], []);

  const normalizeAsset = (asset) => ({
    id: asset.assetId || asset._id, // DB asset id
    type: asset.type,
    name: asset.name,
    symbol: asset.symbol.toUpperCase(),
    image: asset.image,
    current_price: Number(asset.current_price),
    price_change_percentage_24h: Number(asset.price_change_percentage_24h),
  });

  const marketData = useMemo(() => {
    const crypto = cryptoAssets.map(normalizeAsset);
    const stocks = stockAssets.map(normalizeAsset);

    // HOT = top movers by abs % change
    const hot = [...crypto, ...stocks]
      .sort(
        (a, b) =>
          Math.abs(b.price_change_percentage_24h) -
          Math.abs(a.price_change_percentage_24h)
      )
      .slice(0, 6);

    return {
      hot,
      crypto,
      stocks,
    };
  }, [cryptoAssets, stockAssets]);

  const list = marketData[activeTab].filter((item) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q)
    );
  });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 180, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen md:flex text-black dark:text-white">
      <Sidebar />

      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto mt-20">
        <div className="sticky top-3 z-30 bg-transparent">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold">Market</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Explore markets — tap a card to open the chart
              </p>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-tertiary rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search markets..."
                  className="bg-transparent outline-none text-sm w-72"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1">
            <div className="flex gap-2 px-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === cat
                      ? "bg-secondary text-black shadow"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <span className="capitalize">{cat}</span>
                </button>
              ))}
            </div>

            {/* Mobile Search */}
            <div className="ml-auto md:hidden px-1">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-tertiary rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="bg-transparent outline-none text-sm w-36"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {list.map((coin) => {
              const symbol = `${coin.symbol.toUpperCase()}/USDT`;
              const price = coin.current_price.toFixed(2);
              const change = coin.price_change_percentage_24h;
              const changeColor =
                change >= 0 ? "text-secondary" : "text-red-500";

              const sell = (coin.current_price * 0.9995).toFixed(2);
              const buy = (coin.current_price * 1.0005).toFixed(2);
              const spread = (buy - sell).toFixed(3);

              return (
                <motion.article
                  key={coin.id}
                  variants={item}
                  className="p-4 rounded-2xl bg-white dark:bg-primary shadow-sm hover:shadow-md transition"
                  whileHover={{ y: -6 }}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-11 h-11 rounded-full"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{coin.name}</div>
                          <div className="text-xs text-gray-400">{symbol}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold">{price}</div>
                          <div
                            className={`${changeColor} text-xs font-semibold`}
                          >
                            {change >= 0 ? `+${change}%` : `${change}%`}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="h-2 w-full bg-gray-100 dark:bg-tertiary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              change >= 0 ? "bg-green-400" : "bg-red-400"
                            }`}
                            style={{ width: `${Math.abs(change) * 8}%` }}
                          />
                        </div>

                        <div className="flex gap-2 items-center ml-4">
                          <Link
                            to={`/trade/${coin.type}?pair=${encodeURIComponent(
                              symbol
                            )}`}
                            className="flex gap-2"
                          >
                            <div className="px-3 py-2 bg-red-600 text-black rounded-md text-xs">
                              <div>Sell</div>
                              <div className="font-semibold">{sell}</div>
                            </div>

                            <div className="px-3 py-2 bg-secondary text-black rounded-md text-xs">
                              <div>Buy</div>
                              <div className="font-semibold">{buy}</div>
                            </div>
                          </Link>

                          <div className="text-xs text-gray-400">
                            <div>Spread</div>
                            <div className="font-medium">{spread}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>

        <div className="h-28 md:h-12" />
      </main>

      <BottomNavbar />
    </div>
  );
}
