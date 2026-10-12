/**
 * ==================================================
 * Rutas protegidas — fuente única de verdad
 * ==================================================
 * Usado tanto por el middleware (protección real de rutas)
 * como por NavbarWrapper (para decidir si mostrar el nav).
 * Mantenerlas en un solo lugar evita que se desincronicen.
 **/

export const PROTECTED_ROUTES = [
  "/home",
  "/dashboard",
  "/clientes",
  "/items",
  "/productos",
  "/presupuestos",
  "/historial",
  "/perfil",
  "/acerca",
];

export const AUTH_ROUTES = [
  "/login",
  "/register",
];