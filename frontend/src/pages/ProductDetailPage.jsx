import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import Header from "../components/layout/Header";
import ProductCard from "../components/product/ProductCard";
import ProductImageSlider from "../components/product/ProductImageSlider";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState("");
  const { addToCart } = useCart();

  const load = useCallback(async () => {
    const { data } = await api.get(`/products/${id}`);
    setProduct(data);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      setToast("Da them vao gio hang");
      setTimeout(() => setToast(""), 2000);
    } catch (err) {
      setToast(err.response?.data?.message || "Khong the them vao gio");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setAdding(false);
    }
  };

  if (!product) return <div className="p-6">Loading...</div>;

  const outOfStock = product.stock === 0;

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <p className="text-sm text-slate-500">Trang chu / {product.category_name} / {product.name}</p>
        {toast && (
          <div className="rounded-lg bg-teal-50 px-4 py-2 text-sm text-brand">{toast}</div>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          <ProductImageSlider images={product.images} />
          <section className="space-y-3 rounded-xl bg-white p-5 ring-1 ring-slate-200">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p>{product.description}</p>
            <p className="font-bold text-accent">{Number(product.price).toLocaleString("vi-VN")} VND</p>
            <p>Hang ton: <b>{product.stock}</b></p>
            <p>Da ban: <b>{product.sales_count}</b></p>
            <div className="flex flex-wrap items-center gap-2">
              <input type="number" min={1} max={Math.max(1, product.stock)} disabled={outOfStock} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-24 rounded-lg border p-2" />
              <button
                disabled={outOfStock || adding}
                onClick={handleAddToCart}
                className="rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {outOfStock ? "Het hang" : adding ? "Dang them..." : "Them vao gio"}
              </button>
              {!outOfStock && (
                <Link to="/cart" className="rounded-lg border border-brand px-4 py-2 font-semibold text-brand">
                  Xem gio hang
                </Link>
              )}
            </div>
          </section>
        </div>

        <section>
          <h2 className="mb-3 text-xl font-bold">San pham tuong tu</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {product.relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetailPage;
