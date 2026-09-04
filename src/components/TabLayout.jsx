import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

// Las páginas hijas ya incluyen su propio contenedor .app-shell,
// acá solo agregamos la barra inferior fija por encima de todas ellas.
export default function TabLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
