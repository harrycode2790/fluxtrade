import axios from "axios";
import MarketAsset from "../models/asset.model.js";
import { ENV } from "../config/env.js";

export const getCryptoAssets = async (req, res) => {
  try {
    // 1. TRY FETCH FROM COINGECKO
    const url = "https://api.coingecko.com/api/v3/coins/markets";

    const { data } = await axios.get(url, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 7,
        page: 1,
      },
    });

    // 2. FORMAT AND SAVE/UPDATE TO DB
    for (const coin of data) {
      await MarketAsset.findOneAndUpdate(
        { assetId: coin.symbol.toLowerCase() },
        {
          assetId: coin.symbol.toLowerCase(),
          type: "crypto",
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          image: coin.image,
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          market_cap: coin.market_cap,
          volume_24h: coin.total_volume,
        },
        { upsert: true, new: true }
      );
    }

    // 3. RETURN UPDATED CRYPTO FROM DB
    const updated = await MarketAsset.find({ type: "crypto" });
    return res.json({
      data: updated,
    });
  } catch (err) {
    console.log("CoinGecko FAILED → returning cached data instead");

    // 4. FALLBACK: get cached crypto data
    try {
      const cached = await MarketAsset.find({ type: "crypto" });

      if (cached.length === 0) {
        return res.status(500).json({
          message: "No crypto data available. CoinGecko unreachable.",
        });
      }

      return res.json({
        source: "database-cache",
        data: cached,
      });
    } catch (dbErr) {
      return res.status(500).json({
        message: "Both CoinGecko and database failed.",
      });
    }
  }
};

export const getStockAssets = async (req, res) => {
  const API_KEY = ENV.ALPHA_VANTAGE;
  const STOCK_SYMBOLS = ["AAPL", "TSLA", "MSFT", "AMZN", "NVDA"];
  try {
    const stockData = [];

    for (const symbol of STOCK_SYMBOLS) {
      try {
        const url = `https://www.alphavantage.co/query`;
        const { data } = await axios.get(url, {
          params: {
            function: "GLOBAL_QUOTE",
            symbol,
            apikey: API_KEY,
          },
        });

        const quote = data["Global Quote"];
        if (!quote) throw new Error("No quote returned");

        const stock = {
          assetId: symbol.toLowerCase(),
          type: "stock",
          name: symbol,
          symbol: symbol,
          current_price: parseFloat(quote["05. price"]) || 0,
          price_change_percentage_24h:
            parseFloat(quote["10. change percent"]) || 0,
          market_cap: 0, // Alpha Vantage free tier does not provide market cap
          exchange: "NASDAQ", // hardcoded for simplicity
          image: `https://img.logokit.com/ticker/${symbol.toLowerCase()}?token=pk_frd54a4313581d3c7f48b6`,
        };

        stockData.push(stock);

        // save/update in DB
        await MarketAsset.findOneAndUpdate({ assetId: stock.assetId }, stock, {
          upsert: true,
          new: true,
        });
      } catch (err) {
        console.error(`Failed to fetch ${symbol}`, err.message);
      }
    }

    // Return updated DB
    const updatedStocks = await MarketAsset.find({ type: "stock" });
    return res.json({ data: updatedStocks });
  } catch (err) {
    console.error("Alpha Vantage failed, returning cached data", err);

    const cachedStocks = await MarketAsset.find({ type: "stock" });
    if (!cachedStocks.length)
      return res.status(500).json({ message: "No stock data available" });

    return res.json({ source: "database-cache", data: cachedStocks });
  }
};

export const getAssetById = async (req, res) => {
  await axios.get(`${ENV.CLIENT_URL}/api/assets/crypto`);
  const { assetId } = req.params;

  if (!assetId)
    return res.status(400).json({ message: "assetId is required" });

  try {
    // search DB by assetId (already lowercase in DB)
    const asset = await MarketAsset.findOne({ assetId: assetId.toLowerCase() });

    if (!asset)
      return res.status(404).json({ message: `Asset with id ${assetId} not found` });

    return res.json({ data: asset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};