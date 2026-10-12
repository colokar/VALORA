import authRoutes from "./auth.routes.js";
import clienteRoutes from "./cliente.routes.js";
import itemRoutes from "./item.routes.js";
import presupuestoRoutes from "./presupuesto.routes.js";


export default (app) => {

    /* ==============================
       AUTH
    ============================== */

    app.use("/api/auth", authRoutes);

    /* ==============================
         CLIENTES
    ============================== */
    app.use("/api/clientes", clienteRoutes);

    /* ==============================
         ÍTEMS
    ============================== */

    app.use("/api/items", itemRoutes);

     /* ==============================
         PRESUPUESTOS
    ============================== */

    app.use("/api/presupuestos", presupuestoRoutes);
}