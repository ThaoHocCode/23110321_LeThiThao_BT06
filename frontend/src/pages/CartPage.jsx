import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/layout/Header";
import { formatCurrency, getFirstImage } from "../utils/orderUtils";

const CartPage = () => {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const shippingFee = cart.subtotal >= 2000000 ? 0 : 30000;
  const total = cart.subtotal + (cart.items.length ? shippingFee : 0);

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <h1 className="text-2xl font-bold">Gio hang</h1>

        {!cart.items.length ? (
          <div className="rounded-xl bg-white p-8 text-center ring-1 ring-slate-200">
            <p className="text-slate-500">Gio hang trong</p>
            <Link to="/" className="mt-4 inline-block text-brand underline">
              Tiep tuc mua sam
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-slate-200"
                >
                  <img
                    src={getFirstImage(item.product.images)}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/products/${item.product.id}`} className="font-semibold hover:text-brand">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-accent">{formatCurrency(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={item.product.stock}
                        value={item.quantity}
                        disabled={loading}
                        onChange={(e) => updateQuantity(item.cartItemId, Number(e.target.value))}
                        className="w-20 rounded-lg border p-2 text-sm"
                      />
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        disabled={loading}
                        className="text-sm text-rose-600 hover:underline"
                      >
                        Xoa
                      </button>
                    </div>
                  </div>
                  <p className="font-bold">{formatCurrency(item.lineTotal)}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tam tinh</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phi van chuyen</span>
                  <span>{shippingFee === 0 ? "Mien phi" : formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Tong cong</span>
                  <span className="text-accent">{formatCurrency(total)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="mt-4 block rounded-lg bg-brand py-3 text-center font-semibold text-white"
              >
                Thanh toan
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CartPage;
