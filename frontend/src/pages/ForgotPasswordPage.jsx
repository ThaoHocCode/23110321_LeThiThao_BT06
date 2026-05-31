import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
      if (data.devMode && data.otp) {
        setDevOtp(data.otp);
        setOtp(data.otp); // auto-fill the OTP input for convenience
      }
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Gui OTP that bai");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Mat khau xac nhan khong khop");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      navigate("/login", { state: { message: "Dat lai mat khau thanh cong. Vui long dang nhap." } });
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message;
      setError(msg || "Dat lai mat khau that bai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-teal-100 via-white to-orange-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Quen mat khau</h1>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <input required type="email" placeholder="Email dang ky" className="w-full rounded-lg border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={loading} className="w-full rounded-lg bg-brand p-3 font-semibold text-white">{loading ? "Dang gui..." : "Gui ma OTP"}</button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-3">
            <p className="text-sm text-slate-600">{message}</p>

            {devOtp && (
              <div style={{ background: "#fff7ed", border: "2px solid #f97316", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#9a3412", fontWeight: 600 }}>🔧 CHẾ ĐỘ PHÁT TRIỂN – OTP của bạn:</p>
                <p style={{ margin: "4px 0 0", fontSize: "28px", fontWeight: "bold", letterSpacing: "6px", color: "#ea580c", fontFamily: "monospace" }}>{devOtp}</p>
                <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#9a3412" }}>OTP đã được điền sẵn bên dưới. Mã này chỉ hiện trong môi trường dev (chưa cấu hình SMTP).</p>
              </div>
            )}

            <input required maxLength={6} placeholder="Ma OTP" className="w-full rounded-lg border p-3" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <input required type="password" placeholder="Mat khau moi" className="w-full rounded-lg border p-3" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input required type="password" placeholder="Xac nhan mat khau moi" className="w-full rounded-lg border p-3" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={loading} className="w-full rounded-lg bg-brand p-3 font-semibold text-white">{loading ? "Dang xu ly..." : "Dat lai mat khau"}</button>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-brand underline">Quay lai dang nhap</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
