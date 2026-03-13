import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-bold text-fg">
        Authenticating...
      </div>
    );
  }

  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default ProtectedRoute;
