import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import Header from "../components/layout/Header";
import { formatCurrency, PAYMENT_METHOD_LABELS } from "../utils/orderUtils";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    note: "",
    paymentMethod: "COD",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders/payment-methods").then(({ data }) => setMethods(data.methods));
  }, []);

  const shippingFee = cart.subtotal >= 2000000 ? 0 : 30000;
  const total = cart.subtotal + (cart.items.length ? shippingFee : 0);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders/checkout", form);
      await refreshCart();
      if (data.paymentInfo?.redirectUrl && form.paymentMethod !== "COD") {
        window.open(data.paymentInfo.redirectUrl, "_blank");
      }
      navigate(`/orders/${data.order.id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Dat hang that bai");
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.items.length) {
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-6">
          <p>Gio hang trong. <Link to="/" className="text-brand underline">Quay lai mua sam</Link></p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <h1 className="text-2xl font-bold">Thanh toan don hang</h1>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="font-semibold">Thong tin giao hang</h2>
            <input
              required
              placeholder="Ho ten nguoi nhan"
              value={form.shippingName}
              onChange={(e) => handleChange("shippingName", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              required
              placeholder="So dien thoai"
              value={form.shippingPhone}
              onChange={(e) => handleChange("shippingPhone", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <textarea
              required
              rows={3}
              placeholder="Dia chi giao hang"
              value={form.shippingAddress}
              onChange={(e) => handleChange("shippingAddress", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <textarea
              rows={2}
              placeholder="Ghi chu (tuy chon)"
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </section>

          <section className="space-y-4">
            <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="mb-3 font-semibold">Phuong thuc thanh toan</h2>
              <div className="space-y-2">
                {methods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                      form.paymentMethod === m.id ? "border-brand bg-teal-50" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={form.paymentMethod === m.id}
                      onChange={(e) => handleChange("paymentMethod", e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">
                        {PAYMENT_METHOD_LABELS[m.id] || m.label}
                        {m.required && <span className="ml-1 text-xs text-brand">(Bat buoc co san)</span>}
                      </p>
                      <p className="text-xs text-slate-500">{m.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="mb-3 font-semibold">Tom tat don hang</h2>
              <p className="text-sm text-slate-600">{cart.itemCount} san pham</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><span>Tam tinh</span><span>{formatCurrency(cart.subtotal)}</span></div>
                <div className="flex justify-between"><span>Phi ship</span><span>{shippingFee === 0 ? "Mien phi" : formatCurrency(shippingFee)}</span></div>
                <div className="flex justify-between border-t pt-2 font-bold"><span>Tong</span><span className="text-accent">{formatCurrency(total)}</span></div>
              </div>
              {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full rounded-lg bg-brand py-3 font-semibold text-white disabled:bg-slate-300"
              >
                {submitting ? "Dang xu ly..." : "Dat hang"}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
