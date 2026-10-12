import { Router } from "express";

import {
    createPresupuesto,
    getPresupuestoById,
    addPdfController,
    filtroPresuestoController,
    getDashboardController,
    getBudgetController,
    downloadPdfController,
    updateStateController,
    updatePublicStateController,
    getPublicPresupuestoController,
    updatePresupuestoController,
    
} from "../controllers/presupuesto.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateUUID } from "../middlewares/validateUUID.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// ==========================================
// RUTA PÚBLICA
// ==========================================

router.patch(
    "/public/:id/estado",
    validateUUID,
    updatePublicStateController
);

router.get(
    "/public/:id",
    validateUUID,
    getPublicPresupuestoController
);

// Todas las rutas de presupuestos requieren autenticación
router.use(authMiddleware);

// ==========================================
// 1. RUTAS ESTÁTICAS (PRIMERO)
// ==========================================

// Ruta para el dashboard general
router.get("/dashboard", getDashboardController);

// Ruta para la lista con paginación
router.get("/lista", getBudgetController);

// Ruta para listar/filtrar presupuestos en general
router.get("/", filtroPresuestoController);


// ==========================================
// 2. RUTAS DINÁMICAS Y DE ACCIÓN (DESPUÉS)
// ==========================================

// Crear un presupuesto
router.post("/", createPresupuesto);

// Actualizar PDF
router.put("/:presupuestoId/pdf", upload.single("pdf"), addPdfController);

router.put(
    "/:id",
    validateUUID,
    updatePresupuestoController
);

// Descargar PDF
router.get("/:id/pdf", validateUUID, downloadPdfController);

// Ruta por ID
router.get("/:id", validateUUID, getPresupuestoById);
//Ruta de ID PARA CAMBIAR EL ESTADO
router.patch("/:id", validateUUID, updateStateController);


export default router;