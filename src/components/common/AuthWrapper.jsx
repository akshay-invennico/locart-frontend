import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let accessToken = null;
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        accessToken = parsed?.tokens?.accessToken || null;
      }
    } catch (_) {}

    const isAuthRoute = location.pathname?.startsWith("/auth") || location.pathname?.startsWith("/stylists/auth");

    if (!accessToken && !isAuthRoute) {
      navigate("/auth", { replace: true });
      return;
    }

    if (accessToken && isAuthRoute) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
}
