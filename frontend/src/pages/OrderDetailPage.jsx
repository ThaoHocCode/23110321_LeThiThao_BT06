import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../api/client";
import Header from "../components/layout/Header";
import OrderStatusTracker from "../components/order/OrderStatusTracker";
import {
  formatCurrency,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "../utils/orderUtils";

const OrderDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState(location.state?.justPlaced ? "Dat hang thanh cong!" : "");

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Khong the tai thong tin don hang");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const handleCancel = async () => {
    const isRequest = order.cancelAction === "request";
    const confirmMsg = isRequest
      ? "Shop dang chuan bi hang. Ban se gui yeu cau huy don cho shop. Tiep tuc?"
      : "Ban co chac muon huy don hang nay?";
    if (!window.confirm(confirmMsg)) return;

    setCancelling(true);
    try {
      const { data } = await api.post(`/orders/${id}/cancel`);
      setOrder(data);
      setMessage(isRequest ? "Da gui yeu cau huy don cho shop" : "Don hang da duoc huy");
    } catch (err) {
      setMessage(err.response?.data?.message || "Khong the huy don");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-6">Dang tai...</main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-6 text-rose-500">{error || "Khong tim thay don hang"}</main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <Link to="/orders" className="text-sm text-brand underline">
              Quay lai lich su
            </Link>
            <h1 className="text-2xl font-bold">Don hang {order.order_code}</h1>
            <p className="text-sm text-slate-500">
              Dat luc: {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
          </div>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-brand">
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        {message && (
          <div className="rounded-lg bg-teal-50 p-3 text-sm text-brand">{message}</div>
        )}

        <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-4 font-semibold">Theo doi don hang</h2>
          <OrderStatusTracker status={order.status} />
          {order.status === "new" && (
            <p className="mt-3 text-xs text-slate-500">
              Don hang se tu dong duoc xac nhan sau 30 phut neu shop chua xu ly.
            </p>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="mb-3 font-semibold">Thong tin giao hang</h2>
            <p>{order.shipping_name}</p>
            <p className="text-sm text-slate-600">{order.shipping_phone}</p>
            <p className="text-sm text-slate-600">{order.shipping_address}</p>
            {order.note && <p className="mt-2 text-sm italic text-slate-500">Ghi chu: {order.note}</p>}
          </div>
          <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="mb-3 font-semibold">Thanh toan</h2>
            <p>{PAYMENT_METHOD_LABELS[order.payment_method]}</p>
            <p className="text-sm text-slate-600">Trang thai: {order.payment_status}</p>
            <p className="mt-2 font-bold text-accent">{formatCurrency(order.total)}</p>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-3 font-semibold">San pham</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  {item.product_image && (
                    <img src={item.product_image} alt="" className="h-14 w-14 rounded object-cover" />
                  )}
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-slate-500">x{item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">{formatCurrency(item.lineTotal)}</p>
              </div>
            ))}
          </div>
        </section>

        {order.statusLogs?.length > 0 && (
          <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="mb-3 font-semibold">Lich su cap nhat</h2>
            <ul className="space-y-2 text-sm">
              {order.statusLogs.map((log) => (
                <li key={log.id} className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span>{ORDER_STATUS_LABELS[log.status] || log.status}</span>
                  <span className="text-slate-500">{new Date(log.created_at).toLocaleString("vi-VN")}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {order.canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
          >
            {cancelling
              ? "Dang xu ly..."
              : order.cancelAction === "request"
                ? "Gui yeu cau huy don"
                : "Huy don hang"}
          </button>
        )}
      </main>
    </div>
  );
};

export default OrderDetailPage;
