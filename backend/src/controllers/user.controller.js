import * as userService from "../services/user.service.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    res.json({ profile, message: "Cap nhat ho so thanh cong" });
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    res.json({ profile, message: "Cap nhat ho so admin thanh cong" });
  } catch (error) {
    next(error);
  }
};
