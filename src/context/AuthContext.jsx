import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.getSesionActual().then((u) => {
      setUsuario(u);
      setCargando(false);
    });
  }, []);

  async function login(email, password) {
    const u = await api.login(email, password);
    setUsuario(u);
    return u;
  }

  async function registrar(datos) {
    const u = await api.registrar(datos);
    setUsuario(u);
    return u;
  }

  async function cerrarSesion() {
    await api.cerrarSesion();
    setUsuario(null);
  }

  async function refrescarUsuario() {
    const u = await api.getSesionActual();
    setUsuario(u);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registrar, cerrarSesion, refrescarUsuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
