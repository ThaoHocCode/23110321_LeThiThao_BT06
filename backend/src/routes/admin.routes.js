import { Router } from "express";
import { getAdminProfile, updateAdminProfile } from "../controllers/user.controller.js";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware.js";
import { updateProfileValidator } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/profile", authenticate, requireAdmin, getAdminProfile);
router.put("/profile", authenticate, requireAdmin, updateProfileValidator, validate, updateAdminProfile);

export default router;
