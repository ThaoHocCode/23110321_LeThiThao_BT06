import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import * as userRepo from "../repositories/user.repository.js";

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
};

export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: token required" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await userRepo.findById(payload.sub);

    if (!user || !user.is_active) {
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      role: user.role === "member" ? "user" : user.role,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
  }
};

export const requireUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ message: "Forbidden: user role required" });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin role required" });
  }
  next();
};
