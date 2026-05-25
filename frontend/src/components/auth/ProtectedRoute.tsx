import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../services/auth/authService";

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const valid = await authService.validateSession();
      if (mounted) {
        setIsAuthenticated(valid);
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-text-secondary">
        Validando sessão...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
