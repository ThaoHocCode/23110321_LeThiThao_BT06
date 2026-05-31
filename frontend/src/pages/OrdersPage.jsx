import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import Header from "../components/layout/Header";
import { formatCurrency, ORDER_STATUS_LABELS } from "../utils/orderUtils";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <h1 className="text-2xl font-bold">Lich su mua hang</h1>

        {loading ? (
          <p>Dang tai...</p>
        ) : !orders.length ? (
          <div className="rounded-xl bg-white p-8 text-center ring-1 ring-slate-200">
            <p className="text-slate-500">Chua co don hang nao</p>
            <Link to="/" className="mt-4 inline-block text-brand underline">
              Mua sam ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-xl bg-white p-4 ring-1 ring-slate-200 transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{order.order_code}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-brand">
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>{order.items?.length || 0} san pham</span>
                  <span className="font-bold text-accent">{formatCurrency(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
