import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/layout/Header";

const ProfileForm = ({ apiPath, title, shopLink }) => {
  const { auth, updateUser, logout } = useAuth();
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    phone: "",
    avatar: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(apiPath);
      const p = data.profile;
      setForm({
        username: p.username || "",
        fullName: p.fullName || "",
        phone: p.phone || "",
        avatar: p.avatar || "",
      });
    };
    load();
  }, [apiPath]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.put(apiPath, form);
      updateUser(data.profile);
      setMessage(data.message || "Cap nhat thanh cong");
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message;
      setError(msg || "Cap nhat that bai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <img src={form.avatar || auth?.user?.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
          <div>
            <p className="font-semibold">{auth?.user?.fullName || auth?.user?.username}</p>
            <p className="text-sm text-slate-500">{auth?.user?.email}</p>
            <p className="text-xs text-brand">Vai tro: {auth?.user?.role}</p>
          </div>
        </div>

        {shopLink && (
          <Link to={shopLink} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
            Vao cua hang
          </Link>
        )}

        <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <input required className="w-full rounded-lg border p-3" placeholder="Ten dang nhap" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} />
          <input required className="w-full rounded-lg border p-3" placeholder="Ho ten" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
          <input className="w-full rounded-lg border p-3" placeholder="So dien thoai" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <input className="w-full rounded-lg border p-3" placeholder="URL avatar" value={form.avatar} onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))} />
          {message && <p className="text-sm text-brand">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-lg bg-brand p-3 font-semibold text-white">{loading ? "Dang luu..." : "Luu ho so"}</button>
        </form>

        <button onClick={logout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Dang xuat</button>
      </main>
    </div>
  );
};

export const UserProfilePage = () => (
  <ProfileForm apiPath="/user/profile" title="Ho so thanh vien" shopLink="/" />
);

export const AdminProfilePage = () => (
  <ProfileForm apiPath="/admin/profile" title="Ho so quan tri" shopLink={null} />
);

export default UserProfilePage;
