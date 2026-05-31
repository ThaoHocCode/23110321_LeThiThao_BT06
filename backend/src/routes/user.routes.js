import { Router } from "express";
import {
  getAdminProfile,
  getUserProfile,
  updateAdminProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { authenticate, requireAdmin, requireUser } from "../middlewares/auth.middleware.js";
import { updateProfileValidator } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/profile", authenticate, requireUser, getUserProfile);
router.put("/profile", authenticate, requireUser, updateProfileValidator, validate, updateUserProfile);

export default router;
