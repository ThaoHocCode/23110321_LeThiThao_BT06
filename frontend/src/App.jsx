import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { UserProfilePage, AdminProfilePage } from "./pages/ProfilePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryInfinitePage from "./pages/CategoryInfinitePage";
import HighlightsPage from "./pages/HighlightsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

const GuestOnly = ({ children }) => {
  const { auth } = useAuth();
  if (auth?.token) {
    return <Navigate to={auth.user?.role === "admin" ? "/admin/profile" : "/"} replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
    <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
    <Route path="/forgot-password" element={<GuestOnly><ForgotPasswordPage /></GuestOnly>} />

    <Route path="/user/profile" element={<ProtectedRoute role="user"><UserProfilePage /></ProtectedRoute>} />
    <Route path="/admin/profile" element={<ProtectedRoute role="admin"><AdminProfilePage /></ProtectedRoute>} />

    <Route path="/" element={<ProtectedRoute role="user"><HomePage /></ProtectedRoute>} />
    <Route path="/products/:id" element={<ProtectedRoute role="user"><ProductDetailPage /></ProtectedRoute>} />
    <Route path="/category-infinite" element={<ProtectedRoute role="user"><CategoryInfinitePage /></ProtectedRoute>} />
    <Route path="/highlights" element={<ProtectedRoute role="user"><HighlightsPage /></ProtectedRoute>} />
    <Route path="/cart" element={<ProtectedRoute role="user"><CartPage /></ProtectedRoute>} />
    <Route path="/checkout" element={<ProtectedRoute role="user"><CheckoutPage /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute role="user"><OrdersPage /></ProtectedRoute>} />
    <Route path="/orders/:id" element={<ProtectedRoute role="user"><OrderDetailPage /></ProtectedRoute>} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <nav className="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 py-3 text-sm">
          <Link to="/" className="underline">Trang chu</Link>
          <Link to="/category-infinite" className="underline">Danh muc</Link>
          <Link to="/highlights" className="underline">Noi bat</Link>
          <Link to="/cart" className="underline">Gio hang</Link>
          <Link to="/orders" className="underline">Don hang</Link>
          <Link to="/user/profile" className="underline">Ho so</Link>
        </nav>
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;
