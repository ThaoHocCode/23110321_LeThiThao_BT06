import { pool } from "../config/db.js";

export const findByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT id, username, full_name, email, phone, avatar, role, password_hash, is_active, created_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, username, full_name, email, phone, avatar, role, is_active, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
};

export const updatePendingUser = async ({ username, fullName, email, phone, passwordHash }) => {
  await pool.query(
    "UPDATE users SET username = ?, full_name = ?, phone = ?, password_hash = ? WHERE email = ? AND is_active = 0",
    [username, fullName, phone || null, passwordHash, email]
  );
};

export const createUser = async ({ username, fullName, email, phone, passwordHash }) => {
  const [result] = await pool.query(
    `INSERT INTO users (username, full_name, email, phone, password_hash, role, is_active, avatar)
     VALUES (?, ?, ?, ?, ?, 'user', 0, ?)`,
    [username, fullName, email, phone || null, passwordHash, `https://i.pravatar.cc/120?u=${encodeURIComponent(email)}`]
  );
  return result.insertId;
};

export const activateUser = async (email) => {
  await pool.query("UPDATE users SET is_active = 1 WHERE email = ?", [email]);
};

export const updatePassword = async (email, passwordHash) => {
  await pool.query("UPDATE users SET password_hash = ? WHERE email = ?", [passwordHash, email]);
};

export const updateProfile = async (userId, { username, fullName, phone, avatar }) => {
  await pool.query(
    "UPDATE users SET username = ?, full_name = ?, phone = ?, avatar = ? WHERE id = ?",
    [username, fullName, phone || null, avatar || null, userId]
  );
  return findById(userId);
};
