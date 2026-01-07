import { Navigate } from "react-router";
import useAuthStore from "@/lib/store/authStore";

const PublicRoute = ({ children }) => {
  const { token, isAuthenticated } = useAuthStore();

  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
