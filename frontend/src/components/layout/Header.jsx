import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { auth, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-brand">Sneaker One</Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/cart" className="relative rounded-lg px-2 py-2 text-sm font-medium hover:bg-slate-100 sm:px-3">
            Gio hang
            {cart.itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                {cart.itemCount}
              </span>
            )}
          </Link>
          <Link to="/orders" className="hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 sm:block">
            Don hang
          </Link>
          <Link to="/user/profile" className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100">
            <img src={auth?.user?.avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
            <span className="hidden text-sm font-semibold sm:block">{auth?.user?.username}</span>
          </Link>
          <button onClick={logout} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
