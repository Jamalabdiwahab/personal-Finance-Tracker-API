import { Navigate, useLocation } from "react-router";
import useAuthStore from "@/lib/store/authStore";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
