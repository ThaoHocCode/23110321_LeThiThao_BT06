import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Ten dang nhap phai tu 2-50 ky tu"),
  body("fullName")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Ho ten phai tu 2-150 ky tu"),
  body("email").trim().isEmail().withMessage("Email khong hop le").normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9]{9,11}$/)
    .withMessage("So dien thoai khong hop le"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Mat khau toi thieu 8 ky tu")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Mat khau phai co chu hoa, chu thuong va so"),
];

export const verifyOtpValidator = [
  body("email").trim().isEmail().withMessage("Email khong hop le").normalizeEmail(),
  body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("OTP phai co 6 so"),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email khong hop le").normalizeEmail(),
  body("password").notEmpty().withMessage("Mat khau khong duoc de trong"),
];

export const forgotPasswordValidator = [
  body("email").trim().isEmail().withMessage("Email khong hop le").normalizeEmail(),
];

export const resetPasswordValidator = [
  body("email").trim().isEmail().withMessage("Email khong hop le").normalizeEmail(),
  body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("OTP phai co 6 so"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Mat khau toi thieu 8 ky tu")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Mat khau phai co chu hoa, chu thuong va so"),
];

export const updateProfileValidator = [
  body("username")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Ten dang nhap phai tu 2-50 ky tu"),
  body("fullName")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Ho ten phai tu 2-150 ky tu"),
  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9]{9,11}$/)
    .withMessage("So dien thoai khong hop le"),
  body("avatar").optional({ checkFalsy: true }).isURL().withMessage("Avatar phai la URL hop le"),
];
