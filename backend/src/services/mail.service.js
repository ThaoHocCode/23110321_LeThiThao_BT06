import nodemailer from "nodemailer";
import { isMailConfigured, mailConfig } from "../config/mail.js";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!isMailConfigured()) return null;

  transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: { user: mailConfig.user, pass: mailConfig.pass },
  });
  return transporter;
};

export const sendOtpEmail = async ({ to, otp, subject, message }) => {
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>${subject}</h2>
      <p>${message}</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#0f766e">${otp}</p>
      <p style="color:#64748b;font-size:13px">Ma OTP co hieu luc trong 10 phut. Khong chia se ma nay.</p>
    </div>
  `;

  const transport = getTransporter();
  if (!transport) {
    console.log(`[MAIL-DEV] To: ${to} | OTP: ${otp} | Subject: ${subject}`);
    return { devMode: true };
  }

  await transport.sendMail({
    from: mailConfig.from,
    to,
    subject,
    html,
  });
  return { devMode: false };
};
