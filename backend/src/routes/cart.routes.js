import { Router } from "express";
import { addItem, getCart, removeItem, updateItem } from "../controllers/cart.controller.js";
import { authenticate, requireUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate, requireUser);
router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);

export default router;
