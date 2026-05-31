import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("member1@example.com");
  const [password, setPassword] = useState("User@123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.redirectUrl || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Dang nhap that bai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-teal-100 via-white to-orange-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-1 text-2xl font-bold">Dang nhap</h1>
        <p className="mb-4 text-sm text-slate-500">Sneaker One - Cua hang giay the thao</p>

        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          className="mb-3 w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mb-1 block text-sm font-medium">Mat khau</label>
        <input
          type="password"
          required
          className="mb-3 w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-brand p-3 font-semibold text-white disabled:bg-slate-300"
        >
          {loading ? "Dang xu ly..." : "Dang nhap"}
        </button>

        <div className="mt-4 flex justify-between text-sm">
          <Link to="/register" className="text-brand underline">Dang ky</Link>
          <Link to="/forgot-password" className="text-brand underline">Quen mat khau?</Link>
        </div>

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          Demo: member1@example.com / User@123456 (user) | admin@example.com / Admin@123456 (admin)
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
