import { Router } from "express";
import {
  getAssetById,
  getCryptoAssets,
  getStockAssets,
} from "../controllers/asset.controller.js";

const assetsRouter = Router();

assetsRouter.get("/crypto", getCryptoAssets);
assetsRouter.get("/stocks", getStockAssets);

// get single assests by the ID e.t.c btc, eth, doge
assetsRouter.get("/:assetId", getAssetById);

export default assetsRouter;
