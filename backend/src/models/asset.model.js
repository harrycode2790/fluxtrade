import mongoose from "mongoose";

const MarketAssetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // btc, eth, aapl
    },

    type: {
      type: String,
      enum: ["crypto", "stock", "commodity"],
      required: true,
    },

    name: { type: String, required: true },

    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // BTC, ETH, AAPL
    },

    image: { type: String },

    current_price: { type: Number, required: true },
    price_change_percentage_24h: { type: Number, default: 0 },

    // Stocks
    exchange: { type: String },

    // Commodities
    unit: { type: String }, // barrel, oz, ton

    // Extra useful fields for charts & markets
    market_cap: { type: Number },
    volume_24h: { type: Number },
  },
  { timestamps: true }
);

const MarketAsset = mongoose.model("MarketAsset", MarketAssetSchema);

export default MarketAsset;
