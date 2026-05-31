import * as userRepo from "../repositories/user.repository.js";

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

export const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return sanitizeUser(user);
};

export const updateProfile = async (userId, payload) => {
  const updated = await userRepo.updateProfile(userId, {
    username: payload.username,
    fullName: payload.fullName,
    phone: payload.phone,
    avatar: payload.avatar,
  });
  return sanitizeUser(updated);
};
