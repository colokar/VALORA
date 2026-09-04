import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TabLayout from "./components/TabLayout";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NewBudget from "./pages/NewBudget";
import History from "./pages/History";
import BudgetDetail from "./pages/BudgetDetail";
import PublicBudget from "./pages/PublicBudget";
import Profile from "./pages/Profile";

import MyData from "./pages/perfil/MyData";
import MyCompany from "./pages/perfil/MyCompany";
import Security from "./pages/perfil/Security";
import Items from "./pages/perfil/Items";
import Clients from "./pages/perfil/Clients";
import TeamUsers from "./pages/perfil/TeamUsers";
import Notifications from "./pages/perfil/Notifications";
import Appearance from "./pages/perfil/Appearance";
import Help from "./pages/perfil/Help";
import Terms from "./pages/perfil/Terms";
import About from "./pages/perfil/About";


function Providers({ children }) {
  return (
    <AuthProvider>
      <DataProvider>{children}</DataProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          {/* Raíz: redirige según sesión */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/home" replace />
              </ProtectedRoute>
            }
          />

          {/* Públicas / sin sesión */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
          <Route path="/registro" element={<Register />} />
          {/* Vista pública compartida con el cliente (link o PDF) */}
          <Route path="/p/:id" element={<PublicBudget />} />

          {/* Requiere sesión, sin onboarding completo aún (sin navbar) */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requiereOnboarding={false}>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Todo lo demás: requiere sesión + onboarding, y SIEMPRE tiene navbar */}
          <Route
            element={
              <ProtectedRoute>
                <TabLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nuevo-presupuesto" element={<NewBudget />} />
            <Route path="/nuevo-presupuesto/:id" element={<NewBudget />} />
            <Route path="/historial" element={<History />} />
            <Route path="/presupuesto/:id" element={<BudgetDetail />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/perfil/mis-datos" element={<MyData />} />
            <Route path="/perfil/mi-empresa" element={<MyCompany />} />
            <Route path="/perfil/seguridad" element={<Security />} />
            <Route path="/perfil/items" element={<Items />} />
            <Route path="/perfil/clientes" element={<Clients />} />
            <Route path="/perfil/usuarios" element={<TeamUsers />} />
            <Route path="/perfil/notificaciones" element={<Notifications />} />
            <Route path="/perfil/apariencia" element={<Appearance />} />
            <Route path="/perfil/ayuda" element={<Help />} />
            <Route path="/perfil/terminos" element={<Terms />} />
            <Route path="/perfil/acerca-de" element={<About />} />
          </Route>

          {/* Cualquier otra ruta */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}
