import dotenv from "dotenv";

dotenv.config();

export const mailConfig = {
  host: process.env.SMTP_HOST || "",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  from: process.env.MAIL_FROM || "Sneaker One <noreply@sneakerone.local>",
};

export const isMailConfigured = () => Boolean(mailConfig.host && mailConfig.user);
