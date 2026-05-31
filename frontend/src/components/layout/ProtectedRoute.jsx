import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useAuth();

  if (!auth?.token) return <Navigate to="/login" replace />;

  if (role && auth.user?.role !== role) {
    const fallback = auth.user?.role === "admin" ? "/admin/profile" : "/user/profile";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
