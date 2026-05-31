import { Router } from "express";
import {
  getHighlights,
  getHomeData,
  getProductDetail,
  getProducts,
  getProductsByCategoryInfinite,
} from "../controllers/product.controller.js";
import { authenticate, requireUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/home", authenticate, requireUser, getHomeData);
router.get("/highlights", getHighlights);
router.get("/search", getProducts);
router.get("/category/:slug/infinite", getProductsByCategoryInfinite);
router.get("/:id", getProductDetail);

export default router;
