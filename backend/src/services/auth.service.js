import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt.js";
import * as otpRepo from "../repositories/otp.repository.js";
import * as userRepo from "../repositories/user.repository.js";
import { sendOtpEmail } from "./mail.service.js";

const OTP_EXPIRY_MINUTES = 10;
const SALT_ROUNDS = 10;

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  fullName: user.full_name,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role === "member" ? "user" : user.role,
  isActive: Boolean(user.is_active),
  createdAt: user.created_at,
});

const signToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role === "member" ? "user" : user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const getRedirectUrl = (role) => {
  const normalized = role === "member" ? "user" : role;
  return normalized === "admin" ? "/admin/profile" : "/user/profile";
};

const sendOtp = async (email, type) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await otpRepo.createOtp({ email, otpCode: otp, type, expiresAt });

  const isRegister = type === "register";
  const mailResult = await sendOtpEmail({
    to: email,
    otp,
    subject: isRegister ? "Kich hoat tai khoan Sneaker One" : "Dat lai mat khau Sneaker One",
    message: isRegister
      ? "Nhap ma OTP de kich hoat tai khoan cua ban:"
      : "Nhap ma OTP de dat lai mat khau:",
  });

  // Only expose OTP in response when running in dev mode (no SMTP configured)
  const result = { message: "OTP da duoc gui den email", expiresInMinutes: OTP_EXPIRY_MINUTES };
  if (mailResult?.devMode) {
    result.otp = otp;
    result.devMode = true;
  }
  return result;
};

export const register = async ({ username, fullName, email, phone, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing?.is_active) {
    const err = new Error("Email da duoc su dung");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  if (existing && !existing.is_active) {
    await userRepo.updatePendingUser({ username, fullName, email, phone, passwordHash });
  } else if (!existing) {
    await userRepo.createUser({ username, fullName, email, phone, passwordHash });
  }

  return sendOtp(email, "register");
};

export const verifyRegisterOtp = async ({ email, otp }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error("Tai khoan khong ton tai");
    err.status = 404;
    throw err;
  }
  if (user.is_active) {
    const err = new Error("Tai khoan da duoc kich hoat");
    err.status = 400;
    throw err;
  }

  const otpRecord = await otpRepo.findValidOtp({ email, otpCode: otp, type: "register" });
  if (!otpRecord) {
    const err = new Error("OTP khong hop le hoac da het han");
    err.status = 400;
    throw err;
  }

  await otpRepo.markOtpUsed(otpRecord.id);
  await userRepo.activateUser(email);

  const activated = await userRepo.findByEmail(email);
  const token = signToken(activated);

  return {
    user: sanitizeUser(activated),
    token,
    redirectUrl: getRedirectUrl(activated.role),
  };
};

export const resendRegisterOtp = async (email) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error("Tai khoan khong ton tai");
    err.status = 404;
    throw err;
  }
  if (user.is_active) {
    const err = new Error("Tai khoan da duoc kich hoat");
    err.status = 400;
    throw err;
  }
  return sendOtp(email, "register");
};

export const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user || !user.password_hash) {
    const err = new Error("Email hoac mat khau khong dung");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error("Email hoac mat khau khong dung");
    err.status = 401;
    throw err;
  }

  if (!user.is_active) {
    const err = new Error("Tai khoan chua duoc kich hoat. Vui long xac thuc OTP.");
    err.status = 403;
    throw err;
  }

  const token = signToken(user);
  const role = user.role === "member" ? "user" : user.role;

  return {
    user: sanitizeUser(user),
    token,
    redirectUrl: getRedirectUrl(role),
  };
};

export const forgotPassword = async (email) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    return { message: "Neu email ton tai, ma OTP se duoc gui den hop thu cua ban" };
  }
  const otpResult = await sendOtp(email, "reset_password");
  const response = { message: "Neu email ton tai, ma OTP se duoc gui den hop thu cua ban" };
  // In dev mode, include the OTP in the response so the frontend can display it
  if (otpResult?.devMode) {
    response.otp = otpResult.otp;
    response.devMode = true;
  }
  return response;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error("Tai khoan khong ton tai");
    err.status = 404;
    throw err;
  }

  const otpRecord = await otpRepo.findValidOtp({ email, otpCode: otp, type: "reset_password" });
  if (!otpRecord) {
    const err = new Error("OTP khong hop le hoac da het han");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await otpRepo.markOtpUsed(otpRecord.id);
  await userRepo.updatePassword(email, passwordHash);

  return { message: "Dat lai mat khau thanh cong" };
};

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
