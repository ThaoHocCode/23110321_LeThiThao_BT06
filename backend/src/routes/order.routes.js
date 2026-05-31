import { Router } from "express";
import {
  cancelMyOrder,
  checkout,
  getMyOrderDetail,
  getMyOrders,
  getPaymentMethods,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authenticate, requireAdmin, requireUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/payment-methods", authenticate, requireUser, getPaymentMethods);
router.post("/checkout", authenticate, requireUser, checkout);
router.get("/", authenticate, requireUser, getMyOrders);
router.get("/:id", authenticate, requireUser, getMyOrderDetail);
router.post("/:id/cancel", authenticate, requireUser, cancelMyOrder);
router.patch("/:id/status", authenticate, requireAdmin, updateOrderStatus);

export default router;
