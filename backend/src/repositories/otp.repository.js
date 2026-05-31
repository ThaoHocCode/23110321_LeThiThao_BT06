import { pool } from "../config/db.js";

export const createOtp = async ({ email, otpCode, type, expiresAt }) => {
  await pool.query(
    "UPDATE otp_tokens SET used = 1 WHERE email = ? AND type = ? AND used = 0",
    [email, type]
  );
  await pool.query(
    "INSERT INTO otp_tokens (email, otp_code, type, expires_at) VALUES (?, ?, ?, ?)",
    [email, otpCode, type, expiresAt]
  );
};

export const findValidOtp = async ({ email, otpCode, type }) => {
  const [rows] = await pool.query(
    `SELECT * FROM otp_tokens
     WHERE email = ? AND otp_code = ? AND type = ? AND used = 0 AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [email, otpCode, type]
  );
  return rows[0] || null;
};

export const markOtpUsed = async (id) => {
  await pool.query("UPDATE otp_tokens SET used = 1 WHERE id = ?", [id]);
};
