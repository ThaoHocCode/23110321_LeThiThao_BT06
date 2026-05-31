import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();

  const onChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Mat khau xac nhan khong khop");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setMessage(data.message + " (Kiem tra console backend neu chua cau hinh SMTP)");
      setStep("otp");
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message;
      setError(msg || "Dang ky that bai");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyOtp(form.email, otp);
      navigate(data.redirectUrl || "/user/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Xac thuc OTP that bai");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      const { data } = await api.post("/auth/resend-otp", { email: form.email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Gui lai OTP that bai");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-teal-100 via-white to-orange-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Dang ky tai khoan</h1>

        {step === "form" ? (
          <form onSubmit={handleRegister} className="space-y-3">
            <input required placeholder="Ten dang nhap" className="w-full rounded-lg border p-3" value={form.username} onChange={(e) => onChange("username", e.target.value)} />
            <input required placeholder="Ho ten" className="w-full rounded-lg border p-3" value={form.fullName} onChange={(e) => onChange("fullName", e.target.value)} />
            <input required type="email" placeholder="Email" className="w-full rounded-lg border p-3" value={form.email} onChange={(e) => onChange("email", e.target.value)} />
            <input placeholder="So dien thoai (9-11 so)" className="w-full rounded-lg border p-3" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
            <input required type="password" placeholder="Mat khau (8+ ky tu, hoa/thuong/so)" className="w-full rounded-lg border p-3" value={form.password} onChange={(e) => onChange("password", e.target.value)} />
            <input required type="password" placeholder="Xac nhan mat khau" className="w-full rounded-lg border p-3" value={form.confirmPassword} onChange={(e) => onChange("confirmPassword", e.target.value)} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={loading} className="w-full rounded-lg bg-brand p-3 font-semibold text-white">{loading ? "Dang gui..." : "Dang ky"}</button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <p className="text-sm text-slate-600">{message}</p>
            <input required maxLength={6} placeholder="Nhap ma OTP 6 so" className="w-full rounded-lg border p-3 text-center text-xl tracking-widest" value={otp} onChange={(e) => setOtp(e.target.value)} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={loading} className="w-full rounded-lg bg-brand p-3 font-semibold text-white">{loading ? "Dang xac thuc..." : "Kich hoat tai khoan"}</button>
            <button type="button" onClick={handleResend} className="w-full text-sm text-brand underline">Gui lai OTP</button>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          Da co tai khoan? <Link to="/login" className="text-brand underline">Dang nhap</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
