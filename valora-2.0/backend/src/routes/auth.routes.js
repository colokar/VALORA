// Importa el enrutador de Express para crear endpoints modulares
import { Router } from "express";

// Importa los controladores
import {
    registerController,
    loginController,
    logoutController,
    getUserByIdController,
    updateUserDateController,
    updateUserCompanyController,
    updateUserLogoController,
    updateUserRubroCargoController,
    updatePasswordController,
    forgotPasswordController,
    resetPasswordController
} from "../controllers/auth.controller.js";


// Validaciones
import {
    registerValidation,
    loginValidation
} from "../validators/auth.validator.js";


// Configuración subida archivos
import upload from "../config/multer.config.js";


// Rate limit
import {
    authLimiter
} from "../middlewares/rateLimiter.middleware.js";


// Middlewares
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";


const router = Router();



// =========================
// AUTENTICACIÓN
// =========================


router.post(
    "/register",
    authLimiter,
    registerValidation,
    validate,
    registerController
);



router.post(
    "/login",
    authLimiter,
    loginValidation,
    validate,
    loginController
);



// =========================
// RECUPERAR CONTRASEÑA
// =========================


// Solicita email para recuperar contraseña
router.post(
    "/forgot-password",
    authLimiter,
    forgotPasswordController
);



// Cambia contraseña usando token
router.post(
    "/reset-password/:token",
    authLimiter,
    resetPasswordController
);



// =========================
// SESIÓN
// =========================


router.post(
    "/logout",
    authMiddleware,
    logoutController
);



router.get(
    "/me",
    authMiddleware,
    getUserByIdController
);



// =========================
// ACTUALIZAR USUARIO
// =========================


router.put(
    "/update",
    authMiddleware,
    updateUserDateController
);



router.put(
    "/updateRubroCargo",
    authMiddleware,
    updateUserRubroCargoController
);



router.put(
    "/updateCompany",
    authMiddleware,
    updateUserCompanyController
);



router.patch(
    "/updateLogo",
    authMiddleware,
    upload.single("logo"),
    updateUserLogoController
);



// =========================
// CAMBIAR CONTRASEÑA LOGUEADO
// =========================


router.put(
    "/updatePassword",
    authMiddleware,
    updatePasswordController
);



export default router;