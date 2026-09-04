import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as api from "../services/api";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { usuario } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [items, setItems] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const recargarTodo = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    const [emp, cli, its, pre] = await Promise.all([
      api.getEmpresa(usuario.empresaId),
      api.getClientes(usuario.empresaId),
      api.getItems(usuario.empresaId),
      api.getPresupuestos(usuario.empresaId),
    ]);
    setEmpresa(emp);
    setClientes(cli);
    setItems(its);
    setPresupuestos(pre.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)));
    setCargando(false);
  }, [usuario]);

  useEffect(() => {
    if (usuario) recargarTodo();
  }, [usuario, recargarTodo]);

  async function recargarPresupuestos() {
    if (!usuario) return;
    const pre = await api.getPresupuestos(usuario.empresaId);
    setPresupuestos(pre.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)));
  }

  async function recargarClientes() {
    if (!usuario) return;
    setClientes(await api.getClientes(usuario.empresaId));
  }

  async function recargarItems() {
    if (!usuario) return;
    setItems(await api.getItems(usuario.empresaId));
  }

  return (
    <DataContext.Provider
      value={{
        empresa, setEmpresa, clientes, items, presupuestos, cargando,
        recargarTodo, recargarPresupuestos, recargarClientes, recargarItems,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de DataProvider");
  return ctx;
}
