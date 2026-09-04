import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./Common";

export default function ProtectedRoute({ children, requiereOnboarding = true }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return <div className="app-shell"><Loader /></div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (requiereOnboarding && !usuario.onboardingCompleto) return <Navigate to="/onboarding" replace />;

  return children;
}
