import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    alert("ProtectedRoute: Not authenticated, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  // if (user?.isFirstLogin && location.pathname !== "/change-password") {
  //   return <Navigate to="/change-password" replace />;
  // }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
