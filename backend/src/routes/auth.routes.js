import { Router } from "express";
import {
  forgotPassword,
  login,
  register,
  resendRegisterOtp,
  resetPassword,
  verifyRegisterOtp,
} from "../controllers/auth.controller.js";
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyOtpValidator,
} from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  forgotPasswordLimiter,
  loginLimiter,
  otpLimiter,
  registerLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", registerLimiter, registerValidator, validate, register);
router.post("/verify-otp", otpLimiter, verifyOtpValidator, validate, verifyRegisterOtp);
router.post("/resend-otp", otpLimiter, forgotPasswordValidator, validate, resendRegisterOtp);
router.post("/login", loginLimiter, loginValidator, validate, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password", otpLimiter, resetPasswordValidator, validate, resetPassword);

export default router;
